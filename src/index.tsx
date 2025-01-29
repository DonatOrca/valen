import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles//index.css';
import App from './App';
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
      <App />
    </React.StrictMode>
  ) : <App />
);

reportWebVitals(console.log);
