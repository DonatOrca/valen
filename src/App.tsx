import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import InfoCard from "./components/InfoCard";
import { Modal, ModalActionTitle, ModalSubtitle, ModalTitle } from "./components/Modal";
import useRouter from "./components/Router";
import { Survey } from "./components/Survey";
import { FloatingLabel } from "./components/FloatingLabel";
import { Proceed } from "./components/Proceed";
import { LoveArchetypesData, LoveLanguageQuestionnaireData, LoveResonanceQuestionnaireData } from "./modules/Constants";
import { get_total_numerology_score } from "./modules/NumerologyUtil";
import NumberSpinner from "./components/NumberSpinner";
import { useToast } from "./components/Toast";
import { fetchSafe } from "./modules/SafeFetch";
import AccordionItem from "./components/AccordionItem";

const title_data = [
    {quote:'Embody the word of Love, are we truly meant to be?', colors: ['F5393F', "920A0E", "64070A"]},
    {quote:'Embody the thrill of Love, as it paves way a future.', colors: ['8A0995', "D624E6", "8A0995"]},
    {quote:'Embody the truth of Love, that it is true yet so is it blind.', colors: ['3B0376', "5707AC", "7611E1"]},
]

function App() {
    const { addToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [singleSurveyMode, setSingleSurveyMode] = useState(true);
    const [resultsAccordionIndex, setResultsAccordionIndex] = useState<number | null>(null);
    const [firstPartner, setFirstPartnerData] = useState({
        name: '',
        resonanceAnswers: [] as any[],
        languageAnswers: [] as any[],
    })
    const [secondPartner, setSecondPartnerData] = useState({
        name: '',
        resonanceAnswers: [] as any[],
        languageAnswers: [] as any[],
    })
    const titleContainerRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const titleSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
    const indexRef = useRef(0);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });
            tl.to(".quote", { opacity: 0, duration: 1, delay: 4 })
                .call(() => {
                    indexRef.current = (indexRef.current + 1) % title_data.length;
                    document.querySelector(".quote")!.textContent = title_data[indexRef.current].quote;
                })
                .to(".quote", { opacity: 1, duration: 1 });
            tl.eventCallback("onUpdate", () => {
                if (textRef.current) {
                    textRef.current.style.color = `#${title_data[indexRef.current].colors[indexRef.current]}`;
                }
                titleSpansRef.current.forEach((span, i) => {
                    if (span) {
                        span.style.color = `#${title_data[indexRef.current].colors[i]}`;
                    }
                });
            });
        }, titleContainerRef);

        return () => ctx.revert();
    }, []);

    const resetSurveyData = useCallback(() => {
    }, [])

    const resetModal = useCallback((reset?: () => void) => {
        setModalOpen(false);
        setSingleSurveyMode(true);
        resetSurveyData();
        if (reset) reset();
    }, []);

    const SurveyInputField = ({ navigate, history, reset, resetAll }: { navigate: (nextPage: string, state?: Record<string, any>) => void, history: Record<string, any>, reset: () => void, resetAll: () => void}) => {
        const HintText = ({children}: {children: ReactNode}) => <p className="text-xs text-gray-400 font-light text-center">{children}</p>
        const getHintText = () => {
            if (!singleSurveyMode) {
                if (history.firstPartnerAnswered && !history.secondPartnerAnswered)
                    return (
                        <HintText>
                            Your love resonance test is almost complete!<br />
                            Hand the device over to your partner for it's their turn now!
                        </HintText>
                    );
                else
                    return (
                        <HintText>
                            Both of your love resonance tests are complete!<br />
                            Before getting your results, kindly tick the checkbox below.
                        </HintText>
                    );
            } else {
                if (!history.firstStageAnswered)
                    return (
                        <HintText>
                            Your love resonance test is almost complete!<br />
                            What awaits next is how your love language would be interpreted!
                        </HintText>
                    );
                else
                    return (
                        <HintText>
                            Your love resonance test is complete!<br />
                            Before getting your results, kindly tick the checkbox below.
                        </HintText>
                    );
            }
        };

        const [name, setName] = useState('');
        const [partnerName, setPartnerName] = useState('');
        const [consented, setConsent] = useState(false);
        
        const completed = singleSurveyMode ? history.firstStageAnswered === true : history.firstPartnerAnswered && history.secondPartnerAnswered
        return (
            <div className="flex flex-col w-full h-full">
                <h2 className={`text-2xl font-semibold w-full text-center`}>{(completed ? 'Quiz Complete!' : 'Almost there!')}</h2>
                { getHintText() /* ambuigity fix due to ternary operators :( */ }
                { !completed ? (
                    <>
                        <hr className="border-gray-300 w-1/2 mt-2 mb-1 mx-auto" />
                        <p className="text-sm text-gray-500 font-light text-center">
                            But before that, we'd like to ask for you and your partner's name for a numerology analysis!
                        </p>
                        <div className={`w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-5`}>
                            <FloatingLabel label="Your name" value={name} onChange={(e) => (setName(e.target.value))} />
                            <FloatingLabel label="Partner's name" value={partnerName} onChange={(e) => (setPartnerName(e.target.value))} />
                        </div>
                    </>
                ) : (
                    <>
                        <hr className="border-gray-300 w-1/2 mt-2 mb-1 mx-auto" />
                        <div className="mt-3 flex items-center justify-center">
                            <input
                                id="consent"
                                type="checkbox"
                                checked={consented}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="consent" className="text-xs text-gray-600">
                                By checking this box, I acknowledge and agree that this website may collect and process personal data in accordance with its <span className="text-blue-600 underline cursor-pointer">Data Privacy Policy</span>, in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                            </label>
                        </div>
                    </>
                )}
                <Proceed 
                    onNext={() => {
                        const nextPage = singleSurveyMode ?
                            ( !history.firstStageAnswered ? 'languageQuiz' : 'results')
                        : ( !history.secondPartnerAnswered ? 'resonanceQuiz' : 'results')
                        
                        if (!completed) {
                            setFirstPartnerData((prev) => ({ 
                                ...prev, 
                                name 
                            }));
                            setSecondPartnerData((prev) => ({ 
                                ...prev, 
                                name: partnerName 
                            })); 
                        }                   

                        setTimeout(() => {
                            navigate(nextPage, {
                                ...history,
                                firstStageAnswered: singleSurveyMode ? true : undefined,
                            })
                            reset();
                        }, 0)
                    }}
                    onAbort={() => resetModal(resetAll)}
                    disabled={completed ? !consented : (singleSurveyMode
                    ? !name.trim() || !partnerName.trim()
                    : !name.trim())} />
            </div>
        );
    }

    const [render, _, reset] = useRouter({
        splash: { render: (navigate) => (
            <>
                <ModalTitle>How'd you like to perform the test?</ModalTitle>
                <ModalSubtitle>This is to ensure that the test can assume and verify relatable responses.</ModalSubtitle>
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                    <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-color duration-200"
                        onClick={() => { navigate("resonanceQuiz"); setSingleSurveyMode(true); resetSurveyData(); }}>
                        I'd like to take the test for myself
                    </button>
                    <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-color duration-200"
                        onClick={() => { navigate("resonanceQuiz"); setSingleSurveyMode(false); resetSurveyData(); }}>
                        I'd like to take it with my partner
                    </button>
                </div>
                <button className="bg-transparent w-full text-center text-gray-400 hover:text-gray-700 transition duration-200 mt-2"
                    onClick={() => resetModal(reset)}>
                    Nevermind, maybe next time
                </button>
            </>
        ) },
        languageQuiz: { render: (navigate, history) => (
            <>
            <ModalTitle>Love Language</ModalTitle>
            <ModalActionTitle>Discover your love language that will be based upon the given questions!</ModalActionTitle>
            <ModalSubtitle>This test transacts as a single test unlike the previous one, only the original test taker is ought to answer this.</ModalSubtitle>
            <Survey
                title="Quiz"
                content={LoveLanguageQuestionnaireData}
                closeSurvey={() => resetModal(reset)}
                onCompleted={(results) => {
                    if (singleSurveyMode) {
                        setFirstPartnerData((prev) => ({
                            ...prev,
                            languageAnswers: results,
                        }));
                        setSecondPartnerData((prev) => ({
                            ...prev,
                            languageAnswers: results,
                        }));
                    } else {
                        if (history.secondPartnerAnswered)
                            setSecondPartnerData((prev) => ({
                                ...prev,
                                languageAnswers: results,
                            }));
                        else
                            setFirstPartnerData((prev) => ({
                                ...prev,
                                languageAnswers: results,
                            }));
                    }
                }}
                onCompletedRender={(resetSurvey) => {
                    if (!singleSurveyMode || (singleSurveyMode && history.firstStageAnswered)) return (<SurveyInputField navigate={navigate} history={{ ...history }} reset={resetSurvey} resetAll={reset} />);
                    return (<></>)
                }}
            />
            </>
        ) },
        resonanceQuiz: { render: (navigate, history) => (   
            <>
            <ModalTitle>Love Resonance</ModalTitle>
            <ModalActionTitle>Test how your love should resonate with your partner</ModalActionTitle>
            <ModalSubtitle>This test best works with a partner as the output will be evaluated by AI.</ModalSubtitle>
            <Survey
                title="Quiz"
                content={LoveResonanceQuestionnaireData}
                closeSurvey={() => resetModal(reset)}
                onCompleted={(results, resetSurvey) => {
                    if (singleSurveyMode) {
                        setFirstPartnerData((prev) => ({
                            ...prev,
                            resonanceAnswers: results,
                        }));
                        setSecondPartnerData((prev) => ({
                            ...prev,
                            resonanceAnswers: results,
                        }));
                    } else {
                        if (history.secondPartnerAnswered)
                            setSecondPartnerData((prev) => ({
                                ...prev,
                                resonanceAnswers: results,
                            }));
                        else
                            setFirstPartnerData((prev) => ({
                                ...prev,
                                resonanceAnswers: results,
                            }));
                    }

                    if (!singleSurveyMode) {
                        resetSurvey();
                        navigate("languageQuiz", { 
                            ...history, 
                            firstPartnerAnswered: true,
                            secondPartnerAnswered: history.firstPartnerAnswered !== undefined,
                        });
                    }
                }}
                onCompletedRender={(resetSurvey) => {
                    if (singleSurveyMode) return (<SurveyInputField navigate={navigate} history={{ ...history }} reset={resetSurvey} resetAll={reset} />);
                    return (<></>)
                }}
            />
            </>
        ) },
        results: { render: (navigate, history) => {
            return (
                <>
                <ModalTitle>Quiz Results</ModalTitle>
                <ModalSubtitle>Here be the results you lovebirds!</ModalSubtitle>
                <ModalActionTitle>{ (history.firstPartnerName as string).split(/\s+/)[0] } and { (history.secondPartnerName as string).split(/\s+/)[0] } sitting on a tree...</ModalActionTitle>
                <div className="w-full my-10 h-full grid grid-cols-2 items-center">
                    <div className="space-y-1">
                        <NumberSpinner count={history.numerologyScore} />
                        <p className="text-sm text-gray-600 font-semibold w-full text-center"> Your numerology score...</p>
                    </div>
                    <div className="w-full h-32 overflow-y-scroll">
                        <p className="text-sm text-gray-600 p-2"> { history.resonanceResponse } </p>
                    </div>
                </div>
                <div className="w-full h-full grid grid-cols-2 gap-x-2">
                    <div className="w-full h-full flex flex-col justify-center">
                        <p className="font-semibold text-lg text-gray-500 leading-[5px]"> You are a... </p>
                        <p className="font-bold text-xl text-gray-700"> { history.languageTypeResponse } </p>
                        <p className="font-light text-xs text-gray-400"> { history.languageResponse } </p>
                    </div>
                    <div className="w-full h-full space-y-2 max-w-md mx-auto">
                        { LoveArchetypesData.map((info, index) => (
                            <AccordionItem index={index} title={info.title} activeIndex={resultsAccordionIndex} setActiveIndex={setResultsAccordionIndex}>
                                <div className="h-full max-h-20 px-3 w-full overflow-y-scroll accordion-scroll">
                                    <p className="text-xs text-gray-800"> { info.description } </p>
                                </div>
                            </AccordionItem>
                        ))}
                    </div>
                </div>
                <button className="text-red-400 hover:text-red-700 transition duration-200 mt-2 w-full text-center" onClick={() => resetModal(reset)}>
                    Close
                </button>
                </>
        ) }, transitioning: async (transitionState, setTransitionText) => {
            if (!firstPartner?.name || !secondPartner?.name || !firstPartner?.resonanceAnswers || !firstPartner?.languageAnswers || !secondPartner?.resonanceAnswers || !secondPartner?.languageAnswers) {
                resetModal(reset); // force reset
                addToast("Cannot transition to stage 'router -> results' due to insufficient variables. Forcefully resetted the modal.", "warning")
                return
            };

            // try to ping the server if we have any available quota or else we won't get anything
            const checkQuota = async (): Promise<boolean> => {
                const [ok, response] = await fetchSafe("https://donatorca-valen-vercel.vercel.app/api/prompt-gemini-response", {
                    method: "GET",
                });
                if (!ok) {
                    addToast("Failed to check quota. Please try again later.", "error");
                    return false;
                }

                const { remainingRequestsPerMinute, remainingRequestsPerDay } = await (response! as Response).json();
                if (remainingRequestsPerDay === 0) {
                    addToast("Daily quota exceeded. Try again tomorrow.", "error");
                    return false;
                }

                if (remainingRequestsPerMinute === 0) {
                    addToast("Rate limit exceeded. Retrying in 1 minute...", "warning");
                    let secondsLeft = 60;
                    while (secondsLeft > 0) {
                        setTransitionText(`Looks like we've reached a global daily queue and that we're having some setbacks in getting you to queue! We'll automatically attempt to refresh and queue back in ${secondsLeft}s.`)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        secondsLeft--;
                    }
                    return await checkQuota();
                }

                return true;
            }
            if (!await checkQuota()) {
                resetModal(reset);
                return;
            }

            const numerologyScore = get_total_numerology_score(firstPartner.name, secondPartner.name);
            const payload = {
                firstPartner,
                secondPartner,
                numerologyScore,
                singleSurveyMode,
            };
            let data;
            const [ok, response] = await fetchSafe(`https://donatorca-valen-vercel.vercel.app/api/prompt-gemini-response`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!ok) {
                addToast(response as string, "error")
            } else data = await (response! as Response).json();
            if (data && data.error && typeof data.error === "string") addToast(data.error as string, "error");
            transitionState({
                numerologyScore,
                firstPartnerName: firstPartner.name,
                secondPartnerName: secondPartner.name,
                languageTypeResponse: data.languageArchetype || "Sorry, we couldn't determine that. :(",
                languageResponse: data.languageResponse || "We aren't sure what kind of love language you use to spoil and shower your partner with due to the current unstable connection...",
                resonanceResponse: data.resonanceResponse || "Looks like we are having trouble evaluating and giving feedback basing from your answers! We would like to apologize as we could only provide your numerology score (provided in the left) as it is determinable by locally-done operations. The quizzes you'd answered are indeterministic and complex, which requires an Artificial Intelligence model to interpret on-the-go. Happy numerology folks!"
            })
        } },
    }, "splash");

    return (
        <>
        <Modal visible={modalOpen}>
            <> { render } </>
        </Modal>
        <div className="h-screen w-full flex flex-col justify-center app-header">
            <div className="flex flex-col justify-center place-items-center items-center flex-grow" ref={titleContainerRef}>
                    <h1 className="xl:text-7xl lg:text-5xl md:text-3xl sm:text-2xl text-xl font-bold font-serif">
                        {['Affinity.', 'Harmony.', 'Compatibility.'].map((title, titleIndex) => (
                            <span className="px-1 transition duration-1000 ease-in-out" ref={(el) => (titleSpansRef.current[titleIndex] = el)} key={titleIndex}>
                                {title}
                            </span>
                        ))}
                    </h1>
                    <p className="quote my-3 font-mono sm:tracking-wide tracking-tight text-xs font-light transition duration-1000 ease-out text-center" ref={textRef}> </p>
                <button className="px-6 py-2 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-lg text-lg transition-all duration-300 hover:scale-105" onClick={() => setModalOpen(true)}>
                    Take the Test Now
                </button>
            </div>
        </div>
        <div className="app-content-cut h-auto w-full flex flex-row-reverse xl:flex-col items-center justify-center px-8 md:px-16 lg:px-32">
            <div className="w-auto grid grid-cols-1 xl:grid-cols-3 place-items-center gap-5 mx-10 xl:mx-0 my-5 xl:mt-10 xl:my-0 text-purple-800 font-serif">
                <InfoCard title="Learn the love" content="Unravel how your love resonates with your partner!" icon_properties={{font_awesome: "fa-solid fa-heart", color: "text-red-500"}} color="text-purple-900" rounded="xl:rounded-l-xl rounded-t-xl xl:rounded-none" />
                <InfoCard title="Flow and sow" content="Learn how fate may guide your paths!" icon_properties={{font_awesome: "fa-solid fa-clock", color: "text-fuchsia-400"}} color="text-purple-900" />
                <InfoCard title="Find your language" content="Discover out your love language and how it connects!" icon_properties={{font_awesome: "fa-solid fa-user-group", color: "text-purple-700"}} color="text-purple-900" rounded="xl:rounded-r-xl rounded-b-xl xl:rounded-none" />
            </div>
            <div className="text-gray-950 max-w-screen-lg mx-auto my-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-5 xl:text-center">
                    What to expect
                </h1>
                <div className="mx-5 sm:mx-10 md:mx-20 xl:mx-30 xl:text-center my-3 text-gray-600 text-[8px]">
                    <ol className="list-disc pl-5">
                        <li><p className="text-xs sm:text-sm md:text-base">A numerology test to determine your name compatibility</p></li>
                        <li><p className="text-xs sm:text-sm md:text-base">Five personal questions for deeper insight</p></li>
                        <li><p className="text-xs sm:text-sm md:text-base">Five situational questions to understand your bond</p></li>
                    </ol>
                </div>
                <p className="text-[8px] sm:text-xs mx-5 sm:mx-7 text-gray-400  xl:text-center">
                    By taking the test, you agree to provide personal information (name, gender, age, email).<br />
                    The developers are not accountable for emotional or mental outcomes following the test. <br />
                    This test was made for <b>entertainment purposes</b> and requires an <b>active connection</b> due to using <a className="text-blue-500 hover:text-blue-600 transition-colors duration-300 underline" href="https://gemini.google.com/app" target="_blank" rel='noreferrer'>Gemini</a> to determine complex data <i>(ie. quiz answers)</i>.
                </p>
            </div>
        </div>
        {/*
        <div className="w-full h-auto my-5 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-medium text-gray-700"> TESTIMONIES </h1>
            <p className="text-[10px] font-light text-gray-500"> Get to hear what our previous users say! </p>
        </div>
        */}
        <div className="w-full h-auto py-5 flex flex-col justify-center items-center text-gray-500">
                <div className="w-full flex flex-col sm:flex-row justify-center sm:gap-10 gap-1 px-5 sm:px-0">
                    <div className="text-center sm:text-end sm:ml-32 xs:ml-16 ml-0">
                        <p className="font-semibold text-xs sm:text-sm">Follow us on</p>
                        <div className="flex justify-center gap-x-2 mt-1">
                            <a href="https://www.facebook.com/OrCaDONAT/" aria-label='Facebook' target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-facebook text-blue-500 hover:text-blue-800 transition duration-500 sm:text-xl"></i>
                            </a>
                            <a href="https://github.com/DonatOrca" aria-label='Github' target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-github text-slate-600 hover:text-indigo-950 transition duration-500 sm:text-xl"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div className="text-[6px] sm:text-xs sm:leading-tight leading-loose text-center sm:text-left mt-4 sm:mt-0">
                        <p>STI Academic Center Ortigas-Cainta</p>
                        <p>Developers of Next Advanced Technologies</p>
                        <p>DONAT Development Team</p>
                    </div>
                </div>
                <hr className="border-gray-300 w-1/6 my-2 mx-auto" />
                <p className="text-[6px] sm:text-xs font-extralight">© 2025 Developers of Next Advanced Technology</p>
            </div>
        </>
    )
}

export default App;