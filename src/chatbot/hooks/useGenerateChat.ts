import type { chatMessageType, imagePartsType } from "../type/GeminiType";
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
        // 画面上の会話履歴を更新
        const updatedChatHistory = [...chatHistory, userMessage];

        try {
            // プロンプト生成処理： 生成ガイドやユーザーとのこれまでのやり取りを含んだプロンプトメッセージを生成
            const thePromtMessage = await adjustPromptMess(chatHistory, input, imageParts);

            // 生成されたボットのメッセージを作成
            const botMessage = {
                role: 'system',
                content: thePromtMessage,
            };

            // 会話履歴を更新（ユーザーとボットのメッセージを含む）
            setChatHistory([...updatedChatHistory, botMessage]);
        } catch {
            console.error('Google API error occurred. | `useGenerateChat.ts`');
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return { generateChat }
}
