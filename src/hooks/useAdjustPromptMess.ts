import type { chatMessageType, getAIReadyDataType } from "../types/theChatBotType";
import { useGenAiAnswerByVisualTxt } from "./useGenAiAnswerByVisualTxt";
import { useGenPromtMessage } from "./useGenPromtMessage";

export const useAdjustPromptMess = () => {
    const { genAiAnswerByVisualTxt } = useGenAiAnswerByVisualTxt();
    const { genPromtMessage } = useGenPromtMessage();

    const adjustPromptMess = async (
        chatHistory: chatMessageType[],
        input: string,
        getAIReadyData?: getAIReadyDataType[]
    ): Promise<string> => {
        // 生成ガイドやユーザーとのこれまでのやり取りを含んだプロンプトメッセージを生成
        const thePromtMessage = genPromtMessage(chatHistory, input);

        /* `src/hooks/useGenerateChat_OnlyTxt.ts`（AIとテキストのみのやり取り機能）を利用するルート */
        if (typeof getAIReadyData === 'undefined') {
            return thePromtMessage;
        }

        // 画像添付の有無にも応じた回答生成処理
        const visualPrompt: Promise<string> = genAiAnswerByVisualTxt(input, thePromtMessage, getAIReadyData);
        return visualPrompt;
    }

    return { adjustPromptMess }
}