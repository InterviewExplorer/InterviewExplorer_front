import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';

function Interview() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer: initialInterviewer, type } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;
    const [feedback, setFeedback] = useState([]);

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
    
    const handleFeedbackUpdate = (feedbackList) => {
        setFeedback(feedbackList);
        console.log("인터뷰 핸들러 감지 확인", feedbackList)
    };

    console.log("questions", questions)
    console.log("answers", answers)

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
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false);
        }
    };

    const handleEndInterview = () => {
        if (!isAnswerComplete()) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }
        navigate('/report', { state: { answers, questions, job, years, type, feedback } });
    };

    const handleGenerateFollowUpQuestions = () => {
        setIsRecordingDone(true);
    };

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            {questions && (
                <>
                    <div className='hp_mb100'>
                        <div className='el_box hp_mb50'>
                            <h3 className='hp_fs16 hp_mb15 hp_skyColor'>질문 {currentQuestionIndex + 1}</h3>
                            <p className='hp_fs18'>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                        </div>
                        <div className='ly_flex'>
                            {interviewer && (
                                <div className=''>
                                    <video src={interviewer[`Q${currentQuestionIndex + 1}`]} controls style={{ width: '640px', height: '480px', backgroundColor: 'black' }}>
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            <div className='hp_ml30 hp_relative'>
                                <VideoRecorder handleAnswers={handleAnswers} questionIndex={currentQuestionIndex + 1} onFeedbackUpdate={handleFeedbackUpdate} onRecordingDone={handleGenerateFollowUpQuestions} />
                                {!isLastQuestion && isAnswerComplete() && (
                                    <button className='el_interviewBtn el_nextBtn el_btnM el_btnSkyBord' onClick={handleNextQuestion}>다음 질문</button>
                                )}
                                {isLastQuestion && isAnswerComplete() && (
                                    <button className='el_interviewBtn el_btnM el_btnGradation' onClick={handleEndInterview}>면접 종료</button>
                                )}
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
                </>
            )}
        </div>
    );
}

export default Interview;
