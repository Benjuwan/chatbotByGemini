import mainStyle from "../styles/main.module.css";
import { useMemo, useState, type ChangeEvent } from "react";
import type { chatMessageType, filePreviewType, getAIReadyDataType } from "../types/theChatBotType";
import { FileUploader } from "./FileUploader";
import { useGenerateChat } from "../hooks/useGenerateChat";

type chatFormPropsType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    chatHistory: chatMessageType[];
    setChatHistory: React.Dispatch<React.SetStateAction<chatMessageType[]>>;
};

export const ChatForm = ({ props }: { props: chatFormPropsType }) => {
    const { loading, setLoading, chatHistory, setChatHistory } = props;

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
        <div className={`${mainStyle.runFormWrapper} ${chatHistory.length > 1 ? mainStyle.stikeyMode : undefined}`}>
            <form onSubmit={handleSubmit}>
                <p className={mainStyle.caption}>※パソコン操作の場合： 入力後に「com/ctrl + shift + enter キー押下」で送信可能</p>
                <textarea onKeyDown={handleKeydown} name="entryUserMess" value={input} disabled={loading} onChange={(e) => setInput(e.target.value)}>&nbsp;</textarea>
                <FileUploader props={{
                    loading: loading,
                    filePreviews: filePreviews,
                    setFilePreviews: setFilePreviews
                }} />
                {loading ?
                    <p className={mainStyle.isRendering}>メッセージ生成中……</p> :
                    <button disabled={input.length === 0 || loading}>送信</button>
                }
                {filePreviews.length > 0 && <button className={mainStyle.resetBtn} type="button" disabled={loading} onClick={() => setFilePreviews([])}>画像を一括リセット</button>}
            </form>
        </div>
    );
}