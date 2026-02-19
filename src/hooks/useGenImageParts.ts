import type { Part } from "@google/genai";
import type { imagePartsType } from "../types/theChatBotType";
import { useConvertToGeminiPart } from "./useConvertToGeminiPart";

export const useGenImageParts = () => {
    // imagePartsType を Gemini API の Part 形式に変換するカスタムフック
    const { convertToGeminiPart } = useConvertToGeminiPart();

    // 添付画像の有無を判断すると共にそれらをAIが処理できる形に変換
    const genImageParts = (fileData?: imagePartsType[]): Part[] | undefined => {
        if (typeof fileData === 'undefined') {
            return undefined;
        }

        if (fileData.length > 0) {
            return fileData.map(convertToGeminiPart).filter((t): t is Part => typeof t !== 'undefined');
        }

        return undefined;
    }

    return { genImageParts }
}