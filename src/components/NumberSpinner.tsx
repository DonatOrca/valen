import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const sample_space = 25;
const itemHeight = 112;
const itemOffset = 6;

export default function NumberSpinner({ count }: { count: number }) {
    const numberRef = useRef<HTMLDivElement>(null);
    const numberSpanRef = useRef<HTMLSpanElement>(null);
    const [numbers, setNumbers] = useState<number[]>([]);   

    const rollNumbers = (newValue: number) => {
        if (!numberRef.current) return;
        const randomNumbers = Array.from({ length: sample_space }, () =>
            Math.floor(Math.random() * 10)
        );
        randomNumbers.push(newValue);
        setNumbers(randomNumbers);

        gsap.fromTo(
            numberRef.current,
            { y: 0, opacity: 0 },
            {
                y: (-(itemHeight * sample_space) / 2) - itemOffset,
                duration: 1.5,
                opacity: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.set(numberRef.current, { y: (-(itemHeight * sample_space) / 2) - itemOffset });
                    if (numberSpanRef.current) {
                        const tl = gsap.timeline();
                        tl.to(numberSpanRef.current, {
                             duration: 0.25,
                            scale: 1.15,
                            rotation: () => gsap.utils.random(-12, 12),
                            ease: "power2.out",
                        }).to(numberSpanRef.current, {
                            duration: 0.5,
                            scale: 1,
                            rotation: 0,
                            ease: "power2.out",
                        })
                    }
                },
            }
        )
    };

    useEffect(() => {
        rollNumbers(count);
    }, [count]);

    return (
        <div className={`relative h-28 w-full overflow-hidden text-9xl font-bold flex justify-center items-center rounded-lg`}>
            <div ref={numberRef} className="flex flex-col items-center">
                {numbers.map((num, i) => (
                    <span key={i} className="h-28 flex items-center justify-center" ref={i === numbers.length-1 ? numberSpanRef : null}>{num}</span>
                ))}
            </div>
        </div>
    );
}