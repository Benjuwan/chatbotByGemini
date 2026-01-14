# chatbot by Gemini
`Gemini`を利用したテキストと画像、PDFファイルを通じたやり取りが行えるチャットボット機能<br>
[詳細なプロンプト設定は`src/constance/prompt.ts`に記載](/src/constance/prompt.ts)しています。

> [!NOTE]
> - **画像やPDFファイルを通じたやり取りが必要ない場合**<br>
> 現状の実装（[Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja)）でも問題ないですが`src/components/ChatForm.tsx`内の`useGenerateChat`カスタムフックを`useGenerateChat_OnlyTxt`に変更及び調整することでテキスト専用チャットボットになります。<br>
> この際、不要となるファイルアップロードコンポーネント`FileUploader`や関連箇所、関連State, 関連する型の読み込みなどを削除する必要があります。<br>
> ※`useGenerateChat_OnlyTxt`はSDKの将来的な変更に備えて標準的な実装として残している意図があります。

## 技術構成
- @eslint/js@9.39.2
- @google/generative-ai@0.24.1
- @types/node@25.0.8
- @types/react-dom@19.2.3
- @types/react@19.2.8
- @vitejs/plugin-react@5.1.2
- babel-plugin-react-compiler@1.0.0
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.4.26
- eslint-plugin-react@7.37.5
- eslint@9.39.2
- globals@17.0.0
- react-dom@19.2.3
- react-markdown@10.1.0
- react@19.2.3
- typescript-eslint@8.53.0
- typescript@5.9.3
- vite@7.3.1

## 必要な設定
### `.env`ファイルを用意
※使用・試用には**GeminiのAPIキーが必要**となります

```bash
VITE_GEMINI_API_KEY = GeminiのAPIキー
```

> [!IMPORTANT]
> - ※ viteの場合： `.env`ファイルのキー名は`""`でラップしたり、末尾に`;`を付けたりしない
> - ※ viteプロジェクトなので`VITE_`のプレフィックスが必要
