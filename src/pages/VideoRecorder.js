import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder = ({ handleAnswers, questionIndex }) => {
    const [recording, setRecording] = useState(false);
    const [recordingDone, setRecordingDone] = useState(false); // 녹화 완료 상태
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const startButtonRef = useRef(null); // 녹화 시작 버튼의 참조를 저장
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

                // 녹화 종료 후 녹화 시작 버튼을 숨김
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
                    setRecordingDone(true); // 녹화 완료 상태 설정
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
        // 새 질문이 로드될 때 녹화 시작 버튼을 다시 표시
        setRecordingDone(false);
        setTranscript('');
        if (startButtonRef.current) {
            startButtonRef.current.style.display = 'block';  // 새 질문이 로드되면 버튼 표시
        }
    }, [questionIndex]);

    return (
        <>
            {!recordingDone && (
                recording ? (
                    <button onClick={stopRecording}>녹화 종료</button>
                ) : (
                    <button ref={startButtonRef} onClick={startRecording}>녹화 시작</button> // 버튼 참조 추가
                )
            )}
            <video ref={videoRef} autoPlay playsInline style={{ width: '640px', height: '480px', backgroundColor: 'black' }}></video>
            {loading && <p>답변 추출 중...</p>}
        </>
    );
};

export default VideoRecorder;
