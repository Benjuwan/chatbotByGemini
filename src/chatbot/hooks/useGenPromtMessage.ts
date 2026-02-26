import { thePromptGuide } from "../constance/prompt";
import type { chatMessageType, imagePartsType } from "../type/GeminiType";

// Vite が標準で提供している import.meta.env.DEV を使うと、npm run dev の時は true、ビルド後は false に自動で切り替わる
const IS_DEV: boolean = import.meta.env.DEV;

const _geminiCall = async (thePromtMessage: string, imageParts?: imagePartsType[]): Promise<string> => {
    // Cloudflare Workers に置いている Gemini API の公開エンドポイント
    const API_URL = import.meta.env.VITE_WORKER_ENDPOINT;

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ※`body`の中身はバックエンドの受付仕様に合わせる
        body: JSON.stringify({
            prompt: thePromtMessage,
            // model: "gemini-3-flash-preview", // モデル設定（※設定すると500エラーが出る時もあるのでデフォルトでは無効化）
            imageParts: (imageParts ?? []).map((img) => ({
                // Gemini SDK が期待する画像処理データ構造の形で渡す
                inlineData: {
                    data: img.base64Data, // キー名を data に変更
                    mimeType: img.type    // キー名を mimeType に変更
                }
            }))
        })
    });

    if (IS_DEV) {
        console.warn(response);
    }

    const data = await response.json();

    if (data.error) {
        console.error(data.error);
    }

    // `data.error`の有無で Gemini の回答を調整（当該プロパティが無い場合は生成回答を返す）
    const result = data.error ?
        data.error.status === 429 ?
            'Too Many Requests | リクエスト超過エラーです。' :
            `Error Status [${data.error.status}] | 不明なエラーが発生しました。時間を置いて再度お試しください。` :
        data.text;

    return result;
}

export const useGenPromtMessage = () => {
    // `genPromtMessage`は、Gemini API の`Promise`結果（＝回答結果： 非同期処理による文字列）を受け取って「その`Promise`（非同期処理の結果）を単に返す」だけの同期関数
    // もし Gemini API の`Promise`結果を加工して返したり、ログ出力して中身を確認したりしたい場合は、async, await の記述が必要となる
    const genPromtMessage = (
        chatHistory: chatMessageType[],
        input: string,
        imageParts?: imagePartsType[]
    ): Promise<string> => {
        const chainMessage: string[] = Object.values(chatHistory).map((chat, i) => `回答番号：${i + 1} | ${chat.content}\n`);

        const thePromtMessage: string = `
        はじめに、以下【生成ガイド】を読み込んでください
        
        ---
        
        ${thePromptGuide}

        ---
        
        ${chatHistory.length > 0 ? `
        次に、これまでのユーザーとのやり取りは以下内容となります
        ---
        
        ${chainMessage}
        
        ---
        これまでのやり取りを踏まえた上で、ユーザーの新たな入力内容である【${input}】に回答してください` : input}`;

        if (IS_DEV) {
            console.log(thePromtMessage);

            // 画像やpdfファイルの有無を確認
            if (imageParts && imageParts.length > 0) {
                console.log(imageParts);
            }
        }

        return _geminiCall(thePromtMessage, imageParts);
    }

    return { genPromtMessage }
}
