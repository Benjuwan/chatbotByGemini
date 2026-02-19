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