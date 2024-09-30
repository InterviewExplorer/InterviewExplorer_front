import React, { useState, useEffect,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from '../pages/VideoRecorder';
import FollowUp from "../v2/FollowUp2";
import LastestQuestions from "./LatestQuestions";

function Interview2() {
    const initialQuestions = {Q1: null,Q2: null,Q3: null,Q4: null,Q5: null,Q6: null,Q7: null,Q8: null,Q9: null,Q10: null};
    const [questions, setQuestions] = useState(initialQuestions);

    const initialAnswers = {A1: null,A2: null,A3: null,A4: null,A5: null,A6: null,A7: null,A8: null,A9: null,A10: null};
    const [answers, setAnswers] = useState(initialAnswers);

    const location = useLocation();
    const navigate = useNavigate();
    const { basicQuestions, job, years, videoOfInterviewer: initialInterviewer, type, resumeQuestions } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;
    const [feedback, setFeedback] = useState([]);
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
        "Q1": '/1725853616724.mp4',
        "Q2":'/1725850570091.mp4'
        
        
        
      };
      const handleStartInterview = () => {
        setHasStarted(true);
        if (videoRef1.current) {
            videoRef1.current.muted = false; // Ensure sound is on
            videoRef1.current.load(); // Play the video
        }
    };  
    useEffect(() => {
        if (basicQuestions) {
            setQuestions(prevQuestions => ({
                ...prevQuestions,
                ...resumeQuestions,
                ...basicQuestions,
            }));
        }
    }, [basicQuestions, resumeQuestions]);

    useEffect(() => {
        const questionKeys = Object.keys(questions);
        const isLastQuestionFlag = currentQuestionIndex >= questionKeys.length - 1;
        setIsLastQuestion(isLastQuestionFlag);

        // A10에 대한 답변이 완료되면 자동으로 handleEndInterview 실행
        if (answers.A10 !== null && answers.A10 !== undefined) {
            handleEndInterview();
        }
    }, [questions, currentQuestionIndex, answers]);

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
    
    const handleFeedbackUpdate = (feedbackList) => {
        setFeedback(feedbackList);
    };

    console.log("questions", questions)
    console.log("answers", answers)

    const isAnswerComplete = () => {
        return answers[`A${currentQuestionIndex + 1}`] !== undefined && answers[`A${currentQuestionIndex + 1}`] !== null;
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
            videoRef1.current.currentTime = 0; // 비디오의 시작 위치로 이동
            videoRef1.current.load(); // 비디오 재생
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false);
        }
    };

    const handleEndInterview = () => {
        navigate('/report', { state: { answers, questions, job, years, type, feedback } });
    };

    const handleGenerateFollowUpQuestions = () => {
        setIsRecordingDone(true);
    };

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            <div className='ly_maxWd'>
                {questions && (
                    <>
                        <div className='hp_mb100'>
                            <div className='el_box hp_mb50'>
                                <h3 className='hp_fs16 hp_mb15 hp_skyColor'>질문 {currentQuestionIndex + 1}</h3>
                                <p className='hp_fs18'>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                            </div>
                            <div className='ly_spaceBetween'>
                                {interviewer && (
                                    <div className='el_video'>
                                        <video src={interviewer[`Q${currentQuestionIndex + 1}`]}  ref={videoRef1} onEnded={handleVideoEnd} autoPlay={true}
                                        style={{
                                            display: isFirstVideoPlaying ? 'block' : 'none',
                                            }}>
                                            Your browser does not support the video tag.
                                        </video>
                                        <video src="/1726112869803.mp4"   autoPlay={true} muted ref={videoRef2} loop={true}
                                        style={{
                                            display: isFirstVideoPlaying ? 'none' : 'block'}}>
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )}
                                <div className='el_video hp_relative'>
                                    <VideoRecorder handleAnswers={handleAnswers} questionIndex={currentQuestionIndex + 1} onFeedbackUpdate={handleFeedbackUpdate} onRecordingDone={handleGenerateFollowUpQuestions} />
                                    {!isLastQuestion && isAnswerComplete() && (
                                        <button className='el_interviewBtn el_nextBtn el_btnM el_btnSkyBord' onClick={handleNextQuestion}>다음 질문</button>
                                    )}
                                    {/* {isLastQuestion && isAnswerComplete() && (
                                        <button className='el_interviewBtn el_btnM el_btnGradation' onClick={handleEndInterview}>면접 종료</button>
                                    )} */}
                                </div>
                            </div>
                        </div>
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
                        <LastestQuestions job={job} type={type} answers={answers} handleQuestion={handleQuestion} questions={questions} />
                    </>
                )}
            </div>
        </div>
    );
}

export default Interview2;
