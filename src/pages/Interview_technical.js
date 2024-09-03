import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoRecorder from './VideoRecorder';
import FollowUp from './FollowUp';

function Interview_technical() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions: initialQuestions, job, years, interviewer:initialInterviewer } = location.state || {};
    const [questions, setQuestions] = useState(initialQuestions || {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [answers, setAnswers] = useState({});
    const [isRecordingDone, setIsRecordingDone] = useState(false);
    const [shouldGenerateFollowUp, setShouldGenerateFollowUp] = useState(false);
    const [interviewer, setInterviewer] = useState(initialInterviewer || {});

    // 질문의 개수를 계산
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

    console.log("questions", questions);
    console.log("answers", answers);
    console.log("interviewer",interviewer);

    const handleNextQuestion = () => {
        if (!isRecordingDone) {
            alert('현재 질문에 대한 답변을 먼저 완료해주세요.');
            return;
        }

        const questionKeys = Object.keys(questions);
        if (currentQuestionIndex < questionKeys.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsRecordingDone(false);
            setShouldGenerateFollowUp(true); // 다음 질문 클릭 시 꼬리 질문 생성 요청
        }
    };

    const handleEndInterview = () => {
        navigate('/report', { state: { answers, questions, job, years } });
    };

    return (
        <>
            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}</h3>
                    <p>{questions[`Q${currentQuestionIndex + 1}`]}</p>
                    <VideoRecorder 
                        handleAnswers={handleAnswers} 
                        questionIndex={currentQuestionIndex + 1} // 현재 질문 번호 전달
                    />
                    <FollowUp 
                        job={job} 
                        years={years} 
                        answers={answers} 
                        questions={questions} 
                        handleQuestion={handleQuestion} 
                        handleInterviewerUpdate={handleInterviewerUpdate}
                        initialQuestionCount={initialQuestionCount} // 질문 개수 전달
                        shouldGenerate={shouldGenerateFollowUp} // 꼬리 질문 생성 플래그 전달
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
