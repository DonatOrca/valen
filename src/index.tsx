import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles//index.css';
import Splash from './Splash';
import reportWebVitals from './reportWebVitals';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


gsap.registerPlugin(useGSAP);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <Splash />
    </React.StrictMode>
  ) : <Splash />
);

reportWebVitals(console.log);
