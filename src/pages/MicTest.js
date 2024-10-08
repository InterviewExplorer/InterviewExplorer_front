import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

const MicTest = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isMicConnected, setIsMicConnected] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorder = useRef(null);
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const dataArray = useRef(new Uint8Array(128));
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setIsMicConnected(true);
                mediaRecorder.current = new MediaRecorder(stream);

                audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
                analyser.current = audioContext.current.createAnalyser();
                const source = audioContext.current.createMediaStreamSource(stream);
                source.connect(analyser.current);

                analyser.current.fftSize = 256;

                mediaRecorder.current.ondataavailable = (event) => {
                    const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                    const audioURL = URL.createObjectURL(audioBlob);
                    setAudioUrl(audioURL);
                };

                // Clean up when the component unmounts
                return () => {
                    if (audioContext.current) {
                        audioContext.current.close();
                    }
                    if (mediaRecorder.current) {
                        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
                    }
                };
            })
            .catch(err => {
                console.error('Error accessing microphone:', err);
                setIsMicConnected(false);
            });
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            mediaRecorder.current.stop();
            cancelAnimationFrame(animationRef.current);
        } else {
            mediaRecorder.current.start();
            setAudioUrl(null);
            visualize();
        }
        setIsRecording(!isRecording);
    };

    const visualize = () => {
        if (!analyser.current) return;

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;

        const ripples = [];

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.current.getByteFrequencyData(dataArray.current);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            let average = dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;
            if (average > 10) { // Threshold to create a new ripple
                ripples.push({
                    radius: 30, // Initial radius
                    opacity: 1,
                    maxRadius: 150,
                });
            }

            // Draw ripples
            ripples.forEach((ripple, index) => {
                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, ripple.radius, 0, 2 * Math.PI);
                canvasCtx.strokeStyle = `rgba(126, 107, 252, ${ripple.opacity})`;
                canvasCtx.lineWidth = 2;
                canvasCtx.stroke();

                // Update ripple
                ripple.radius += 1 + (average / 20); // Slower increase
                ripple.opacity -= 0.03; // Slower fade

                // Remove faded ripples
                if (ripple.opacity <= 0 || ripple.radius > ripple.maxRadius) {
                    ripples.splice(index, 1);
                }
            });
        };

        draw();
    };

    // const micColor = isMicConnected ? (isRecording ? '#FFB6C1' : '#7e6bfc') : '#FF69B4';
    const micColor = isMicConnected ? (isRecording ? '#7e6bfc' : '#609ffe') : '#777';

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100" style={{display: 'flex', flexDirection: 'column'}}>
            <div className="relative w-64 h-64" style={{ margin: '0 auto' }}>
                <div className="absolute inset-0 flex items-center justify-center" style={{ width: '300px', height: '300px', display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={canvasRef} width={300} height={300} className="absolute top-0 left-0" style={{ position: 'absolute' }}/>
                    <button 
                        onClick={toggleRecording} 
                        disabled={!isMicConnected}
                        className={`w-16 h-16 rounded-full flex items-center justify-center focus:outline-none transition-colors duration-300`}
                        style={{ backgroundColor: micColor, border: micColor, borderRadius: '100%', width: '50%', height: '50%', position: 'relative', zIndex: '1', marginTop: '25%' }}
                    >
                        <Mic size={45} color="white" />
                    </button>
                </div>
            </div>
            <p className="hp_fs18" style={{color:micColor}}>
                {isMicConnected ? (isRecording ? '녹음 중...' : '마이크 아이콘을 클릭해주세요.') : '마이크가 연결되어 있지 않습니다.'}
            </p>
            <p className="hp_mt15 hp_fs24 hp_fw700" style={{color:micColor}}>
                {isMicConnected ? '마이크 연결: 성공' : '마이크 연결: 실패'}
            </p>
            {audioUrl && (
                <div className="hp_mt15">
                    <p className="hp_mb15 hp_alignL hp_7Color">녹음된 내용</p>
                    <audio controls src={audioUrl} className="w-full"></audio>
                </div>
            )}
        </div>
    );
};

export default MicTest;
