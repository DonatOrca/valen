import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import "./styles/Splash.css"
import App from './App';

interface HeartsInterface {
  heart: HTMLImageElement;
  goalX: number; 
  goalY: number;
  scale: number;
}

function Splash() {
  const logoRef = useRef<HTMLImageElement | null>(null);
  const introContainerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const heartsContainerRef = useRef<HTMLDivElement | null>(null);
  const appContainerRef = useRef<HTMLDivElement | null>(null);

  const hearts: HeartsInterface[] = useMemo(() => {
    const heartsArray: HeartsInterface[] = [];
    const numHearts = 6;
    const radius = 200;
    const deviation = 100;
    for (let i = 0; i < numHearts; i++) {
      const angle = (i / numHearts) * 2 * Math.PI;
      let goalX = radius * Math.cos(angle);
      let goalY = radius * Math.sin(angle);
      goalX += Math.random() * deviation * 2 - deviation;
      goalY += Math.random() * deviation * 2 - deviation;

      const scale = Math.random() * 0.8 + 1.5;

      const heart = document.createElement("img");
      heart.classList.add("heart-object");
      heart.style.opacity = "0";

      if (goalX > 0) heart.src = '/heart-icon-right.png';
      else heart.src = '/heart-icon-left.png';
      heartsArray.push({ heart, goalX, goalY, scale });
    }
    return heartsArray;
  }, []) as unknown as HeartsInterface[]

  useEffect(() => {
    hearts.forEach(({ heart }) => heartsContainerRef.current!.append(heart))
    return () => {
      hearts.forEach(({ heart }) => heart.remove())
    }
  }, [hearts, heartsContainerRef])

  const animateHearts = () => {
    hearts.forEach(async ({heart, goalX, goalY, scale}) => {
      const tl = gsap.timeline()
      tl.fromTo(
        heart,
        { x: 0, y: 0, scale: 0, opacity: 1 },
        {
          x: goalX,
          y: goalY,
          scale: scale,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      )
        .to(heart, {
          opacity: 0,
          scale: 0,
          duration: 1.5,
        });
    })
  }

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      {y: "-100vh", opacity: 0},
      {y: 0, opacity: 1, duration: 1, ease: "power2.out"},
    )
      .to(logoRef.current, {y: -30, duration: 0.3, ease: "power2.inOut"})
      .call(() => animateHearts())
      .to(logoRef.current, {y: 0, duration: 0.3, ease: "bounce.out"})
      .to(logoRef.current, {x: "-256px", duration: 0.8, delay: 1, ease: "power1.inOut"})
      .set(textContainerRef.current, { visibility: "visible" })
      .fromTo(
        textContainerRef.current,
        { opacity: 0, x: '150px' },
        { opacity: 1, x: '128px', duration: 0.8, ease: "power2.out" },
      )
      .to([introContainerRef.current, appContainerRef.current], {
        y: "-100vh",
        duration: 1.7,
        delay: 1,
        ease: "power2.inOut"
      }).call(() => {
        introContainerRef.current!.remove();
        const app = appContainerRef.current!
        app.style.transform = 'none'
        app.style.position = 'static'
        app.classList.remove('absolute')
        const container = document.getElementById('container')
        container?.classList.remove('relative', 'overflow-hidden')
      })
  }, { scope: introContainerRef })
  
  return (
    <div id='container' className='bg-slate-50 relative overflow-hidden h-full'>
      <div className='relative' id='intro-container' ref={introContainerRef}>
        <div
          ref={heartsContainerRef}
          className="absolute w-full h-full flex justify-center items-center overflow-hidden pointer-events-none"
          style={{willChange: 'transform, opacity, transform3d'}}
        ></div>
        <div className='h-screen flex justify-center place-items-center'>
          <img ref={logoRef} src='/logo.png' alt='logo' className='w-64 h-64' />
          <div className='flex flex-col absolute' ref={textContainerRef} style={{visibility: 'hidden'}}>
            <h1 className='text-5xl font-bold text-slate-800'>
              Love Compatibility Test
            </h1>
            <p className="text-sm font-light text-slate-400">Made by DONAT Development Team</p>
          </div>
        </div>  
      </div>
      <div id='app' ref={appContainerRef} className='h-screen absolute w-full'>
        <App />
      </div>
    </div>
  );
}

export default Splash;
