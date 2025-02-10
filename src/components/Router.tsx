import { ReactNode, useRef, useState } from "react";

export interface Page {
    transitioning?: (historyState: Record<string, any>) => Promise<void> | void;  // Can be async
    render: (navigate: (newPage: string, state?: Record<string, any>) => void, historyState: Record<string, any>, previousPage: string) => ReactNode;
}

export default function useRouter(
    pages: { [key: string]: Page },
    defaultPage: string
): [ReactNode, (newPage: keyof typeof pages, state?: Record<string, any>) => void, () => void] {
    const [currentPage, setCurrentPage] = useState(defaultPage);
    const [previousPage, setPreviousPage] = useState(defaultPage);
    const [transitioning, setTransitioning] = useState(false);
    const historyStateRef = useRef<Record<string, any>>({});

    const navigate = async (newPage: keyof typeof pages, state: Record<string, any> = {}) => {
        if (transitioning || newPage === currentPage) return;

        setTransitioning(true);
        const transitionFunction = pages[currentPage]?.transitioning;
        if (transitionFunction) {
            await transitionFunction(historyStateRef.current);
        }

        setPreviousPage(currentPage);
        setCurrentPage(newPage as string);
        historyStateRef.current = {...historyStateRef.current, ...state};

        setTimeout(() => setTransitioning(false), 75);
    };

    return [
        (
            <div className="relative w-full">
                {transitioning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {pages[currentPage].render(navigate, historyStateRef.current, previousPage)}
            </div>
        ),
        navigate,
        () => { // history reset
            setCurrentPage(defaultPage);
            setPreviousPage(defaultPage);
            historyStateRef.current = {}
        }
    ];
}