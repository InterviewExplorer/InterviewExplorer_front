import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Follow = () => {

    const location = useLocation();
    const { questions } = location.state || {};
    const [isLastQuestion, setIsLastQuestion ] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const navigate = useNavigate();
    const [answers, setAnswers] = useState(null);

    console.log("questions(질문)", questions);

    if (!questions) {
        console.error("질문 데이터가 없습니다.");  // 질문 데이터가 없는 경우 에러 출력
        return <div>질문 데이터를 불러올 수 없습니다.</div>;
    }

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
                    <p>{questions[`Q${currentQuestionIndex + 3}`]}</p>
                    {isLastQuestion ? (
                        <button onClick={handleEndInterview}>면접 종료</button>
                    ) : (
                        <button onClick={handleNextQuestion}>다음 질문</button>
                    )}
                </div>
            )}
        </>
    )
}

export default Follow;