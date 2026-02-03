import { useState } from "react";
import type { chatMessageType } from "../types/theChatBotType";
import { ChatForm } from "./ChatForm";
import { ChatSection } from "./ChatSection";

export const ChatBot = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<chatMessageType[]>([]);

    return (
        <section className="p-4 min-[1025px]:flex min-[1025px]:justify-around min-[1025px]:items-start min-[1025px]:flex-wrap min-[1025px]:gap-[2%]">
            {(chatHistory.length > 0 || loading) &&
                <ChatSection props={{
                    loading: loading,
                    chatHistory: chatHistory
                }} />
            }
            <ChatForm props={{
                loading: loading,
                setLoading: setLoading,
                chatHistory: chatHistory,
                setChatHistory: setChatHistory
            }} />
        </section>
    );
};
