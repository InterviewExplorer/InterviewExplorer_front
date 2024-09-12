import React, { useState, useEffect,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';

function Interview() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer: initialInterviewer, type, feedback: initialFeedback = [] } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;
    const [feedback, setFeedback] = useState(initialFeedback);
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
        "Q1": '/1725850570091.mp4',
        "Q2":'/1725853616724.mp4'
        
        
      };
      const handleStartInterview = () => {
        setHasStarted(true);
        if (videoRef1.current) {
            videoRef1.current.muted = false; // Ensure sound is on
            videoRef1.current.play(); // Play the video
        }
    };  
    // const [faceTouchTotal, setFaceTouchTotal] = useState(0);
    // const [handMoveTotal, setHandMoveTotal] = useState(0);
    // const [notFrontTotal, setNotFrontTotal] = useState(0);

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
    
    // const handleFeedbackUpdate = (newFeedback, faceTouchTotal, handMoveTotal, notFrontTotal) => {
    const handleFeedbackUpdate = (feedbackList) => {
        setFeedback(feedbackList);
        // 카운트 잠시 대기
        // setFaceTouchTotal(faceTouchTotal);
        // setHandMoveTotal(handMoveTotal);
        // setNotFrontTotal(notFrontTotal);
    };

    console.log("questions", questions)
    console.log("answers", answers)
    console.log("feedback", feedback);
    // 카운트 잠시 대기
    // console.log("faceTouchTotal", faceTouchTotal);
    // console.log("handMoveTotal", handMoveTotal);
    // console.log("notFrontTotal", notFrontTotal);

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
        // navigate('/report', { state: { answers, questions, job, years, type, feedback, faceTouchTotal, handMoveTotal, notFrontTotal } });
        navigate('/report', { state: { answers, questions, job, years, type, feedback } });
    };

    const handleGenerateFollowUpQuestions = () => {
        setIsRecordingDone(true);
    };

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
		onFeedbackUpdate={handleFeedbackUpdate}
                    />
                    <FollowUp 
                        job={job} 
                        years={years} 
                        answers={answers} 
                        questions={questions} 
                        handleQuestion={handleQuestion} 
                        initialQuestionCount={initialQuestionCount} 
                        handleInterviewerUpdate={handleInterviewerUpdate}
		type={type}
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
                src={interviewer[`Q${currentQuestionIndex + 1}`]} //지금 interviewer의 url 이 모두 같으니까 같은 영상 취급, 재생 상태 유지.  일단 임시로 
                width="360"
                height="360"
                autoPlay
                

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
                 src="/1726112869803.mp4"
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

export default Interview;
