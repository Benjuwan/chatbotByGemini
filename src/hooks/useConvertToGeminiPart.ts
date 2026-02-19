import type { BlobImageUnion, Part } from "@google/genai";
import type { imagePartsType } from "../types/theChatBotType";

export const useConvertToGeminiPart = () => {
    // imagePartsType を Gemini API の Part 形式に変換
    const convertToGeminiPart = (fileData: imagePartsType | null): Part | undefined => {
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

    return { convertToGeminiPart }
}