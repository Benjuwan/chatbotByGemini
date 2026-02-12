import type { Part } from "@google/genai";
import { WORKER_ENDPOINT } from "../constance/prompt";
import type { getAIReadyDataType } from "../types/theChatBotType";
import { useGenImageParts } from "./useGenImageParts";

export const useGenAiAnswerByVisualTxt = () => {
    const { genImageParts } = useGenImageParts();

    const genAiAnswerByVisualTxt = async (
        input: string,
        thePromtMessage: string,
        fileData?: getAIReadyDataType[]
    ): Promise<string> => {
        // 複数画像添付の判断材料（プロンプト内にこれらの単語が含まれているかどうか）
        const targetKeywords: string[] = ['複数', '多く', 'さっきの', '先程の', '直前の', 'これら', 'それら', 'たくさんの', '様々な', 'いろいろな'];
        const isMultiImageMode: boolean = targetKeywords.some(keyword => input.includes(keyword));

        try {
            // 画像データの準備（クライアント側で計算）
            let imageParts: Part[] | undefined = undefined;

            // 複数画像の場合
            if (isMultiImageMode) {
                imageParts = genImageParts(fileData);
            }

            // 単体画像の場合、最後の1枚だけ送る
            else {
                const imgPart = genImageParts(fileData);

                if (imgPart && imgPart.length > 0) {
                    imageParts = [imgPart[imgPart.length - 1]];
                }
            }

            // Cloudflare Workers API を叩く
            const response = await fetch(WORKER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: thePromtMessage,
                    imageParts: imageParts, // 作ったPart配列をそのまま渡す
                }),
            });

            if (!response.ok) {
                throw new Error(`Worker Error: ${response.status}`);
            }

            const data = await response.json();
            return data.text ?? '回答がうまく生成されなかったようです。';
        } catch {
            throw new Error('Google API error occurred. | `useGenAiAnswerByVisualTxt.ts`');
        }
    };

    return { genAiAnswerByVisualTxt }
}