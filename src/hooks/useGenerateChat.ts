import type { chatMessageType, imagePartsType } from "../types/theChatBotType";
import { useAdjustPromptMess } from "./useAdjustPromptMess";

export const useGenerateChat = () => {
    const { adjustPromptMess } = useAdjustPromptMess();

    // チャットメッセージの生成機能
    /* ※注釈： 他のコンポーネントやプロジェクトへの統合時の拡張性を考慮して、グローバルState（`context API`, `jotai`など）の使用は控えてシンプルな`props`渡しで対応 */
    const generateChat = async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        chatHistory: chatMessageType[],
        setChatHistory: React.Dispatch<React.SetStateAction<chatMessageType[]>>,
        input: string,
        setInput: React.Dispatch<React.SetStateAction<string>>,
        imageParts?: imagePartsType[],
    ): Promise<void> => {
        setLoading(true);

        const userMessage: chatMessageType = { role: "user", content: input };

        // これまでのやり取りが5往復以上の場合は直近5件分にカットオフ
        // ※以前のやり取り内容の一部が消えてしまうものの、情報量の圧縮及びトークン消費軽減の観点からカットオフ実施
        const everChatHisitory = chatHistory.length > 5 ? [...chatHistory].slice(-5) : [...chatHistory];

        // 画面上の会話履歴を更新
        const updatedChatHistory = [...everChatHisitory, userMessage];

        try {
            // プロンプト生成（調整）処理
            const receivedBotAnswer = await adjustPromptMess(chatHistory, input, imageParts);

            // 生成されたボットのメッセージを作成
            const botMessage = {
                role: 'system',
                content: receivedBotAnswer,
            };

            // 会話履歴を更新（ユーザーとボットのメッセージを含む）
            setChatHistory([...updatedChatHistory, botMessage]);
        } catch (error) {
            console.error(`Google API error occurred at [useGenerateChat.ts] | ${error}`);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return { generateChat }
}