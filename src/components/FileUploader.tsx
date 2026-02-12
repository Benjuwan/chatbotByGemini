import { useEffect, useRef, type ChangeEvent } from 'react';
import type { filePreviewType } from '../types/theChatBotType';

type FileUploaderPropsType = {
    loading: boolean;
    filePreviews: filePreviewType[];
    setFilePreviews: React.Dispatch<React.SetStateAction<filePreviewType[]>>;
};

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const FileUploader = ({ props }: { props: FileUploaderPropsType }) => {
    const { loading, filePreviews, setFilePreviews } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): void => {
        if (file.size > MAX_SIZE_BYTES) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            alert(`ファイルサイズが大きすぎます: ${file.name}\n最大20MBまで（filesize: ${sizeMB}MB）`);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            throw new Error(
                `ファイルサイズが大きすぎます: ${file.name}\n最大20MBまで（filesize: ${sizeMB}MB）`
            );
        }
    };

    // FileReader によるアップロード画像の描画処理
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

        files.forEach(file => validateFile(file));

        try {
            const previews = await Promise.all(files.map(renderPreview));
            setFilePreviews(prev => [...prev, ...previews]);
        } catch {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            throw new Error('ファイルの描画処理中にエラーが発生');
        }
    };

    // アップロードファイルの削除またはリセット機能
    const removeFile = (index: number | []): void => {
        if (typeof index === 'number') {
            setFilePreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            setFilePreviews([]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // JSXの描画処理内で、アップロードしたファイルがpdfファイルかどうかをチェックする関数
    const checkPdfFile = (fileItem: filePreviewType): boolean => {
        return fileItem.file.type.split('/').at(-1) === 'pdf';
    }

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [loading]);

    return (
        <>
            <input
                className="appearance-none w-fit file:border file:border-[#333] file:rounded-lg file:leading-8 file:text-sm file:px-2"
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
                multiple
            />
            {filePreviews.length > 0 &&
                <>
                    <div className="p-4 grid gap-4 grid-cols-2 lg:grid-cols-3">
                        {filePreviews.map((fileItem, index) => (
                            <div key={index}>
                                {checkPdfFile(fileItem) ?
                                    <p>{fileItem.file.name}（{(fileItem.file.size / 1024).toFixed(2)} KB）</p> :
                                    <figure>
                                        <img src={fileItem.preview} alt={fileItem.file.name} />
                                        <p className="leading-normal">{fileItem.file.name}（{(fileItem.file.size / 1024).toFixed(2)} KB）</p>
                                    </figure>
                                }
                                <button type='button' className="text-[#333] bg-white border border-[#dadada] my-2 enabled:cursor-pointer enabled:hover:border-[#cc1515] enabled:hover:text-[#cc1515]"
                                    onClick={() => removeFile(index)}
                                    disabled={loading}
                                    aria-label="削除"
                                >🗑️</button>
                            </div>
                        ))}
                    </div>
                    {filePreviews.length > 1 && <button className="text-[#333] bg-white border border-[#dadada] my-2 enabled:cursor-pointer enabled:hover:border-[#cc1515] enabled:hover:text-[#cc1515] p-2 rounded" type="button" disabled={loading} onClick={() => removeFile([])}>画像を一括リセット</button>}
                </>
            }
        </>
    );
};
