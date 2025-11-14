import mainStyle from "../styles/main.module.css";
import { useEffect, useRef, type ChangeEvent } from 'react';
import type { filePreviewType } from '../types/theChatBotType';

type FileUploaderPropsType = {
    loading: boolean;
    filePreviews: filePreviewType[];
    setFilePreviews: React.Dispatch<React.SetStateAction<filePreviewType[]>>;
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const FileUploader = ({ props }: { props: FileUploaderPropsType }) => {
    const { loading, filePreviews, setFilePreviews } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): void => {
        if (file.size > MAX_SIZE_BYTES) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            throw new Error(
                `ファイルサイズが大きすぎます: ${file.name}\n最大5MBまで (現在: ${sizeMB}MB)`
            );
        }
    };

    // `FileReader`によるアップロード画像の描画処理
    const renderPreview = async (file: File): Promise<filePreviewType> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    file,
                    preview: e.target?.result as string,
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        try {
            files.forEach(file => validateFile(file));
            const previews = await Promise.all(files.map(renderPreview));
            setFilePreviews(prev => [...prev, ...previews]);
        } catch {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            throw new Error('ファイルのバリデーションまたは描画処理中にエラーが発生');
        }
    };

    const removeFile = (index: number) => {
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [loading]);

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                disabled={loading}
                multiple
            />
            {filePreviews.length > 0 &&
                <div className={mainStyle.fileUploaderWrapper}>
                    {filePreviews.map((preview, index) => (
                        <figure key={index}>
                            <img src={preview.preview} alt={preview.file.name} />
                            <p>{preview.file.name}（{(preview.file.size / 1024).toFixed(2)} KB）</p>
                            <button type='button' className={mainStyle.resetBtn}
                                onClick={() => removeFile(index)}
                                disabled={loading}
                                aria-label="削除"
                            >🗑️</button>
                        </figure>
                    ))}
                </div>
            }
        </div>
    );
};