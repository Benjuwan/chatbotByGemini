import { GoogleGenerativeAI, type Part, type InlineDataPart } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../constance/prompt";
import type { getAIReadyDataType } from "../types/theChatBotType";

export const useGenAnswerByVisualTxt = () => {
    // [Google GenAI SDK](https://ai.google.dev/gemini-api/docs/migrate?hl=ja)を利用
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // getAIReadyDataType を Gemini API の Part 形式に変換
    const _convertToGeminiPart = (fileData: getAIReadyDataType | null): Part | undefined => {
        if (!fileData || !fileData.base64Data) {
            return undefined
        }

        // `generateContent()`の第二引数には`Part`型が必要なので、`Part`のユニオン要素`InlineDataPart`として構築
        // `InlineDataPart`の`inlineData`プロパティに、以下構成で型定義されている`GenerativeContentBlob`型の値を設定
        const initData: InlineDataPart = {
            inlineData: {
                mimeType: fileData.type,
                data: fileData.base64Data
            }
        };

        return initData;
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
                const result = await model.generateContent(
                    typeof imageParts === 'undefined' ?
                        [thePromtMessage] : [thePromtMessage, ...imageParts]
                );
                const response = result.response;
                return response.text();
            }

            // 単体画像添付の場合
            const imgPart: Part[] | undefined = _genImageParts(fileData);

            // 参照画像添付 ／ 添付無しに応じて回答生成
            const result = await model.generateContent(
                typeof imgPart === 'undefined' ?
                    [thePromtMessage] : [thePromtMessage, imgPart[imgPart.length - 1]]
            );
            const response = result.response;
            return response.text();
        } catch {
            throw new Error('Google API error occurred. | 生成処理中にエラー発生');
        }
    };

    return { genAnswerByVisualTxt }
}