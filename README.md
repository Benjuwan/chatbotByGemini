# chatbot by Gemini
`Gemini`を利用したテキストと画像を通じたやり取りが行えるチャットボット機能<br>
[詳細なプロンプト設定は`src/constance/prompt.ts`に記載](/src/constance/prompt.ts)しています。

## 技術構成
- @eslint/js@9.39.1
- @google/generative-ai@0.24.1
- @types/node@24.10.1
- @types/react-dom@19.2.3
- @types/react@19.2.4
- @vitejs/plugin-react@5.1.1
- babel-plugin-react-compiler@1.0.0
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.4.24
- eslint-plugin-react@7.37.5
- eslint@9.39.1
- globals@16.5.0
- react-dom@19.2.0
- react-markdown@10.1.0
- react@19.2.0
- typescript-eslint@8.46.4
- typescript@5.9.3
- vite@7.2.2

## 必要な設定
### `.env`ファイルを用意
※**GeminiのAPIキーが必要**となります

```bash
VITE_GEMINI_API_KEY = GeminiのAPIキー
```

- ※ viteの場合： `.env`ファイルのキー名は`""`でラップしたり、末尾に`;`を付けたりしない
- ※ viteプロジェクトなので`VITE_`のプレフィックスが必要
# chatbotByGemini
