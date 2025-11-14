import { prompt } from "../constance/prompt";
import type { chatMessageType, getAIReadyDataType } from "../types/theChatBotType";
import { useGenAnswerByVisualTxt } from "./useGenAnswerByVisualTxt";

export const useAdjustPromptMess = () => {
    const { genAnswerByVisualTxt } = useGenAnswerByVisualTxt();

    const adjustPromptMess = async (
        chatHistory: chatMessageType[],
        input: string,
        getAIReadyData?: getAIReadyDataType[]
    ): Promise<string> => {
        const chainMessage: string[] = Object.values(chatHistory).map((chat, i) => `回答番号：${i + 1} | ${chat.content}\n`);

        const thePromtMessage = `
        はじめに、以下の「生成ガイド」を読み込んでください。

        ---

        ${prompt}
        
        ---

        ${chatHistory.length > 0 ? `次に、これまでのユーザーとのやり取りは【${chainMessage}】という内容です。これを踏まえた上で「新たなユーザーの入力内容である【${input}】」に回答してください` : input}`;
        console.log(thePromtMessage);

        /* `src/hooks/useGenerateChat_OnlyTxt.ts`（AIとテキストのみのやり取り機能）を利用するルート */
        if (typeof getAIReadyData === 'undefined') {
            return thePromtMessage;
        }

        // 画像添付の有無にも応じた回答生成処理
        const visualPrompt: Promise<string> = genAnswerByVisualTxt(input, thePromtMessage, getAIReadyData);
        return visualPrompt;
    }

    return { adjustPromptMess }
}