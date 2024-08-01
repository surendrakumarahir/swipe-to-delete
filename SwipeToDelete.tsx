import { useCallback, useRef, useState } from "react";

interface Props {
    children: React.ReactElement;
    onDelete: () => void;
}

const SwipeToDelete: React.FC<Props> = ({ children, onDelete }: Props) => {
    const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
    const [swipeTranslateX, setSwipeTranslateX] = useState<number>(0);
    const itemRefs = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setSwipeStartX(e.touches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (swipeStartX !== null) {
            const translateX = Math.min(e.touches[0].clientX - swipeStartX, 0); // Only allow swiping left
            setSwipeTranslateX(translateX);
        }
    }, [swipeStartX]);

    const handleTouchEnd = useCallback(() => {
        const itemWidth = itemRefs.current?.offsetWidth || 0;
        if (Math.abs(swipeTranslateX) > itemWidth / 3) {
            onDelete();
        }
        setSwipeStartX(null);
        setSwipeTranslateX(0);
    }, [swipeTranslateX, onDelete]);

    return (
        <div style={{ position: "relative" }}>
            <div style={{
                position: "absolute",
                background: "#CD615F",
                justifyContent: "center",
                alignItems: "flex-end",
                display: "flex",
                flexDirection: "column-reverse",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                paddingRight: "16px",
                zIndex: 1,
            }}>
                <img src="/images/my-tfs/delete.svg" alt="Delete button" width={19} height={25} />
            </div>
            <div
                style={{
                    transform: `translateX(${swipeTranslateX}px)`,
                    zIndex: 2,
                    padding: 0,
                    position: "relative",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                ref={itemRefs}
            >
                {children}
            </div>
        </div>
    );
};

export default SwipeToDelete;

