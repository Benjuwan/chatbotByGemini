import mainStyle from "../styles/main.module.css";
import ReactMarkdown from "react-markdown";
import type { chatMessageType } from "../types/theChatBotType";

type chatSectionPropsType = {
    loading: boolean;
    chatHistory: chatMessageType[];
};

const RenderingChat = (message: chatMessageType) => {
    if (message.role === "system") {
        // MarkdownをHTMLに変換
        return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }

    // 通常のテキストメッセージ
    return <div>{message.content}</div>;
};

export const ChatSection = ({ props }: { props: chatSectionPropsType }) => {
    const { loading, chatHistory } = props;

    return (
        <div className={mainStyle.messageWrapper}>
            {loading && chatHistory.length === 0 ?
                <div className={mainStyle.firstChatRendering}>&nbsp;</div> :
                <>
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`${mainStyle.chatContent} ${chat.role === "user" ? mainStyle.user : mainStyle.system}`}
                        >
                            <p className={mainStyle.role}>{chat.role === "user" ? "あなた" : "AI"}</p>
                            {RenderingChat(chat)}
                        </div>
                    ))}
                </>
            }
            {loading && <p className={mainStyle.isRendering}>── AIが回答を整理しています</p>}
        </div>
    );
}