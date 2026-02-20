import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-brain">
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 10 C30 10 33 12 35 15 C36 14 38 13 40 14 C42 15 43 17 42 20 C44 21 45 23 45 25 C45 27 44 29 42 30 C43 32 42 35 40 36 C38 37 36 37 34 36 C34 38 32 39 30 40 C29 42 26 43 24 43 C21 43 19 42 18 40 C16 39 14 38 13 36 C12 37 9 37 8 36 C6 35 5 32 6 30 C4 29 3 27 3 25 C3 23 4 21 6 20 C5 17 6 15 8 14 C9 13 11 14 13 15 C14 12 17 10 21 10 C22 10 24 10 25 10 Z" 
                  fill="url(#brainGradient)" 
                  stroke="url(#brainGradient)" 
                  stroke-width="1"/>
            <defs>
              <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
