
export function Proceed({ onNext, onAbort, disabled }: { onNext: () => void; onAbort: () => void; disabled: boolean }) {
    return (
        <div className="flex flex-col items-center mt-4">
            <button
                className={`px-10 py-2 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ${
                    disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={!disabled ? onNext : undefined}
                disabled={disabled}
            >
                Continue →
            </button>
            {disabled && <p className="mt-2 text-xs text-red-500">You must complete all required fields before proceeding.</p>}
            <button className="mt-2 text-xs text-gray-500 hover:underline" onClick={onAbort}>
                Cancel
            </button>
        </div>
    );
}