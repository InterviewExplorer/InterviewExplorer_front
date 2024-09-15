import React from 'react';
import { PacmanLoader } from 'react-spinners'; // PacmanLoader import

function Loading() {
    return (
        <div className="loading-container">
            <PacmanLoader
                size={40} // 사이즈 조정
                color="#fff" // 색상 조정
            />
        </div>
    );
}

export default Loading;
