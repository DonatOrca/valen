import { createContext, ReactNode, useContext, useState } from "react";

type ToastType = "success" | "warning" | "error";
export interface Toast {
    id: number,
    message: string,
    type: ToastType,
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (message: string, type: ToastType = "success") => {
        const newToast: Toast = { id: Date.now(), message, type};
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id)), 10000);
    }
    return (
        <ToastContext.Provider value={{ addToast }} >
            { children  }
            <div className="fixed bottom-5 right-5 space-y-2 z-50">
                { toasts.map((toast) => (
                    <div key={toast.id} className={`flex items-center p-4 text-gray-600 text-sm rounded-lg shadow-md transition-opacity bg-white duration-300 ease-in-out`}>
                        <span className="mr-3 mt-1"> { 
                        toast.type === 'success' ? (<i className="fas text-lg fa-circle-check text-green-400"></i>) :
                            ( toast.type === 'error' ? (<i className="fas text-lg fa-circle-xmark text-red-500"></i>) :
                                (<i className="fas text-lg fa-triangle-exclamation text-orange-400"></i>)
                            )
                        } </span>
                        <p> { toast.message } </p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast() can only be called within a ToastProvider.");
    }
    return context;
}