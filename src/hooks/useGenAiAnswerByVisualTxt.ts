import { GoogleGenAI, type Part, type BlobImageUnion, ThinkingLevel } from "@google/genai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../constance/prompt";
import type { getAIReadyDataType } from "../types/theChatBotType";

export const useGenAnswerByVisualTxt = () => {
    // 旧SDK： [Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja) -> `import { GoogleGenerativeAI } from "@google/generative-ai";`
    // 新SDK： [Gemini API のクイックスタート](https://ai.google.dev/gemini-api/docs/quickstart?lang=node&hl=ja)を利用 -> `import { GoogleGenAI } from "@google/genai";`
    const genAI = new GoogleGenAI(GEMINI_API_KEY);

    // getAIReadyDataType を Gemini API の Part 形式に変換
    const _convertToGeminiPart = (fileData: getAIReadyDataType | null): Part | undefined => {
        if (!fileData || !fileData.base64Data) {
            return undefined
        }

        // `generateContent()`の第二引数には`Part`型が必要なので、`Part`のユニオン要素`inlineData?: Blob_2`として構築
        // `Blob_2`は以下のデータ構造となっていて、`BlobImageUnion（export declare type BlobImageUnion = Blob_2;）`と型定義されている
        const inlineData: BlobImageUnion = {
            data: fileData.base64Data,
            // displayName: undefined,
            mimeType: fileData.type
        };

        return {
            inlineData: inlineData
        };
    };

    // 添付画像の有無を判断すると共にそれらをAIが処理できる形に変換
    const _genImageParts = (fileData?: getAIReadyDataType[]): Part[] | undefined => {
        if (typeof fileData === 'undefined') {
            return undefined;
        }

        if (fileData.length > 0) {
            return fileData.map(_convertToGeminiPart).filter((t): t is Part => typeof t !== 'undefined');
        }

        return undefined;
    }

    const genAnswerByVisualTxt = async (
        input: string,
        thePromtMessage: string,
        fileData?: getAIReadyDataType[]
    ): Promise<string> => {
        // 複数画像添付の判断材料（プロンプト内にこれらの単語が含まれているかどうか）
        const targetKeywords: string[] = ['複数', '多く', 'さっきの', '先程の', '直前の', 'これら', 'それら', 'たくさんの', '様々な', 'いろいろな'];
        const isMultiImageMode: boolean = targetKeywords.some(keyword => input.includes(keyword));

        try {
            // 複数画像添付の場合
            if (isMultiImageMode) {
                const imageParts: Part[] | undefined = _genImageParts(fileData);

                // 参照画像添付 ／ 添付無しに応じて回答生成
                const result = await genAI.models.generateContent({
                    model: GEMINI_MODEL,
                    contents: typeof imageParts === 'undefined' ?
                        thePromtMessage : [thePromtMessage, ...imageParts],
                    config: {
                        // [思考レベル](https://ai.google.dev/gemini-api/docs/gemini-3?hl=ja#thinking_level)
                        thinkingConfig: {
                            thinkingLevel: ThinkingLevel.LOW,
                        }
                    },
                });
                return result.text ?? '回答がうまく生成されなかったようです。';
            }

            // 単体画像添付の場合
            const imgPart: Part[] | undefined = _genImageParts(fileData);

            // 参照画像添付 ／ 添付無しに応じて回答生成
            const result = await genAI.models.generateContent({
                model: GEMINI_MODEL,
                contents: typeof imgPart === 'undefined' ?
                    [thePromtMessage] : [thePromtMessage, imgPart[imgPart.length - 1]]
            });
            return result.text ?? '回答がうまく生成されなかったようです。';
        } catch {
            throw new Error('Google API error occurred. | `useGenAnswerByVisualTxt.ts`');
        }
    };

    return { genAnswerByVisualTxt }
}
