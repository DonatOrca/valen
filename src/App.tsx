import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";

const title_data = [
    {quote:'Embody the word of Love, are we truly meant to be?', colors: ['F5393F', "920A0E", "64070A"]},
    {quote:'Embody the thrill of Love, as it paves way a future.', colors: ['8A0995', "D624E6", "8A0995"]},
    {quote:'Embody the truth of Love, that it is true yet so is it blind.', colors: ['3B0376', "5707AC", "7611E1"]},
]

function App() {
    const [index, setIndex] = useState(2);
    const titleContainerRef = useRef<HTMLDivElement | null>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(".quote", { opacity: 0, duration: 1, delay: 2})  
            .call(() => setIndex((prev) => (prev + 1) % title_data.length))
            .to(".quote", { opacity: 1, duration: 1 });
    }, { scope: titleContainerRef });

    return (
        <>
        <div className="h-screen w-full flex flex-col justify-center app-header">
            <div className="flex flex-col justify-center place-items-center items-center flex-grow" ref={titleContainerRef}>
                <h1 className="xl:text-7xl lg:text-5xl md:text-3xl sm:text-2xl text-xl font-bold font-serif">
                    {
                        ['Affinity.', 'Harmony.', 'Compatibility.'].map((title, titleIndex) => <span className="px-1 transition duration-1000 ease-in-out" style={{color: `#${title_data[index].colors[titleIndex]}`}} key={titleIndex}> {title} </span>)
                    }
                </h1>
                <p className="quote my-3 font-mono sm:tracking-wide tracking-tight text-xs font-light transition duration-1000 ease-out text-center" style={{color: `#${title_data[index].colors[index]}`}}> { title_data[index].quote } </p>
                <button className="px-6 py-2 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-lg text-lg transition-all duration-300 hover:scale-105">
                    Take the Test Now
                </button>
            </div>
        </div>
        <div className="app-content h-auto w-full flex items-start justify-center">
            <div className="w-full pl-10 md:pl-20 lg:pl-32 my-12">
                <div className="text-gray-950 max-w-screen-lg mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold mb-5">
                        What to expect
                    </h1>
                    <div className="mx-5 sm:mx-10 md:mx-20 my-3 text-gray-600 text-[8px]">
                        <ol className="list-disc pl-5">
                            <li><p className="text-xs sm:text-sm md:text-base">A numerology test to determine your name compatibility</p></li>
                            <li><p className="text-xs sm:text-sm md:text-base">Five personal questions for deeper insight</p></li>
                            <li><p className="text-xs sm:text-sm md:text-base">Five situational questions to understand your bond</p></li>
                        </ol>
                    </div>
                    <p className="text-xs sm:text-sm mx-5 sm:mx-7 text-gray-400">
                        By taking the test, you agree to provide personal information (name, gender, age, email).
                    </p>
                    <p className="text-xs sm:text-sm mx-5 sm:mx-7 text-gray-400">
                        The developers are not accountable for emotional or mental outcomes following the test.
                    </p>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 xl:grid-cols-3 place-items-center gap-5 my-14 pr-10 md:pr-20 lg:pr-32 text-purple-800 font-serif">
                <div className="bg-[rgb(254,243,251)] p-4 rounded-xl shadow-lg flex flex-col items-center w-full max-w-xs mx-auto h-full">
                    <i className="fa-solid fa-heart text-4xl text-red-500"></i>
                    <hr className="border-gray-300 w-1/2 my-2" />
                    <h1 className="font-extrabold text-sm sm:text-sm md:text-lg my-1">Learn the love</h1>
                    <p className="text-xs md:text-sm text-purple-900 text-center">Unravel how your love resonates with your partner!</p>
                </div>

                <div className="bg-[rgb(254,243,251)] p-4 rounded-xl shadow-lg flex flex-col items-center w-full max-w-xs mx-auto h-full">
                    <i className="fa-solid fa-clock text-4xl text-fuchsia-400"></i>
                    <hr className="border-gray-300 w-1/2 my-2" />
                    <h1 className="font-extrabold text-sm sm:text-sm md:text-lg my-1">Flow and sow</h1>
                    <p className="text-xs md:text-sm text-purple-900 text-center">Discover how fate may guide your paths!</p>
                </div>

                <div className="bg-[rgb(254,243,251)] p-4 rounded-xl shadow-lg flex flex-col items-center w-full max-w-xs mx-auto h-full">
                    <i className="fa-solid fa-user-group text-4xl text-purple-700"></i>
                    <hr className="border-gray-300 w-1/2 my-2" />
                    <h1 className="font-extrabold text-sm sm:text-sm md:text-lg my-1">Find your language</h1>
                    <p className="text-xs md:text-sm text-purple-900 text-center">Discover out your love language and how it connects!</p>
                </div>
            </div>
        </div>
        <div className="w-full h-[12vh] flex flex-col justify-center items-center text-gray-500">
                <div className="w-full flex flex-col sm:flex-row justify-center gap-10 px-5 sm:px-0">
                    <div className="text-center sm:text-end sm:ml-32 ml-16">
                        <p className="font-semibold text-xs sm:text-sm">Follow us on</p>
                        <div className="flex justify-center gap-x-2 mt-1">
                            <a href="https://www.facebook.com/OrCaDONAT/" aria-label='Facebook' target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-facebook text-blue-500 hover:text-blue-800 transition duration-500 sm:text-xl"></i>
                            </a>
                            <a href="https://discord.gg/aDWE6985yC" aria-label='Discord' target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-discord text-indigo-500 hover:text-indigo-800 transition duration-500 sm:text-xl"></i>
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