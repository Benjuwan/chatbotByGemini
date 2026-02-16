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
            <section className={`fixed w-full h-[95%] rounded-2xl bottom-0 z-9 grid items-end mt-[4em] pt-4 duration-250 ${isChatView ? 'isChatView shadow-[0px_0px_8px_rgba(0,0,0,.25)_inset] bg-[rgba(255,255,255,.85)] backdrop-blur-lg' : 'translate-y-[4em] opacity-0 invisible pointer-events-none'}`}>
                <div className="p-4 pb-10 h-full overflow-y-auto overscroll-contain lg:flex lg:justify-around lg:items-start lg:flex-wrap lg:gap-[2%]">
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
            {isChatView || <button className="cursor-pointer fixed top-20 right-4 z-9 w-11 h-11 rounded-full grid place-content-center bg-[#eaeaea] shadow-[0px_0px_8px_rgba(0,0,0,.5)] hover:scale-[1.2] active:scale-[1.2] duration-250" type="button" onClick={handleChatView}>+</button>}
        </>
    );
};
