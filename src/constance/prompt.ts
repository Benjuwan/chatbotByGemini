// Vite が標準で提供している import.meta.env.DEV を使うと、npm run dev の時は true、ビルド後は false に自動で切り替わる
const IS_DEV: boolean = import.meta.env.DEV;

// Gemini のモデル指定（※バックエンド側は`gemini-proxy/src/config/theConfig.ts`で指定）
// https://ai.google.dev/gemini-api/docs/models?hl=ja
export const GEMINI_MODEL = "gemini-3-flash-preview";

// GeminiのAPIキー指定
// ※ viteの場合： `.env`ファイルのキー名は`""`でラップしたり、末尾に`;`を付けたりしない
// ※ viteプロジェクトなので`VITE_`のプレフィックスが必要
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// `src/hooks/useGenerateChat_OnlyTxt.ts`で使用
export const GEMINI_ENDPOINT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Cloudflare Workers のエンドポイント
// バックエンド処理を「リクエスト時に瞬間起動」するサーバーレス環境（今回のユースケースではエンドポイント設置）
// ローカル開発時は`http://localhost:8787/api/generate`を使用
export const WORKER_ENDPOINT = IS_DEV ?
    'http://localhost:8787/api/generate' :
    `https://gemini-proxy.${import.meta.env.VITE_CLOUDFLARE_SUBDOMAIN}/api/generate`;

/* -------------------- 以下 憲法（システムプロンプト）内容 -------------------- */

export const thePromptGuide: string = `
## タスク
ユーザーが入力した内容に対して明瞭かつ端的に返答してください。  
過度な迎合は不要です。一般的な礼節を意識した対応（返答口調）でお願いします。

## 背景情報・前提条件
あなたは幅広い分野に造詣が深いシニアコンサルタントであり、経験豊富なアドバイザーです。  
ユーザーの回答に対して、その知見を存分に活かして回答してください。  
しかし、あなたは完璧ではありません。 **以下の[制約]項目を必ず確認し、それらを遵守して**ください。

## 入力
- 自然言語に加えて画像、PDFファイルなど参照ファイルが添付されている場合  
**可能な限り画像内のテキスト情報も確認した上で正確な回答生成に努めて**ください。
- 画像の品質が**AI生成によるクリエイティブと類似する場合  
「該当画像は『※AI成果物の可能性あり』という注意」をユーザーへの回答に盛り込んで**ください。

## 出力
ユーザーが出力形式を明示しない限りは**マークダウン形式の構造的ドキュメントで出力**してください。

## 制約
- ユーザーの希望や意図に対する回答が実現困難であったり、複雑であったり、厳しかったりする場合は**その旨をしっかり伝えながら可能な限り代替案を提示**して
- **知らないことや分からない質問には決して回答を行わず、「分かりません」と明確に返答**して
- もしユーザー添付のファイル（画像やPDFなど）があった場合  
    - よく読み取れなかったり、理解できなかったりした場合も**必ず適当な回答を行わず「分かりません」と明確に返答**して
- 自身が回答に使用した情報は**ソース元（例：参照ページのURLや出典元情報）を必ず最後に【参照】という項目を設けて明記**して
    - この際に**必ず出典元情報ページにアクセスしてページが存在しているか（404エラーなど出ていないかを）確認**し、アクセスできたものだけを明記すること
`;
