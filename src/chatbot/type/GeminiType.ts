export type chatMessageType = {
    role: string;
    content: string;
};

export type partsPropType = {
    text: string;
};

export type filePreviewType = {
    file: File;
    preview?: string;
};

export type imagePartsType = {
    name: string;
    type: string;
    size: number
    base64Data: string | null;
};

export type chatSectionPropsType = {
    loading: boolean;
    chatHistory: chatMessageType[];
};

export type chatFormPropsType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    chatHistory: chatMessageType[];
    setChatHistory: React.Dispatch<React.SetStateAction<chatMessageType[]>>;
    handleChatView?: () => void;
};
