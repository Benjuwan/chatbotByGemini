import { GEMINI_API_KEY, GEMINI_MODEL } from "../constance/prompt";
import type { chatMessageType, partsPropType } from "../types/theChatBotType";
import { useAdjustPromptMess } from "./useAdjustPromptMess";

// Gemini のモデルと APIキーはエンドポイント内に含まれる
const GEMINI_ENDPOINT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const useGenerateChatOnlyTxt = () => {
    const { adjustPromptMess } = useAdjustPromptMess();

    // チャットメッセージの生成機能（AIと文字だけのやり取りで良い場合はこのコードでも対応可能）
    //【重要】クライアントサイドにAPIキーが露出することになるため本番環境など実務では決して使用しないでください

    /**
     *【目的】Google GenAI SDKの将来的な変更に備えて標準的な実装を残しておく
     *【注意】AIと文字だけのやり取りしか対応できない（画像処理・解析は不可能）
     *【実装経緯】
     * 当初、プロンプト（文字列）に直接「画像データ情報を盛り込む」実装をしていた
     * しかし「それは単に画像データを文字列化した情報」であり「画像データそのものではない」ためAIが処理（画像認識）できない
     * シンプルにSDKを用いた実装方針に変更した
    */

    /* ※注釈： 他のコンポーネントやプロジェクトへの統合時の拡張性を考慮して、グローバルState（`context API`, `jotai`など）の使用は控えてシンプルな`props`渡しで対応 */
    const generateChat = async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        chatHistory: chatMessageType[],
        setChatHistory: React.Dispatch<React.SetStateAction<chatMessageType[]>>,
        input: string,
        setInput: React.Dispatch<React.SetStateAction<string>>,
    ): Promise<void> => {
        setLoading(true);

        const userMessage: chatMessageType = { role: "user", content: input };
        // 画面上の会話履歴を更新
        const updatedChatHistory = [...chatHistory, userMessage];

        // プロンプト生成（調整）処理
        const thePromtMessage: string = await adjustPromptMess(chatHistory, input);

        try {
            const response = await fetch(
                GEMINI_ENDPOINT_URL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // プロンプトをシリアライズ（直列化）した形でAIに渡す
                        contents: [{ parts: [{ text: thePromtMessage }] }],
                    }),
                }
            );

            if (!response.ok) {
                console.error(`HTTPエラー | ステータスコード: ${response.status}`);
                return;
            }

            const botResponse = await response.json();

            // ボットのメッセージコンテンツを初期化
            let botMessageContent = "";

            // ボットの応答からメッセージを生成
            if (botResponse && botResponse.candidates && botResponse.candidates.length > 0) {
                const firstCandidate = botResponse.candidates[0].content;
                if (firstCandidate && firstCandidate.parts && firstCandidate.parts.length > 0) {
                    // パーツのテキストを連結してメッセージコンテンツを作成
                    botMessageContent = firstCandidate.parts.map((part: partsPropType) => part.text).join('\n');
                }
            }

            // 生成されたボットのメッセージを作成
            const botMessage = {
                role: 'system',
                content: botMessageContent,
            };

            setChatHistory([...updatedChatHistory, botMessage]);
        } catch (error) {
            console.error(`Google API error occurred at [useGenerateChatOnlyTxt.ts] | ${error}`);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return { generateChat }
}