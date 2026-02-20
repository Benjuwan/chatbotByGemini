## 簡易的なRAG（検索拡張生成）
当リポジトリのチャットボットは簡易的なRAG（検索拡張生成）としても扱えます。  
React, TypeScript, Vite を前提としていて、`/chatbot`は簡単に実装できるファイルセットです。  
実装（利用）に必要なのは「1. Gemini の APIキー」と「2. 公開エンドポイントの作成」です。  
[公開エンドポイントの作成は別途READMEで説明](../../README.md#cloudflare-workers-にエンドポイントを公開設定する方法)しています。  
公開エンドポイントを設定できれば、`chatbot`にある`ChatBot.tsx`コンポーネントを読み込むだけで利用できます。

- 参考：[Google GenAI SDK](https://ai.google.dev/gemini-api/docs/libraries?hl=ja)
- 参考：[Google GenAI SDK に移行する](https://ai.google.dev/gemini-api/docs/migrate?hl=ja)

---

> [!NOTE]
> - サンプルは「ガチャピンとムック」に関するRAGです  
> `public/gachapin_mukku_rag.md`というマークダウンファイルを一次資料として扱うように`/chatbot/constance/prompt.ts`でプロンプト設定しています。

### 必要なライブラリ
- tailwindcss
    - [公式ドキュメント](https://tailwindcss.com/docs/installation/using-vite)に従って、`vite.config.ts`や`CSS`ファイルへの設定（工程3, 4）が別途必要
- react-markdown

### 必要な設定ファイル
- `.env`  
エンドポイントを設定する環境変数ファイル
```bash
VITE_WORKER_ENDPOINT = 設定した公開エンドポイント
```

### 簡易的なRAGとは？
20p ほどの pdfファイルなら耐えられるが、それ以上の規模感になると LangChain の使用が適切です。  
※LangChain： ChatGPTなどの大規模言語モデル（LLM）を外部データやツールと連携させ、高度なAIアプリを簡単に開発できるオープンソースのフレームワーク
