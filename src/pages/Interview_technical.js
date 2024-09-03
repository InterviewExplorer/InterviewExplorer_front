import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';
import axios from 'axios';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);

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
    
    console.log("questions", questions)
    console.log("answers", answers)

    const handleAnswers = (newData) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            ...newData
        }));
        setIsRecordingDone(true);
    };

    const handleNextQuestion = () => {
        if (!isRecordingDone) {
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
        handleNavigate()
        // handleAxios()
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
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder handleAnswers={handleAnswers} />
                    <FollowUp 
                        job={job} 
                        years={years} 
                        answers={answers} 
                        questions={questions} 
                        handleQuestion={handleQuestion} 
                    />
                    
                    {isLastQuestion ? (
                        <button onClick={handleEndInterview}>면접 종료</button>
                    ) : (
                        <button 
                            onClick={handleNextQuestion} 
                            disabled={!isRecordingDone}
                        >
                            다음 질문
                        </button>
                    )}
                </div>
            )}
            {interviewer && (
                <div>
                    <video src={interviewer[`Q${currentQuestionIndex + 1}`]} controls width="600">
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </>
    );
}

export default Interview_technical;
