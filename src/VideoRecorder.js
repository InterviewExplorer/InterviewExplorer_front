import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState(''); // 텍스트 추출 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
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
                const blob = new Blob(chunks.current, { type: 'video/webm' });
                chunks.current = [];
                
                // 비디오를 서버로 전송
                const formData = new FormData();
                formData.append('file', blob, 'recorded_video.webm');

                setLoading(true); // 로딩 시작

                try {
                    const response = await fetch('http://localhost:8000/process_audio', { // 실제 서버 URL로 업데이트 필요
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    setTranscript(result.transcript); // 서버에서 받은 텍스트 설정
                } catch (error) {
                    console.error('Error uploading video:', error);
                } finally {
                    setLoading(false); // 로딩 종료
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

    return (
        <>
            <h1>Video Recorder</h1>
            <video ref={videoRef} autoPlay playsInline></video>
            <div>
                {recording ? (
                    <button onClick={stopRecording}>녹화 종료</button>
                ) : (
                    <button onClick={startRecording}>녹화 시작</button>
                )}
            </div>
            {loading && <p>Loading...</p>} {/* 로딩 상태 표시 */}
            {transcript && (
                <div>{transcript}</div>
            )}
        </>
    );
};

export default VideoRecorder;
