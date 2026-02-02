# chatbot by Gemini
`Gemini`を利用したテキストと画像、PDFファイルを通じたやり取りが行えるチャットボット機能  
[詳細なプロンプト設定は`src/constance/prompt.ts`に記載](/src/constance/prompt.ts)しています。  
バックエンド側の設定は`gemini-proxy/src/config/theConfig.ts`です。  
現状全てのリクエストを受け付ける設定になっているので、エンドポイントアクセスへのホワイトリストを設定したい場合は`gemini-proxy/src/index.ts`内のCORS設定を調整（コメントアウトの有効化）してください。

---

> [!NOTE]
> フロントエンドとバックエンドが共存するモノレポです。  
> - フロントエンド： `src`（React / vite）
> - バックエンド： `gemini-proxy`（hono / cloudflare workers）

---

> [!NOTE]
> - **画像やPDFファイルを通じたやり取りが必要ない場合**  
> 現状の実装（[Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja)）でも問題ないですが`src/components/ChatForm.tsx`内の`useGenerateChat`カスタムフックを`useGenerateChat_OnlyTxt`に変更及び調整することでテキスト専用チャットボットになります。  
> この際、不要となるファイルアップロードコンポーネント`FileUploader`や関連箇所、関連State, 関連する型の読み込みなどを削除する必要があります。  
> ※`useGenerateChat_OnlyTxt`はSDKの将来的な変更に備えて標準的な実装として残している意図があります。

## 技術構成
- @eslint/js@9.39.2
- @google/genai@1.39.0
- @types/node@25.2.0
- @types/react-dom@19.2.3
- @types/react@19.2.10
- @vitejs/plugin-react@5.1.2
- babel-plugin-react-compiler@1.0.0
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.5.0
- eslint-plugin-react@7.37.5
- eslint@9.39.2
- globals@17.3.0
- react-dom@19.2.4
- react-markdown@10.1.0
- react@19.2.4
- typescript-eslint@8.54.0
- typescript@5.9.3
- vite@7.3.1

## 必要な設定
### 1. `.env`ファイルを用意
※使用・試用には**GeminiのAPIキーと バックエンド実行環境（※CloudFlareを想定）が必要**となります

```bash
VITE_GEMINI_API_KEY = GeminiのAPIキー
VITE_CLOUDFLARE_SUBDOMAIN = CloudFlareのサブドメイン
```

> [!IMPORTANT]
> - ※ viteの場合： `.env`ファイルのキー名は`""`でラップしたり、末尾に`;`を付けたりしない
> - ※ viteプロジェクトなので`VITE_`のプレフィックスが必要

### 2. バックエンド側のディレクトリルートに`.dev.vars`ファイルを用意
- `.dev.vars`  
バックエンド（CloudFlare Workers）を起動するツール（`wrangler`）だけが読む秘密のメモ帳
```bash
GEMINI_API_KEY = GeminiのAPIキー
```

## 使用方法
### 開発環境
#### バックエンド（CloudFlare Workers）の起動
1. ターミナルを開いて、バックエンド側のディレクトリへ移動
```bash
cd gemini-proxy
```

2. バックエンド（CloudFlare Workers）の起動
```bash
npm run dev
```

`Ready on http://localhost:8787`と表示されればOK。  
**このターミナルは開いたままに**しておく。


#### フロントエンド (React) の起動
1. 別のターミナルを開いて、プロジェクトのルートにいることを確認。バックエンド側のディレクトリ（`gemini-proxy `）ではなく親フォルダにいることを確認する。
2. フロントエンド側の立ち上げ
```bash
npm run dev
```

`Local: http://localhost:5173`などが表示されればOK  
上記にアクセスしてチャットボットに問いかけてみてください。
