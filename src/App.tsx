import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState } from "react";

const title_data = [
    {quote:'Embody the word of Love, are we truly meant to be?', colors: ['F5393F', "920A0E", "64070A"]},
    {quote:'Embody the thrill of Love, as it may be fate and that fate will destine our paths.', colors: ['8A0995', "D624E6", "8A0995"]},
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
    }, { scope: titleContainerRef })

    return (
        <div className="h-screen w-full flex flex-col justify-center place-items-center">
            <div className="flex flex-col justify-center place-items-center" ref={titleContainerRef}>
                <h1 className="text-7xl font-bold font-serif">
                    {
                        ['Affinity.', 'Harmony.', 'Compatibility.'].map((title, titleIndex) => <span className="px-1 transition duration-1000 ease-in-out" style={{color: `#${title_data[index].colors[titleIndex]}`}} key={titleIndex}> {title} </span>)
                    }
                </h1>
                <p className="quote my-3 font-mono tracking-wide text-xs font-light transition duration-1000 ease-out" style={{color: `#${title_data[index].colors[index]}`}}> { title_data[index].quote } </p>
                <button className="px-6 py-2 text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-lg text-lg transition-all duration-300 hover:scale-105">
                    Take the Test Now
                </button>
                <hr className="border-1 w-1/2 h-px my-4 bg-slate-500" />
                <h2 className="text-base text-slate-400"> a love compatibility test</h2>
            </div>
        </div>
    )
}

export default App;