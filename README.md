# chatbot by Gemini
`Gemini API`を利用したテキストと画像、PDFファイルを通じたやり取りが行えるチャットボット機能  
[詳細なプロンプト設定は`src/constance/prompt.ts`に記載](/src/constance/prompt.ts)しています。    

バックエンド側の設定は`gemini-proxy/src/config/theConfig.ts`です。  
現状全てのリクエストを受け付ける設定になっているので、エンドポイントアクセスへのホワイトリストを設定したい場合は`gemini-proxy/src/index.ts`内のCORS設定を調整（コメントアウトの有効化）してください。

---

> [!NOTE]
> フロントエンドとバックエンドが共存するモノレポです。  
> - フロントエンド： `src`（React / vite）
> - バックエンド： `gemini-proxy`（hono / Cloudflare workers）

## フロントエンド関連の設定ファイル

- `src/constance/prompt.ts`  
フロントエンドで使用するモデルやエンドポイント、メタプロンプトの設定箇所ファイル。  
※ファイル内の`GEMINI_MODEL`, `GEMINI_API_KEY`, `GEMINI_ENDPOINT_URL`は`src/hooks/useGenerateChat_OnlyTxt.ts`用の変数です。

- `.env`  
フロントエンド用の`GEMINI_API_KEY`の設定と、Cloudflare Workers のエンドポイントの設定を担う環境変数ファイル。

## バックエンド（hono / Cloudflare workers）関連の設定ファイル

- `gemini-proxy/src/index.ts`  
バックエンド用のindexファイル。CORSをホワイトリスト設定する際に調整が必要（※現在はどこからでもアクセスを受け付ける仕様）

- `gemini-proxy/src/config/theConfig.ts`  
バックエンド用のモデル選定や、CORSのホワイトリストを設定するための設定ファイル。

- `gemini-proxy/.dev.vars`  
バックエンド用の`GEMINI_API_KEY`の設定ファイル。

---

> [!NOTE]
> - **画像やPDFファイルを通じたやり取りが必要ない場合**  
> 現状の実装（[Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja)）でも問題ないですが`src/components/ChatForm.tsx`内の`useGenerateChat`カスタムフックを`useGenerateChat_OnlyTxt`に変更及び調整することでテキスト専用チャットボットになります。  
> この際、不要となるファイルアップロードコンポーネント`FileUploader`や関連箇所、関連State, 関連する型の読み込みなどを削除する必要があります。  
> ※`useGenerateChat_OnlyTxt`はSDKの将来的な変更に備えて標準的な実装として残している意図があります。

## 技術構成（フロントエンド：`src`）
- @eslint/js@9.39.2
- @google/genai@1.41.0
- @tailwindcss/vite@4.1.18
- @types/node@25.2.3
- @types/react-dom@19.2.3
- @types/react@19.2.14
- @vitejs/plugin-react@5.1.4
- babel-plugin-react-compiler@1.0.0
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.5.0
- eslint-plugin-react@7.37.5
- eslint@9.39.2
- globals@17.3.0
- react-dom@19.2.4
- react-markdown@10.1.0
- react@19.2.4
- tailwindcss@4.1.18
- typescript-eslint@8.55.0
- typescript@5.9.3
- vite@7.3.1

## 技術構成（バックエンド：`gemini-proxy`）
- hono@4.11.9
- wrangler@4.64.0

> [!NOTE]
> `wrangler`はCloudflare Workersの公式CLIツール。  
> ※Windows環境で`wrangler`コマンドが認識されない場合は`npx wrangler dev`を使用し、  
> 案内に従って`wrangler`をインストール（`npm install -D wrangler`）してください。

---

## 必要な設定
### 1. `.env`ファイルを用意
※使用・試用には**GeminiのAPIキーと バックエンド実行環境（※Cloudflareを想定）が必要**となります

```bash
VITE_GEMINI_API_KEY = GeminiのAPIキー
VITE_CLOUDFLARE_SUBDOMAIN = Cloudflareのサブドメイン（例： https://<Worker の名前>.<ランダムな文字列>.workers.dev）
```

> [!IMPORTANT]
> - ※ viteの場合： `.env`ファイルのキー名は`""`でラップしたり、末尾に`;`を付けたりしない
> - ※ viteプロジェクトなので`VITE_`のプレフィックスが必要

### 2. バックエンド側のディレクトリルートに`.dev.vars`ファイルを用意
- `.dev.vars`  
バックエンド（Cloudflare Workers）を起動するツール（`wrangler`）だけが読む秘密のメモ帳
```bash
GEMINI_API_KEY = GeminiのAPIキー
```

## 使用方法
### 開発環境
#### バックエンド（Cloudflare Workers）の起動
1. ターミナルを開いて、バックエンド側のディレクトリへ移動
```bash
cd gemini-proxy
```

2. バックエンド（Cloudflare Workers）の起動
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

## Cloudflare Workers にエンドポイントを公開・設定する方法
※Cloudflare のアカウントが必須です。

> [!IMPORTANT]
> ### 別アプリでエンドポイントを新たに公開（発行）したい場合
> 既存の`gemini-proxy`ディレクトリ（hono / Cloudflare workers）を利用すると**一部変更するだけ**で簡単に Gemini API の新規エンドポイントを発行できる。  
> ただし、この**一部を修正しないと既存のエンドポイントが上書きされるリスクがある**ので注意。  
> 既存の`gemini-proxy`ディレクトリを流用して  Gemini API の新規エンドポイントを発行するには`gemini-proxy/wrangler.jsonc`ファイルを編集する。
> `gemini-proxy/wrangler.jsonc`ファイルを**一部変更**した後のフローは以下と同じく、`npx wrangler deploy` -> `npx wrangler secret put <環境変数名>`で Cloudflare Workers に接続する  
> - `gemini-proxy/wrangler.jsonc`
```diff
/**
 * For more details on how to configure Wrangler, refer to:
 * https://developers.Cloudflare.com/workers/wrangler/configuration/
 */
{
	"$schema": "node_modules/wrangler/config-schema.json",
-	"name": "gemini-proxy",
+	"name": "my-new-gemini-proxy",
	"main": "src/index.ts",
	"compatibility_date": "2026-01-28",
	"assets": {...
    ..
    .
```

### 1. バックエンド： `gemini-proxy`に移動
```bash
cd gemini-proxy
```

### 2. Cloudflare Workers にデプロイ
`gemini-proxy`にいる状態で以下のコマンドを実施
```bash
npx wrangler deploy
```

#### 環境変数（Gemini API キー）の設定
※今回設定する環境変数名は`GEMINI_API_KEY`
```bash
npx wrangler secret put <環境変数名>
```

1. このコマンドを打つと`Enter a secret value:`と聞かれる
2. GeminiのAPIキーをペーストして`Enter`を押下で設定完了

---

`npx wrangler deploy`が成功したときに表示された URL（例: https://gemini-proxy.あなたのアカウント.workers.dev）が公開エンドポイント。  
これを、フロントエンド側の`.env`ファイルに設定すれば完了。
```bash
# 生成したバックエンドドメインだけではなく、末尾に /api/generate を付ける
VITE_WORKER_ENDPOINT = https://gemini-proxy.あなたのアカウント.workers.dev/api/generate
```

> [!NOTE]
> ##### CORS設定の更新
> 現在、`gemini-proxy/src/config/theConfig.ts`の`ALLOWED_ORIGINS`（CORSのホワイトリスト）には`localhost`（開発用途アドレス）しか入っていないので  
> フロントエンドを本番公開（例：Cloudflare Pages にデプロイ）した後は、 **そのフロントエンドのURLをWorkers側の設定ファイルに追加して、再度`npx wrangler deploy`する** のを忘れないように注意。  
> 1. `gemini-proxy/src/config/theConfig.ts`の`ALLOWED_ORIGINS`に埋め込み対象ドメインを追加
> 2. `gemini-proxy/src/index.ts`のコードを現状の「全許可」から「制限付き」に書き換える（※コメントアウトを切り替える）
> 3. 再度 `npx wrangler deploy`する

## 本環境で使用する際の注意事項
現在の設定（`gemini-proxy/src/index.ts`）では、公開エンドポイントは誰でもアクセス可能な状態なのでチャットボット機能を埋め込んだサイト（ページ）の開発者ツール（Network タブ）から公開エンドポイントが露出してしまいます。  
APIキーはバックエンド側で管理するので漏れることは絶対にないですが、公開エンドポイントが見れることで Gemini API のタダ乗りが可能になります。  
つまり、有料版を使用している場合はタダ乗りによって**API利用料が増加して従量課金が増えるリスク**があり、無料版の場合は**従量課金は発生しないものの429エラー（Too Many Requests）が出て使用できなくなるリスク**があります。

## Gemini API のエンドポイントを別アプリ（例：SPA）で呼び出す方法
今回エンドポイントを発行してどこからでも Gemini API を呼び出せるようになりました。  
当プロジェクトの自作チャットボットを他のSPAとかに埋め込む場合は、ロジック部分（例：バックエンド部分）は流用せずとも`VITE_WORKER_ENDPOINT`を fetch API で叩くというシンプルな実装イメージで Gemini API のレスポンスjsonが返ってくるイメージです。

つまり以下は気にする必要がありません。    

- すでに稼働している「Gemini API ゲートウェイ（`VITE_WORKER_ENDPOINT`）」は、共通のAPIサーバーとして機能
	- ※当プロジェクトでGeminiの挙動を変更（例：画像や動画生成モード）した場合は公開エンドポイントを利用する全てに影響が出るので注意
- 新しいSPA側でバックエンドのコード（Hono や Cloudflare Workers の設定）を気にする必要は一切なし

### エンドポイントを使いたいSPA側（フロントエンド）での実装例
```ts
// 既存の公開エンドポイント
const API_URL = import.meta.env.VITE_WORKER_ENDPOINT;

async function askGemini(
	thePromtMessage: string,
	imageParts?: ImagePart[] // SPA側で`ImagePart`型を別途定義
):Promise<string> {
  // 1. エンドポイントを叩く（これだけでOK！）
  const response = await fetch(API_URL, {
    method: "POST", // Gemini に質問（データ投稿）するので POSTメソッドを指定
    headers: { "Content-Type": "application/json" },
    // ※`body`の中身はバックエンドの受付仕様に合わせる
	body: JSON.stringify({
      prompt: thePromtMessage,
      imageParts: imageParts ?? [] // 画像がない場合は「空の配列」を渡す（※画像やpdfなどは別途ファイルアップロード機能をSPA側で用意して、その処理結果を imageParts キーに指定する）
    })
  });

  // 2. 返ってきたJSONを受け取る
  const data = await response.json();
  
  // 3. 画面に表示する（data.text に回答が入っている想定）
  console.log("Geminiからの回答:", data.text);
  return data.text;
}
```

<details>
<summary>ImagePart型と変換用のヘルパー関数</summary>

- ImagePart型
```ts
// Gemini API に送るための画像/PDFデータの型定義
export type ImagePart = {
  inlineData: {
    data: string;       // Base64エンコードされた文字列（"data:image/png;base64," のプレフィックスは削除したもの）
    mimeType: string;   // "image/jpeg", "image/png", "application/pdf" など
  };
};
```

- 変換用のヘルパー関数
```ts
/**
 * ブラウザのFileオブジェクトをGemini用のImagePart型に変換するヘルパー関数
 */
export const fileToImagePart = (file: File): Promise<ImagePart> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // reader.result は "data:image/png;base64,iVBOR..." の形式になるため
      // 先頭の "data:xxx/xxx;base64," 部分を取り除いて純粋なデータだけにする
      const base64Data = base64String.split(',')[1];
      
      if (!base64Data) {
        reject(new Error("Base64変換に失敗しました"));
        return;
      }

      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

</details>
