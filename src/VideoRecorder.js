import React, { useState, useRef } from 'react';

const VideoRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState('');
    const [audioURL, setAudioURL] = useState(''); // 추가된 상태
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
                const videoURL = URL.createObjectURL(blob);
                setVideoURL(videoURL);

                // 다운로드 링크 생성
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = videoURL;
                a.download = 'recorded_video.webm'; // 파일 확장자에 맞춤
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(videoURL);

                // 비디오를 서버로 전송
                const formData = new FormData();
                formData.append('file', blob, 'recorded_video.webm');

                setLoading(true); // 로딩 시작

                try {
                    const response = await fetch('/extract-audio/', { // 실제 서버 URL로 업데이트 필요
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    setAudioURL(result.audio_file_path);
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
        <div>
            <h1>Video Recorder</h1>
            <video ref={videoRef} autoPlay playsInline></video>
            <div>
                {recording ? (
                    <button onClick={stopRecording}>Stop Recording</button>
                ) : (
                    <button onClick={startRecording}>Start Recording</button>
                )}
            </div>
            {loading && <p>Loading...</p>} {/* 로딩 상태 표시 */}
            {videoURL && (
                <div>
                    <h2>Recorded Video:</h2>
                    <video src={videoURL} controls></video>
                </div>
            )}
            {audioURL && (
                <div>
                    <h2>Extracted Audio:</h2>
                    <audio src={audioURL} controls></audio>
                </div>
            )}
        </div>
    );
};

export default VideoRecorder;
