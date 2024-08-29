import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState(null);
    const handleAnswers = (newData) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            ...newData
        }));
    };
    console.log("answers", answers);
    console.log("questions", questions);

    const handleNextQuestion = () => {
        const questionKeys = Object.keys(questions);
        if (currentQuestionIndex < questionKeys.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            if (currentQuestionIndex + 1 === questionKeys.length - 1) {
                setIsLastQuestion(true);  // 마지막 질문임을 표시
            }
        }
    };

    const handleEndInterview = () => {
        // /report 페이지로 이동할 때 answers와 questions을 state로 전달
        navigate('/report', { state: { answers, questions } });
    };

    return (
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder handleAnswers={handleAnswers} />
                    
                    {isLastQuestion ? (
                        <button onClick={handleEndInterview}>면접 종료</button>
                    ) : (
                        <button onClick={handleNextQuestion}>다음 질문</button>
                    )}
                </div>
            )}
        </>
    );
}

export default Interview_technical;
