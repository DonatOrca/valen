import { ReactNode, useState } from "react"

export type SurveyContent = {
  title: string;
  options: {[key: string]: number | undefined}[] | string[]; // i know its bad but silence the type error "options.value = undefined" when it's actually a value
  // would make an interface for Constants.ts but im just lazy^
};

export function Survey({ content, onCompleted, onCompletedRender, title="Survey", closeSurvey }: { title?: string, content: SurveyContent[], onCompleted: (surveyOutput: string[], resetSurvey: () => void) => void, onCompletedRender: (resetSurvey: () => void) => ReactNode, closeSurvey?: () => void }) {
    const [answerIndex, setAnswerIndex] = useState(0);
    const [resetting, setResettingState] = useState(false);
    const [_, setAnswers] = useState<string[]>([]);
    const totalQuestions = content.length;

    const resetSurvey = () => {
        setResettingState(true);
        setAnswerIndex(0);
        setAnswers([]);
        setTimeout(() => setResettingState(false), 1);
    };

    const handleAnswerClick = (option: string) => {
        if (answerIndex >= totalQuestions) {return;}
        setAnswers((prev) => {
            const newAnswers = [...prev, option];
            if (answerIndex + 1 >= totalQuestions) setTimeout(() => onCompleted(newAnswers, resetSurvey), 0);
            return newAnswers;
        });
        setAnswerIndex((prev) => prev + 1);
    }
    const emptyContent = content[answerIndex]?.title === undefined;

    return (
        <div className="flex w-full max-w-2xl mx-auto p-6 min-h-[475px]">
            <div className="relative w-12 flex flex-col items-center">
                <div className="w-1 bg-gray-300 h-full rounded-full relative">
                    <div
                        className={`absolute top-0 w-1 bg-blue-500 rounded-full transition-all duration-500 ${resetting && "transition-none"}`}
                        style={{ height: `${(answerIndex / totalQuestions) * 100}%` }}
                    ></div>
                </div>
                {content.map((_, index) => (
                    <div key={index} className={`absolute w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-bold transition-all delay-500 ease-in-out ${resetting && "transition-none"} ${index <= answerIndex ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`} style={{ top: `${(index / totalQuestions) * 100}%`, transform: "translateY(-50%)" }}>
                        {index + 1}
                    </div>
                ))}
            </div>
            
            <div className={`ml-6 flex flex-col w-full justify-between ${emptyContent &&  'items-center'}`}>
                { emptyContent ? onCompletedRender(resetSurvey) : (
                    <>
                    <div className="w-full">
                        <h1 className="text-lg font-bold">{ content[answerIndex].title }</h1>
                        <div className="grid grid-cols-1 gap-2">
                            {answerIndex < totalQuestions && content[answerIndex].options.map((option, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 bg-transparent text-gray-500 rounded-lg border-[1px] hover:text-gray-700 scale-100 hover:scale-105 hover:shadow-sm transition-all duration-200"
                                    onClick={() => handleAnswerClick(typeof option === "string" ? option : Object.keys(option)[0])}
                                >
                                    {typeof option === "string" ? option : Object.keys(option)[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                    { closeSurvey && <button className="mb-2 left-1/2 mt-2 text-xs text-red-400 hover:text-red-500 transition-colors duration-300 hover:underline" onClick={closeSurvey}> Cancel { title } </button>}
                    </>
                )}
            </div>
        </div>
    );
}