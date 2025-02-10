import { useEffect } from "react"

export const Modal = ({children, visible, size='lg'}: {children: any, visible: boolean, size?: 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'}) => {
    useEffect(() => {
        if (visible) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [visible])

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className={`bg-white w-full max-w-${size} p-6 rounded-lg shadow-lg transform transition-all duration-300 ${visible ? "scale-100" : "scale-90"}`}>
                {children}
            </div>
        </div>
    )
}

export const ModalTitle = ({children}: {children: any | string}) => {
    return <h2 className="text-xl font-semibold w-full text-center">{children}</h2>;
}

export const ModalActionTitle = ({children}: {children: any | string}) => {
    return <h2 className="text-sm  text-gray-700 font-semibold w-full text-center">{children}</h2>;
}

export const ModalSubtitle = ({children}: {children: any | string}) => {
    return <h2 className="font-light text-gray-400 w-full text-center">{children}</h2>;
}