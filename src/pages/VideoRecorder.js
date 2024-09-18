import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder = ({ handleAnswers, questionIndex, onRecordingDone, onFeedbackUpdate }) => {
    const [recording, setRecording] = useState(false);
    const [recordingDone, setRecordingDone] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const startButtonRef = useRef(null);
    const chunks = useRef([]);
    const [feedbackList, setFeedbackList] = useState([]);

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
                    setFeedbackList(prevFeedback => [...prevFeedback, result.feedback]);

                    // 녹화가 완료된 후 FollowUp 컴포넌트에 콜백 호출
                    if (onRecordingDone) {
                        onRecordingDone();
                    }
                } catch (error) {
                    console.error('Error uploading video:', error);

                    // 오류 발생 시 녹화 시작 버튼을 다시 표시
                    if (startButtonRef.current) {
                        startButtonRef.current.style.display = 'block';
                    }
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
        if (feedbackList.length > 0 && onFeedbackUpdate) {
            console.log("useEffect 실행확인: ", feedbackList)
            onFeedbackUpdate({
                feedbackList
            });
        }
    }, [feedbackList]);

    useEffect(() => {
        setRecordingDone(false);
        setTranscript('');
        if (startButtonRef.current) {
            startButtonRef.current.style.display = 'block';
        }
    }, [questionIndex]);

    return (
        <>
            <video ref={videoRef} autoPlay playsInline></video>
            {!recordingDone && (
                recording ? (
                    <button className='el_interviewBtn el_camBtn el_camBtn__off el_btnM hp_fw700' onClick={stopRecording}>녹화 종료</button>
                ) : (
                    <button className='el_interviewBtn el_camBtn el_camBtn__on el_btnM hp_fw700' ref={startButtonRef} onClick={startRecording}>녹화 시작</button>
                )
            )}
            {loading && <p className='el_loadTxt hp_fs20'>답변 추출 중...</p>}
        </>
    );
};

export default VideoRecorder;
