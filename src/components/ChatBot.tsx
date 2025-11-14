import mainStyle from "../styles/main.module.css";
import { useState } from "react";
import { ChatForm } from "./ChatForm";
import { ChatSection } from "./ChatSection";
import type { chatMessageType } from "../types/theChatBotType";

export const ChatBot = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<chatMessageType[]>([]);

    return (
        <section className={mainStyle.chatBotSec}>
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