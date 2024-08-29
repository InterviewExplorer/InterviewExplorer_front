import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder = ({ handleAnswers }) => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState(''); // 텍스트 추출 결과 상태
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const chunks = useRef([]);
    const indexRef = useRef(1); // 순서 번호를 저장하기 위한 useRef

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

    useEffect(() => {
        if (transcript) {
            // 현재 순서 번호를 기반으로 키를 생성
            const currentIndex = indexRef.current;
            const key = `A${currentIndex}`;

            // `handleAnswers`를 호출하여 `transcript` 값을 추가
            handleAnswers({ [key]: transcript });

            // 순서 번호 증가
            indexRef.current += 1;
        }
    }, [transcript]);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline style={{width:'640px',height:'480px',backgroundColor:'black'}}></video>
            <div>
                {recording ? (
                    <button onClick={stopRecording}>녹화 종료</button>
                ) : (
                    <button onClick={startRecording}>녹화 시작</button>
                )}
            </div>
            {loading && <p>답변 추출 중...</p>}
        </>
    );
};

export default VideoRecorder;
