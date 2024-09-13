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
    // 카운트 잠시 대기
    // const [faceTouchTotal, setFaceTouchTotal] = useState(0);
    // const [handMoveTotal, setHandMoveTotal] = useState(0);
    // const [notFrontTotal, setNotFrontTotal] = useState(0);

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
                    console.log("feedback(VideoRecorder.js - axios)", result.feedback)
                    // 카운트 잠시 대기
                    // console.log("face_touch_total", result.face_touch_total)
                    // console.log("hand_move_total", result.hand_move_total)
                    // console.log("not_front_total", result.not_front_total)
                    setTranscript(result.transcript);
                    setRecordingDone(true);
                    setFeedbackList(prevFeedback => [...prevFeedback, result.feedback]);
                    // 카운트 잠시 대기
                    // setFaceTouchTotal(prevTotal => prevTotal + result.face_touch_total);
                    // setHandMoveTotal(prevTotal => prevTotal + result.hand_move_total);
                    // setNotFrontTotal(prevTotal => prevTotal + result.not_front_total);

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
                // faceTouchTotal, 
                // handMoveTotal, 
                // notFrontTotal
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
