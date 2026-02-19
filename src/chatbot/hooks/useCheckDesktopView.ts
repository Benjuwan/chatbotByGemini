import { useEffect, useState } from "react"

export const useCheckDesktopView = () => {
    const [isDesktopView, setDesktopView] = useState<boolean>(false);

    useEffect(() => {
        // effect 内で関数定義及び初期表示用に実行
        const handleResize = (): void => {
            const viewportWidth: number = document.body.clientWidth;

            if (viewportWidth >= 1024) {
                setDesktopView(true);
            } else {
                setDesktopView(false);
            }
        };

        handleResize(); // 初期表示用に実行

        window.addEventListener('resize', handleResize);

        // クリーンアップ処理
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return { isDesktopView };
}
