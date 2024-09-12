import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer:initialInterviewer, feedback: initialFeedback = [] } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const [feedback, setFeedback] = useState(initialFeedback);
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;

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

    const handleFeedbackUpdate = (newFeedback) => {
        console.log("handleFeedbackUpdate 호출됨")
        console.log("Interview_technical.js - Received feedback: ", newFeedback);
        setFeedback(newFeedback);
    };

    console.log("questions", questions);
    console.log("answers", answers);
    console.log("feedback", feedback);

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
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false);
        }
    };

    const handleEndInterview = () => {
        if (!isAnswerComplete()) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }
        navigate('/report', { state: { answers, questions, job, years, feedback } });
    };

    const handleGenerateFollowUpQuestions = () => {
        setIsRecordingDone(true);
    };

    const handleNavigate = () => {
        navigate('/report', { state: { answers, questions, job, years } });
    }

    return (
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder 
                        handleAnswers={handleAnswers} 
                        questionIndex={currentQuestionIndex + 1}
                        onRecordingDone={handleGenerateFollowUpQuestions} // Pass the callback to VideoRecorder
                        onFeedbackUpdate={handleFeedbackUpdate} // 피드백 업데이트 콜백 전달
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
                <video src={interviewer[`Q${currentQuestionIndex + 1}`]} controls width="600">
                    Your browser does not support the video tag.
                </video>
            )}
        </>
    );
}

export default Interview_technical;
