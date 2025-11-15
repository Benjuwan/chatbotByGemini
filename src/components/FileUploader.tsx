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
        const reader = new FileReader();

        const isPdfFile: boolean = file.type.split('/').at(-1) === 'pdf';
        if (isPdfFile) {
            return new Promise((resolve) => {
                reader.onload = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        const base64 = reader.result;
                        resolve({
                            file: file,
                            preview: base64,
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        return new Promise((resolve) => {
            reader.onload = (e) => {
                resolve({
                    file: file,
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

    // JSXの描画処理内で、アップロードしたファイルがpdfファイルかどうかをチェックする関数
    const checkPdfFile = (fileItem: filePreviewType): boolean => fileItem.file.type.split('/').at(-1) === 'pdf';

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [loading]);

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
                multiple
            />
            {filePreviews.length > 0 &&
                <div className={mainStyle.fileUploaderWrapper}>
                    {filePreviews.map((fileItem, index) => (
                        <div key={index}>
                            {checkPdfFile(fileItem) ?
                                <p>{fileItem.file.name}（{(fileItem.file.size / 1024).toFixed(2)} KB）</p> :
                                <figure>
                                    <img src={fileItem.preview} alt={fileItem.file.name} />
                                    <p>{fileItem.file.name}（{(fileItem.file.size / 1024).toFixed(2)} KB）</p>
                                </figure>
                            }
                            <button type='button' className={mainStyle.resetBtn}
                                onClick={() => removeFile(index)}
                                disabled={loading}
                                aria-label="削除"
                            >🗑️</button>
                        </div>
                    ))}
                </div>
            }
        </>
    );
};