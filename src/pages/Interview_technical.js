import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import Follow from './Follow';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, job, years, handleQuestions, interviewer } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false); // 추가된 상태

    const handleAnswers = (newData) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            ...newData
        }));
        setIsRecordingDone(true); // 답변이 업데이트되면 recording이 완료된 것으로 간주
    };

    console.log("questions",questions)
    console.log("answers",answers)
    console.log("interviewer", interviewer)

    const handleNextQuestion = () => {
        if (!isRecordingDone) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }

        const questionKeys = Object.keys(questions);
        if (currentQuestionIndex < questionKeys.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false); // 다음 질문으로 넘어가면 recording 완료 상태 초기화
            if (currentQuestionIndex + 1 === questionKeys.length - 1) {
                setIsLastQuestion(true);  // 마지막 질문임을 표시
            }
        }
    };

    const handleEndInterview = () => {
        // /report 페이지로 이동할 때 answers와 questions을 state로 전달
        navigate('/report', { state: { answers, questions, job, years } });
    };

    return (
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder handleAnswers={handleAnswers} />
                    <Follow job = {job} years = {years} answers = {answers} questions = {questions} handleQuestions = {handleQuestions}/>
                    
                    {isLastQuestion ? (
                        <button onClick={handleEndInterview}>면접 종료</button>
                    ) : (
                        <button 
                            onClick={handleNextQuestion} 
                            disabled={!isRecordingDone} // 텍스트 추출이 완료되면 버튼 활성화
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
