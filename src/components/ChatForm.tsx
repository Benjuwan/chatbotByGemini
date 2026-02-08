import { useMemo, useState, type ChangeEvent } from "react";
import type { chatMessageType, filePreviewType, getAIReadyDataType } from "../types/theChatBotType";
import { FileUploader } from "./FileUploader";
import { useGenerateChat } from "../hooks/useGenerateChat";

type chatFormPropsType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    chatHistory: chatMessageType[];
    setChatHistory: React.Dispatch<React.SetStateAction<chatMessageType[]>>;
    handleChatView?: () => void;
};

export const ChatForm = ({ props }: { props: chatFormPropsType }) => {
    const { loading, setLoading, chatHistory, setChatHistory, handleChatView } = props;

    const [input, setInput] = useState<string>("");
    const [filePreviews, setFilePreviews] = useState<filePreviewType[]>([]);

    // AI解析用に調整したファイル情報
    const getAIReadyData: getAIReadyDataType[] = useMemo(() => {
        return filePreviews.map(fileItem => ({
            name: fileItem.file.name,
            type: fileItem.file.type,
            size: fileItem.file.size,
            base64Data: fileItem.preview ? fileItem.preview.split(',')[1] : null,
        }));
    }, [filePreviews]);

    const { generateChat } = useGenerateChat();

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>): void => {
        e.preventDefault();
        generateChat(
            setLoading,
            chatHistory, setChatHistory,
            input, setInput,
            getAIReadyData
        );
    }

    // `textarea`でのチャット生成イベント実施： com/ctrl + shift + enter キー押下
    const handleKeydown = (e: React.KeyboardEvent<HTMLElement>): void => {
        // Mac の Command または Windows の Ctrl
        const is_MacCom_WinCtrlKeydown: boolean = e.metaKey || e.ctrlKey;
        const isShiftKeydown: boolean = e.shiftKey;
        const isEnterKeydown: boolean = e.key === 'Enter';

        if (input.length > 0 && is_MacCom_WinCtrlKeydown && isShiftKeydown && isEnterKeydown) {
            generateChat(
                setLoading,
                chatHistory, setChatHistory,
                input, setInput,
                getAIReadyData
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`p-4 bg-[#eaeaea] rounded min-[1025px]:w-[48%] ${chatHistory.length > 1 ? "sticky top-4" : ""}`}>
            <p className="indent-[-1em] pl-4 mb-2 min-[1025px]:text-xs">※パソコン操作の場合： 入力後に「com/ctrl + shift + enter キー押下」で送信可能</p>
            {handleChatView &&
                <div className="flex justify-end"><button type="button" onClick={handleChatView} className="cursor-pointer indent-[-1em] pl-4 mb-2 text-[#d90f0f] underline min-[1025px]:text-xs hover:no-underline active:no-underline">チャットを閉じる</button></div>
            }
            <textarea className="text-base pl-[.25em] w-full h-[50vw] max-h-96 border border-[#bebebe] rounded mb-4 min-[1025px]:h-[clamp(80px,50vh,240px)]" onKeyDown={handleKeydown} name="entryUserMess" value={input} disabled={loading} onChange={(e) => setInput(e.target.value)}>&nbsp;</textarea>
            <FileUploader props={{
                loading: loading,
                filePreviews: filePreviews,
                setFilePreviews: setFilePreviews
            }} />
            {loading ?
                <p className="mt-4 shadow-[inset_0_0_8px_rgba(78,78,78,0.5)] bg-white p-4 rounded">メッセージ生成中……</p> :
                <button className="appearance-none block mt-10 border border-transparent bg-[#fda900] text-white rounded px-4 py-1 disabled:bg-[#dadada] disabled:text-[#eaeaea] enabled:cursor-pointer enabled:hover:bg-white enabled:hover:text-[#fda900] enabled:hover:border-[#fda900] transition-all duration-250" disabled={input.length === 0 || loading}>送信</button>
            }
        </form>
    );
}
