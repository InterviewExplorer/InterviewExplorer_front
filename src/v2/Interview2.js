import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from '../pages/VideoRecorder';
import FollowUp from "../v2/FollowUp2";

function Interview2() {
    const initialQuestions = {Q1: null,Q2: null,Q3: null,Q4: null,Q5: null,Q6: null,Q7: null,Q8: null,Q9: null,Q10: null};
    const [questions, setQuestions] = useState(initialQuestions);

    const initialAnswers = {A1: null,A2: null,A3: null,A4: null,A5: null,A6: null,A7: null,A8: null,A9: null,A10: null};
    const [answers, setAnswers] = useState(initialAnswers);

    const location = useLocation();
    const navigate = useNavigate();
    const { questions: basicQuestions, job, years, interviewer: initialInterviewer, type } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});
    const initialQuestionCount = Object.keys(initialQuestions || {}).length;
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        if (basicQuestions) {
            setQuestions(prevQuestions => ({
                ...prevQuestions,
                ...basicQuestions
            }));
        }
    }, [basicQuestions]);

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
                <video src={interviewer[`Q${currentQuestionIndex + 1}`]} controls width="600">
                    Your browser does not support the video tag.
                </video>
            )}
        </>
    );
}

export default Interview2;
