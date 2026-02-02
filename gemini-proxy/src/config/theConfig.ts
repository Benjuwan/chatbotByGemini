// Gemini のモデル指定
// https://ai.google.dev/gemini-api/docs/models?hl=ja
export const GEMINI_MODEL = "gemini-2.5-flash";

// CORS設定（許可するオリジンのリスト）
// ここにフロントエンドのURL（ローカル開発用、本番用など）を列挙します
export const ALLOWED_ORIGINS: string[] = [
    'http://localhost:5173',                // ローカル開発用(Vite)
    'http://localhost:3000',                // 別ポートの場合の予備
    //   'https://your-production.pages.dev',    // チャットボットの埋め込み先ドメイン
];
