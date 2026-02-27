import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { GEMINI_MODEL } from './config/theConfig';
import { promptInjectionDetector } from './hooks/promptInjectionDetector';

type Bindings = {
  GEMINI_API_KEY: string;
};

type ErrorStatusType = {
  code: ContentfulStatusCode; // hono が提供する HTTP ステータスコードの型を使用
  message: string;
  status: string;
};

// error が ErrorStatusType 型であるかを判定する型ガード関数
const _checkErrorStatusType = (error: unknown): error is ErrorStatusType => {
  return error !== null && typeof error === "object" && (
    Object.hasOwn(error, "code") ||
    Object.hasOwn(error, "message") ||
    Object.hasOwn(error, "status")
  );
}

const app = new Hono<{ Bindings: Bindings }>();

// CAUTION | 現状はどこからでも受け付ける設定
app.use('/*', cors());

// 許可ドメインを制御する場合は以下を有効化する
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

    // プロンプトインジェクション攻撃の検知関数
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
      config: model.includes('gemini-3') ? {
        // [思考レベル | Gemini 3 からの対応](https://ai.google.dev/gemini-api/docs/gemini-3?hl=ja#thinking_level)
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        }
      } : undefined,
    });

    return c.json({ text: result.text });
  } catch (error: unknown) {
    console.error('Worker API error:', error);

    // `_checkErrorStatusType`関数が true を返したならスコープ（ifブロック）内では、
    // 引数として渡された error は ErrorStatusType 型であると保証される
    if (_checkErrorStatusType(error)) {
      return c.json({
        error: {
          code: error.code,
          message: error.message,
          status: error.status,
        },
      }, error.code);
    }

    return c.json({ error: String(error) }, 500);
  }
});

export default app;
