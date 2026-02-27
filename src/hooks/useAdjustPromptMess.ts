import type { chatMessageType, imagePartsType } from "../types/theChatBotType";
import { useGenAiAnswerByVisualTxt } from "./useGenAiAnswerByVisualTxt";
import { useGenPromtMessage } from "./useGenPromtMessage";

export const useAdjustPromptMess = () => {
    const { genAiAnswerByVisualTxt } = useGenAiAnswerByVisualTxt();
    const { genPromtMessage } = useGenPromtMessage();

    const adjustPromptMess = async (
        chatHistory: chatMessageType[],
        input: string,
        imageParts?: imagePartsType[]
    ): Promise<string> => {
        // 生成ガイドやユーザーとのこれまでのやり取りを含んだプロンプトメッセージを生成
        const thePromtMessage = genPromtMessage(chatHistory, input);

        /* `src/hooks/useGenerateChat_OnlyTxt.ts`（AIとテキストのみのやり取り機能）を利用するルート */
        if (typeof imageParts === 'undefined') {
            return thePromtMessage;
        }

        // 画像添付の有無にも応じた回答生成処理
        const visualPrompt: string = await genAiAnswerByVisualTxt(input, thePromtMessage, imageParts);
        return visualPrompt;
    }

    return { adjustPromptMess }
}