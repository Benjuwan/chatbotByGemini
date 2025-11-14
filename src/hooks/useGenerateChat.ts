import type { chatMessageType, getAIReadyDataType } from "../types/theChatBotType";
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
        getAIReadyData?: getAIReadyDataType[],
    ): Promise<void> => {
        setLoading(true);

        const userMessage: chatMessageType = { role: "user", content: input };
        // 画面上の会話履歴を更新
        const updatedChatHistory = [...chatHistory, userMessage];

        try {
            // プロンプト生成（調整）処理
            const receivedBotAnswer = await adjustPromptMess(chatHistory, input, getAIReadyData);

            // 生成されたボットのメッセージを作成
            const botMessage = {
                role: 'system',
                content: receivedBotAnswer,
            };

            // 会話履歴を更新（ユーザーとボットのメッセージを含む）
            setChatHistory([...updatedChatHistory, botMessage]);
        } catch {
            console.error('Google API error occurred.');
        } finally {
            // 初期化処理
            setLoading(false);
            setInput("");
        }
    };

    return { generateChat }
}