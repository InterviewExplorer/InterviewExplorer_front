import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder = ({ handleAnswers, questionIndex, onRecordingDone }) => {
    const [recording, setRecording] = useState(false);
    const [recordingDone, setRecordingDone] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const startButtonRef = useRef(null);
    const chunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                if (startButtonRef.current) {
                    startButtonRef.current.style.display = 'none';
                }
                
                const blob = new Blob(chunks.current, { type: 'video/webm' });
                chunks.current = [];

                const formData = new FormData();
                formData.append('file', blob, 'recorded_video.webm');

                setLoading(true);

                try {
                    const response = await fetch('http://localhost:8000/process_audio', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    setTranscript(result.transcript);
                    setRecordingDone(true);
                    
                    // 녹화가 완료된 후 FollowUp 컴포넌트에 콜백 호출
                    if (onRecordingDone) {
                        onRecordingDone();
                    }
                } catch (error) {
                    console.error('Error uploading video:', error);
                } finally {
                    setLoading(false);
                }
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setRecording(false);
        }
    };

    useEffect(() => {
        if (transcript) {
            const key = `A${questionIndex}`;
            handleAnswers({ [key]: transcript });
        }
    }, [transcript]);

    useEffect(() => {
        setRecordingDone(false);
        setTranscript('');
        if (startButtonRef.current) {
            startButtonRef.current.style.display = 'block';
        }
    }, [questionIndex]);

    return (
        <>
            {!recordingDone && (
                recording ? (
                    <button onClick={stopRecording}>녹화 종료</button>
                ) : (
                    <button ref={startButtonRef} onClick={startRecording}>녹화 시작</button>
                )
            )}
            <video ref={videoRef} autoPlay playsInline style={{ width: '640px', height: '480px', backgroundColor: 'black' }}></video>
            {loading && <p>답변 추출 중...</p>}
        </>
    );
};

export default VideoRecorder;
