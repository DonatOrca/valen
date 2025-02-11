import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import "./styles/App.css"
import App from './App';
import ToastProvider from './components/Toast';

interface HeartsInterface {
  heart: HTMLImageElement;
  goalX: number; 
  goalY: number;
  scale: number;
}

function Splash() {
  const original_slide_position = '-256px';
  const original_fade_in_position = {from: "150px", to: "128px"};
  
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

      if (goalX > 0) heart.src = '/assets/heart-icon-right.png';
      else heart.src = '/assets/heart-icon-left.png';
      heartsArray.push({ heart, goalX, goalY, scale });
    }
    return heartsArray;
  }, []) as unknown as HeartsInterface[];

  /*
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { // md breakpoint of tailwind
        updateSlidePosition({x: slide_position_property.inactive, y: slide_position_property.active})
        updateFadeInPosition({x: fade_position_properties.inactive, y: fade_position_properties.active})
      } else {
        updateSlidePosition({x: slide_position_property.active, y: slide_position_property.inactive})
        updateFadeInPosition({x: fade_position_properties.active, y: fade_position_properties.inactive})
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  */

  useEffect(() => {
    hearts.forEach(({ heart }) => heartsContainerRef.current!.append(heart));
    return () => {
      hearts.forEach(({ heart }) => heart.remove());
    }
  }, [hearts, heartsContainerRef]);

  const animateHearts = () => {
    hearts.forEach(async ({heart, goalX, goalY, scale}) => {
      const tl = gsap.timeline();
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
  };

  useGSAP(() => {
    let slidePosition = {x: original_slide_position, y: '0px'};
    let fadeInPosition = {x: original_fade_in_position, y: {from: "0px", to: "0px"}};
    if ((window.innerWidth*window.devicePixelRatio) <= 768*window.devicePixelRatio) { // md breakpoint of tailwind
      slidePosition = {x: '0px', y: '-128px'};
      fadeInPosition = {x: {from: "0px", to: "0px"}, y: {from: "37px", to: "15px"}};
    };

    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      {y: "-100vh", opacity: 0},
      {y: 0, opacity: 1, duration: 1, ease: "power2.out"},
    )
      .to(logoRef.current, {y: -30, duration: 0.3, ease: "power2.inOut"})
      .call(() => animateHearts())
      .to(logoRef.current, {y: 0, duration: 0.3, ease: "bounce.out"})
      .to(logoRef.current, {x: slidePosition.x, y: slidePosition.y, duration: 0.8, delay: 1, ease: "power1.inOut"})
      .set(textContainerRef.current, { visibility: "visible" })
      .fromTo(
        textContainerRef.current,
        { opacity: 0, x: fadeInPosition.x.from, y: fadeInPosition.y.from },
        { opacity: 1, x: fadeInPosition.x.to,  y: fadeInPosition.y.to , duration: 0.8, ease: "power2.out" },
      )
      .to([introContainerRef.current, appContainerRef.current], {
        y: "-100vh",
        duration: 1.7,
        delay: 1,
        ease: "power2.inOut"
      }).call(() => {
        introContainerRef.current!.style.display = "none";
        introContainerRef.current!.remove();
        const app = appContainerRef.current!;
        app.style.transform = 'none';
        app.style.position = 'static';
        app.classList.remove('absolute');
        const container = document.getElementById('container');
        container?.classList.remove('relative', 'overflow-hidden');
      })
  }, { scope: introContainerRef });
  
  return (
    <>
    <div id='container' className='relative overflow-hidden h-full'>
      <div className='relative' id='intro-container' ref={introContainerRef}>
        <div
          ref={heartsContainerRef}
          className="absolute w-full h-full flex justify-center items-center overflow-hidden pointer-events-none"
          style={{willChange: 'transform, opacity, transform3d'}}
        ></div>
        <div className='h-screen flex justify-center place-items-center'>
          <img ref={logoRef} src='/assets/logo.png' alt='logo' className='w-64 h-64' />
          <div className='flex flex-col absolute' ref={textContainerRef} style={{visibility: 'hidden'}}>
            <h1 className='lg:text-5xl text-3xl font-bold text-slate-800 text-center'>
              Love Compatibility Test
            </h1>
            <p className="text-sm font-light text-slate-400 lg:my-0 my-1 lg:text-start text-center">Made by DONAT Development Team</p>
          </div>
        </div>  
      </div>
      <div id='app' ref={appContainerRef} className='h-auto absolute w-full'>
        <ToastProvider>
          <App />
        </ToastProvider>
      </div>
    </div>
    </>
  );
}

export default Splash;
