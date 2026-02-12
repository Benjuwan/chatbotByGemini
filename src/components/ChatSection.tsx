import type { chatMessageType } from "../types/theChatBotType";
import ReactMarkdown from "react-markdown";

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
        <div className="p-4 bg-[#fff8e9] rounded mb-10 lg:w-1/2 lg:mb-0">
            <style>{`
                @keyframes skeleton {
                    0% { transform: translate(-20%, -50%); }
                    100% { transform: translate(160%, -50%); }
                }
            `}</style>
            {loading && chatHistory.length === 0 ?
                <div className="h-screen bg-[#eaeaea] rounded relative overflow-hidden after:content-['']  after:block after:w-full after:h-full after:absolute after:top-1/2 after:bg-[linear-gradient(-60deg,#eaeaea,#fff,#eaeaea)] after:animate-[skeleton_1s_linear_infinite]">&nbsp;</div> :
                <>
                    {chatHistory.map((chat, index) => (
                        <div
                            key={index}
                            className={`leading-[1.8] bg-white rounded border-[3px] border-transparent p-2 wrap-anywhere mb-4 last-of-type:mb-0 ${chat.role === "user" ? "border-[#fda900]" : "border-[#dadada] [&_h3]:font-bold [&_h3]:border-l-4 [&_h3]:border-[#dadada] [&_h3]:pl-2 [&_h3]:mb-4 [&_h4]:font-bold [&_h4]:my-4 [&_h4]:border-b [&_h4]:border-[#dadada] [&_h5]:font-bold [&_h5]:my-4 [&_h5]:border-b [&_h5]:border-[#dadada] [&_h6]:font-bold [&_h6]:my-4 [&_h6]:border-b [&_h6]:border-[#dadada] [&_p:not(:last-of-type)]:mb-4 [&_a]:text-[#fda900] [&_li]:wrap-anywhere [&_li]:mb-4 [&_li:not(:has(p))]:indent-[-1em] [&_li:not(:has(p))]:pl-4 [&_li:not(:has(p))::before]:content-['-'] [&_li:not(:has(p))::before]:mr-2"}`}
                        >
                            <p className="font-bold pb-2 mb-2 border-b border-[#dadada]">{chat.role === "user" ? "あなた" : "AI"}</p>
                            {RenderingChat(chat)}
                        </div>
                    ))}
                </>
            }
            {loading && <p className="mt-4 shadow-[inset_0_0_8px_rgba(78,78,78,0.5)] bg-white p-4 rounded">── AIが回答を整理しています</p>}
        </div>
    );
}
