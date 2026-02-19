import { useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import type { chatFormPropsType, filePreviewType, imagePartsType } from "./type/GeminiType";
import { FileUploader } from "./FileUploader";
import { useGenerateChat } from "./hooks/useGenerateChat";
import { useHandleInputValueSanitize } from "./hooks/useHandleInputValueSanitize";
import { useCheckDesktopView } from "./hooks/useCheckDesktopView";

export const ChatForm = ({ props }: { props: chatFormPropsType }) => {
    const { loading, setLoading, chatHistory, setChatHistory, handleChatView } = props;

    const { generateChat } = useGenerateChat();
    const { isDesktopView } = useCheckDesktopView();
    const { handleInputValueSanitize } = useHandleInputValueSanitize();

    const [filePreviews, setFilePreviews] = useState<filePreviewType[]>([]);

    const [input, setInput] = useState<string>("");
    const handleInput = (e: SyntheticEvent<HTMLTextAreaElement>): void => {
        const sanitizedPrompt = handleInputValueSanitize(e.currentTarget.value);
        setInput(sanitizedPrompt);
    }

    // AI解析用に調整したファイル情報
    const imageParts: imagePartsType[] = useMemo(() => {
        return filePreviews.map(fileItem => ({
            name: fileItem.file.name,
            type: fileItem.file.type,
            size: fileItem.file.size,
            base64Data: fileItem.preview ? fileItem.preview.split(',')[1] : null,
        }));
    }, [filePreviews]);

    // 送信ボタンによるチャット生成
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>): void => {
        e.preventDefault();
        generateChat(
            setLoading,
            chatHistory, setChatHistory,
            input, setInput,
            imageParts
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
                imageParts
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className={`p-4 bg-[#eaeaea] rounded border border-[#c5c5c5] lg:w-[48%] ${chatHistory.length > 1 ? "sticky top-4" : ""}`}>
            {isDesktopView && <p className="mb-2 text-xs">※パソコン操作の場合： 入力後に「com/ctrl + shift + enter キー押下」で送信可能</p>}
            {handleChatView &&
                <div className="flex justify-end"><button type="button" onClick={handleChatView} className="cursor-pointer mb-2 text-[#d90f0f] underline text-xs hover:no-underline active:no-underline">チャットを閉じる</button></div>
            }
            <textarea className="text-base pl-[.25em] w-full h-[50vw] max-h-96 border border-[#bebebe] rounded mb-4 lg:h-[clamp(80px,50vh,240px)]" onKeyDown={handleKeydown} name="entryUserMess" value={input} disabled={loading} onChange={(e: SyntheticEvent<HTMLTextAreaElement>) => handleInput(e)}>&nbsp;</textarea>
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
