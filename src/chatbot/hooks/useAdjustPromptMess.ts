import type { chatMessageType, imagePartsType } from "../type/GeminiType";
import { useGenPromtMessage } from "./useGenPromtMessage";

export const useAdjustPromptMess = () => {
    const { genPromtMessage } = useGenPromtMessage();

    // `adjustPromptMess`は、全体的な非同期処理の中で単に`Promise`を受け渡す役割を担っているだけ。
    // つまり、Gemini API の`Promise`結果（＝回答結果： 非同期処理による文字列）を受け取って「その`Promise`（非同期処理の結果）を単に返す」だけの同期関数
    const adjustPromptMess = (
        chatHistory: chatMessageType[],
        input: string,
        imageParts?: imagePartsType[]
    ): Promise<string> => {
        const thePromtMessage = genPromtMessage(chatHistory, input, imageParts);
        return thePromtMessage;
    }

    return { adjustPromptMess }
}
