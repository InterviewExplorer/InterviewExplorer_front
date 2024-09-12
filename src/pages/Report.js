import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

function Report() {
    const location = useLocation();
    // const { answers = {}, questions = {}, job, years, type, feedback = [], faceTouchTotal = 0, handMoveTotal = 0, notFrontTotal = 0 } = location.state || {};
    const { answers = {}, questions = {}, job, years, type, feedback = [] } = location.state || {};
    const [evaluations, setEvaluations] = useState({});
    const [loading, setLoading] = useState(true);
    const [explains, setExplains] = useState([]);
    const [summary, setSummary] = useState({});
    const [speakingEvaluation, setSpeakingEvaluation] = useState("");
    const componentRef = useRef(); // PDF로 변환할 컴포넌트를 참조하는 ref
    const [consolidatedFeedback, setConsolidatedFeedback] = useState("");

    const evaluateAnswer = async (question, answer) => {
        try {
            const response = await fetch('http://localhost:8000/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, answer, years, job, type }),
            });

            if (!response.ok) {
                throw new Error('평가 요청에 실패했습니다.');
            }

            const data = await response.json();
            return data.evaluation;
        } catch (error) {
            console.error('에러 발생:', error);
            return { 평가: "평가를 불러오는 데 실패했습니다." };
        }
    };

    const evaluateSpeaking = async (answers) => {
        try {
            const response = await fetch('http://localhost:8000/speaking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers }),
            });
    
            if (!response.ok) {
                throw new Error('발화 평가 요청에 실패했습니다.');
            }
    
            const data = await response.json();
    
            // JSON 응답의 구조를 확인하고 적절한 값을 반환
            if (data && typeof data === 'object' && data.speaking) {
                return data.speaking;
            } else {
                return "발화 평가 정보를 불러오는 데 실패했습니다.";
            }
        } catch (error) {
            console.error('발화 평가 에러 발생:', error);
            return "발화 평가 정보를 불러오는 데 실패했습니다.";
        }
    };

    const handleFeedback = async (feedback) => {
        let consolidated_feedback;
        
        try {
            const res = await axios.post("http://localhost:8000/get_consolidate_feedback", { feedback })
            if (res.status === 200 || res.status === 201) {
                consolidated_feedback = res.data.consolidated_feedback
                return consolidated_feedback
            } else {
                throw new Error("Failed to get feedback")
            }
        } catch (e) {
            console.error("Error getting feedback", e)
        }
    }

    useEffect(() => {
        const fetchFeedback = async () => {
            const consolidated_feedback = await handleFeedback(feedback);
            setConsolidatedFeedback(consolidated_feedback);
        }

        fetchFeedback();
    }, [])

    useEffect(() => {
        const fetchEvaluations = async () => {
            const evaluations = {};
            const explanations = [];

            for (let i = 0; i < Object.keys(questions).length; i++) {
                const questionKey = `Q${i + 1}`;
                const answerKey = `A${i + 1}`;

                const question = questions ? questions[questionKey] : null;
                const answer = answers ? answers[answerKey] : null;

                if (question && answer) {
                    const evaluation = await evaluateAnswer(question, answer);
                    evaluations[questionKey] = evaluation;

                    if (evaluation.설명) {
                        explanations.push(evaluation.설명);
                    }
                }
            }

            setEvaluations(evaluations);
            setExplains(explanations);

            try {
                const response = await fetch('http://localhost:8000/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ evaluations: evaluations, type }),
                });

                if (!response.ok) {
                    throw new Error('요약 요청에 실패했습니다.');
                }

                const data = await response.json();
                
                // data가 문자열 타입인 경우
                if (typeof data === 'string') {
                    // {""} 제거하고 문자열만 추출
                    const cleanedData = data.replace(/^\{\s*"*([^"]*)"*"\s*\}$/, '$1');
                    setSummary(cleanedData);
                } else {
                    setSummary('');
                }

            } catch (error) {
                console.error('요약 에러 발생:', error);
            }

            // 평가 후 발화 평가 요청
            const speakingResult = await evaluateSpeaking(answers);
            setSpeakingEvaluation(speakingResult);

            setLoading(false);
        };

        fetchEvaluations();
    }, [questions, answers, years, job]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const questionKeys = questions ? Object.keys(questions) : [];

    if (loading) {
        return <div>면접 결과 분석 중...</div>;
    }

    const feedbackArray = feedback.feedbackList.flat();
    const uniqueFeedback = Array.from(new Set(feedbackArray));

    return (
        <div>
            <div ref={componentRef}>
                <h1>면접 결과</h1>
                <h3>{years}년차, {job}로써 면접에 응시한 결과입니다.</h3>

                {summary && (
                    <div>
                        <h2>종합 평가</h2>
                        <p>{summary}</p>
                    </div>
                )}

                ========================================================

                <h2>언어습관 및 말투 평가</h2>
                <p>{speakingEvaluation}</p>

                ========================================================

                <h3>피드백 목록</h3>
                <ul>
                    {uniqueFeedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                    ))}
                </ul>

                <h2>자세 피드백</h2>
                <p>{consolidatedFeedback}</p>
                {/* <h3>행동 감지</h3>
                <p>얼굴 터치: {faceTouchTotal}</p>
                <p>손 움직임: {handMoveTotal}</p>
                <p>자세 불량: {notFrontTotal}</p> */}

                ========================================================

                {questionKeys.length > 0 && (
                    <>
                        {questionKeys.map((key, index) => {
                            const answerKey = `A${index + 1}`;
                            const evaluation = evaluations[key] || {};
                            return (
                                <div key={key}>
                                    <p><strong>질문:</strong> {questions[key]}</p>
                                    <p><strong>답변:</strong> {answers[answerKey]}</p>
                                    <p><strong>평가:</strong> {evaluation.score !== undefined ? evaluation.score : "점수를 불러오는 데 실패했습니다."}점</p>
                                    <p><strong>설명:</strong> {evaluation.explanation || "설명 정보가 없습니다."}</p>
                                    {type === "technical" && (
                                        <p><strong>모범답안:</strong> {evaluation.model || "모범답안 정보가 없습니다."}</p>
                                    )}
                                    {type === "behavioral" && (
                                        <p><strong>질문의 의도:</strong> {evaluation.intention || "질문의 의도 정보가 없습니다."}</p>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            <button onClick={handlePrint}>PDF로 저장</button>
        </div>
    );
}

export default Report;
