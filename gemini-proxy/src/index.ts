import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { GEMINI_MODEL } from './config/theConfig';
import { promptInjectionDetector } from './hooks/promptInjectionDetector';

// 環境変数の型定義
type Bindings = {
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// -------------- CAOUTION | 現状はどこからでも受け付ける設定
app.use('/*', cors());

// 許可ドメインを制御する場合は以下を有効化
// app.use('/*', cors({
//   origin: (origin) => {
//     // 開発中などで origin がない場合（curlなど）や、許可リストに含まれている場合はそのオリジンを返す
//     if (!origin || ALLOWED_ORIGINS.includes(origin)) {
//       return origin;
//     }
//     // リストにない場合は許可しない（nullまたはundefinedを返すとブロックされる）
//     return undefined; 
//   },
// }));

// `src/constance/prompt.ts`の WORKER_ENDPOINT を叩く
app.post('/api/generate', async (c) => {
  try {
    // リクエストボディの取得（`prompt`,`model`,`imageParts`を受け付ける）
    const { prompt, model = GEMINI_MODEL, imageParts } = await c.req.json();

    // APIキーの確認
    if (!c.env.GEMINI_API_KEY) {
      return c.json({ error: 'API Key not configured' }, 500);
    }

    // 旧SDK： [Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja) -> `import { GoogleGenerativeAI } from "@google/generative-ai";`
    // 新SDK： [Gemini API のクイックスタート](https://ai.google.dev/gemini-api/docs/quickstart?lang=node&hl=ja)を利用 -> `import { GoogleGenAI } from "@google/genai";`

    const genAI = new GoogleGenAI({ apiKey: c.env.GEMINI_API_KEY });

    const checkPromptInjection = promptInjectionDetector(prompt);
    if (checkPromptInjection.isInjection) {
      const errorMess = `不正なプロンプトを検出 | 
          isInjection： ${checkPromptInjection.isInjection}
          matchedPatterns： ${JSON.stringify(checkPromptInjection.matchedPatterns)}
          normalizedInput： ${checkPromptInjection.normalizedInput}
        `;
      console.error(errorMess);

      return c.json({
        error: errorMess
      }, 400); // 400 Bad Request を指定 
    }

    const result = await genAI.models.generateContent({
      model: model,
      contents: typeof imageParts === 'undefined' ?
        prompt : [prompt, ...imageParts],
      config: GEMINI_MODEL.includes('gemini-3') ? {
        // [思考レベル | Gemini 3 からの対応](https://ai.google.dev/gemini-api/docs/gemini-3?hl=ja#thinking_level)
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        }
      } : undefined,
    });

    return c.json({ text: result.text });

  } catch (error) {
    console.error('Worker API error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

export default app;
