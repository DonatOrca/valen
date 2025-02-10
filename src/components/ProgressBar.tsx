
export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-gray-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}