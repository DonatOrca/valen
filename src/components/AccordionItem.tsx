import React, { Dispatch, ReactNode, SetStateAction } from "react"

export default function AccordionItem({ index, activeIndex, title, children, setActiveIndex }: { index: number, activeIndex: number | null, title?: string, children: ReactNode, setActiveIndex: Dispatch<SetStateAction<number | null>> }) {
    return (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
            <button className="w-full px-4 text-xs py-3 flex justify-between items-center bg-white text-gray-700 transition hover:bg-gray-200" onClick={() => setActiveIndex((prev) => index === activeIndex ? null : index)}>
                { title }
                <i className={`fas fa-caret-down text-lg transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'}`}></i>
            </button>
            <div className={`bg-gray-100 transition-all duration-300 ${activeIndex === index ? 'max-h-40 opacity-100 p-4' : 'max-h-0 opacity-0 px-4 overflow-hidden'}`}>
                { children }
            </div>
        </div>
    )
}