import React, { useState, useEffect ,useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';
import axios from 'axios';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer:initialInterviewer } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;
    const videoRef1 = useRef(null);
    const videoRef2 = useRef(null);
    const [loopVideo, setLoopVideo] = useState(false);
    const [isFirstVideoPlaying, setIsFirstVideoPlaying] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const handleVideoEnd = () => {
        if (!loopVideo) {
          setIsFirstVideoPlaying(false);
          videoRef2.current.play();  // 두 번째 비디오 재생 시작
          
          setLoopVideo(true);  // 루프 활성화
        }
      };
    const tempVideos = { //나중에 지우기
        "Q1": '/1725418732914 (3).mp4',
        "Q2" :'/1725519494840 (2).mp4',
        "Q3" :'/1725523945340.mp4',
        "Q4" :'/1725523946926 (1).mp4',
        
      };
      const handleStartInterview = () => {
        setHasStarted(true);
        if (videoRef1.current) {
            videoRef1.current.muted = false; // Ensure sound is on
            videoRef1.current.play(); // Play the video
        }
    };  
    useEffect(() => {
        const questionKeys = Object.keys(questions);
        const isLastQuestionFlag = currentQuestionIndex >= questionKeys.length - 1;
        setIsLastQuestion(isLastQuestionFlag);
    }, [questions, currentQuestionIndex]);

    const handleQuestion = (newData) => {
        setQuestions(prevQuestions => ({
            ...prevQuestions,
            ...newData
        }));
    };
    const handleInterviewerUpdate = (newData) => {
        setInterviewer(prevInterviewer => ({
            ...prevInterviewer,
            ...newData
        }));
    };

    const handleAnswers = (newData) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            ...newData
        }));
        setIsRecordingDone(true);
    };

    console.log("questions", questions)
    console.log("answers", answers)
    console.log("interviewers",interviewer)

    // Define isAnswerComplete function
    const isAnswerComplete = () => {
        return answers[`A${currentQuestionIndex + 1}`] !== undefined;
    };

    const handleNextQuestion = () => {
        if (!isAnswerComplete()) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }

        const questionKeys = Object.keys(questions);
        if (currentQuestionIndex < questionKeys.length - 1) {
            setLoopVideo(false);
            setIsFirstVideoPlaying(true);
            
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false);
        }
    };

    const handleEndInterview = () => {
        if (!isAnswerComplete()) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }
        navigate('/report', { state: { answers, questions, job, years } });
    };

    const handleGenerateFollowUpQuestions = () => {
        setIsRecordingDone(true);
    };

    const handleNavigate = () => {
        navigate('/report', { state: { answers, questions, job, years } });
    }

    // const handleAxios = async () => {
    //     try {
    //         await axios.post("http://localhost:8000/get_consolidate_feedback", { feedback: true })
    //     } catch (error) {
    //         console.error("Error getting feedback", error)
    //     }
    // };

    return (
        <div>
            {!hasStarted ? (
                <button onClick={handleStartInterview}>시작</button>
            ) : (
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder 
                        handleAnswers={handleAnswers} 
                        questionIndex={currentQuestionIndex + 1}
                        onRecordingDone={handleGenerateFollowUpQuestions} // Pass the callback to VideoRecorder
                    />
                    <FollowUp 
                        job={job} 
                        years={years} 
                        answers={answers} 
                        questions={questions} 
                        handleQuestion={handleQuestion} 
                        initialQuestionCount={initialQuestionCount} 
                        handleInterviewerUpdate={handleInterviewerUpdate}
                    />
                    
                    {!isLastQuestion && isAnswerComplete() && (
                        <button onClick={handleNextQuestion}>
                            다음 질문
                        </button>
                    )}
                    {isLastQuestion && isAnswerComplete() && (
                        <button onClick={handleEndInterview}>
                            면접 종료
                        </button>
                    )}
                </div>
            )}
            {interviewer && (
                <video
                ref={videoRef1}
                src={tempVideos[`Q${currentQuestionIndex + 1}`]} //지금 interviewer의 url 이 모두 같으니까 같은 영상 취급, 재생 상태 유지.  일단 임시로 
                width="360"
                height="360"
                autoPlay
                controls

                loop={false}
                
                onEnded={handleVideoEnd}
                style={{
                    // display: isFirstVideoPlaying ? 'block' : 'none',
                  top: "650px",
                  left: 0,
                  pointerEvents: 'none',
                  opacity: isFirstVideoPlaying ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  position :'absolute'
                }}
              />
            )}
            {interviewer && (
                 <video
                 ref={videoRef2}
                 src="/1725502128342.mp4"
                 width="360"
                 height="360"
                 autoPlay={loopVideo}
                 muted
                 loop={loopVideo}
                 style={{
                    // display: isFirstVideoPlaying ? 'none' : 'block',
                   top: "650px",
                   left: 0,
                   pointerEvents: 'none',
                   opacity: isFirstVideoPlaying ? 0 : 1,
                   transition: 'opacity 0.3s ease-in-out',
                   position :'absolute'
                 }}
               />
            )}
        </>
            )}
        </div>
    );
}

export default Interview_technical;
