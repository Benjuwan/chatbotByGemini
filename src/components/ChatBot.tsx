import { useState } from "react";
import type { chatMessageType } from "../types/theChatBotType";
import { ChatForm } from "./ChatForm";
import { ChatSection } from "./ChatSection";

export const ChatBot = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<chatMessageType[]>([]);

    const [isChatView, setChatView] = useState<boolean>(true);
    const handleChatView = (): void => {
        setChatView(!isChatView);
    }

    return (
        <>
            <section className={`mt-[4em] pt-[4em] relative after:content-'' after:w-full after:h-1/2 after:absolute after:-top-[2em] after:left-1/2 after:-translate-x-1/2 after:shadow-[0px_0px_8px_rgba(0,0,0,.5)] after:rounded-[80px] after:-z-2 before:content-'' before:absolute before:-top-[2em] before:left-1/2 before:-translate-x-1/2 before:w-full before:h-full before:bg-[linear-gradient(to_bottom,transparent_5%,#fff_25%)] before:-z-1 duration-250 ${isChatView ? 'isChatView' : 'translate-y-[4em] opacity-0 invisible'}`}>
                <div className="p-4 lg:flex lg:justify-around lg:items-start lg:flex-wrap lg:gap-[2%]">
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
                        setChatHistory: setChatHistory,
                        handleChatView: handleChatView
                    }} />
                </div>
            </section>
            {isChatView || <button className="cursor-pointer fixed bottom-8 right-8 w-11 h-11 rounded-full grid place-content-center bg-[#eaeaea] shadow-[0px_0px_8px_rgba(0,0,0,.5)] hover:scale-[1.2] active:scale-[1.2] duration-250" type="button" onClick={handleChatView}>+</button>}
        </>
    );
};
