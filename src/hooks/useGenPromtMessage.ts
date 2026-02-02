import { thePromptGuide } from "../constance/prompt";
import type { chatMessageType } from "../types/theChatBotType"

export const useGenPromtMessage = () => {
    const genPromtMessage = (chatHistory: chatMessageType[], input: string): string => {
        const chainMessage: string[] = Object.values(chatHistory).map((chat, i) => `回答番号：${i + 1} | ${chat.content}\n`);

        const thePromtMessage: string = `
        はじめに、以下【生成ガイド】を読み込んでください。
        
        ---
        
        ${thePromptGuide}

        ---
        
        ${chatHistory.length > 0 ? `
        次に、これまでのユーザーとのやり取りは以下内容となります。
        ---
        
        ${chainMessage}
        
        ---
        これまでのやり取りを踏まえた上で、ユーザーの新たな入力内容である【${input}】に回答してください。` : input}`;

        console.log(thePromtMessage);
        return thePromtMessage;
    }

    return { genPromtMessage }
}