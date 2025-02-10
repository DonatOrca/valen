import React from "react";

export function FloatingLabel({ label, onChange, value }: { label: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, value?: string }) {
    return (
        <div className="relative w-full">
            <input
                type="text"
                id={label}
                className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder=" "
                value={value}
                onChange={onChange}
            />
            <label
                htmlFor={label}
                className="absolute left-3 top-1.5 text-gray-500 text-xs transition-all 
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
            >
                {label}
            </label>
        </div>
    );
}