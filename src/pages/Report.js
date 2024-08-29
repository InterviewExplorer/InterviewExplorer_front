import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Report() {
    const location = useLocation();
    const { answers = {}, questions = {}, job, years } = location.state || {};

    const [evaluations, setEvaluations] = useState({});

    const evaluateAnswer = async (question, answer) => {
        try {
            const response = await fetch('http://localhost:8000/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, answer, years, job }),
            });

            if (!response.ok) {
                throw new Error('평가 요청에 실패했습니다.');
            }

            const data = await response.json();
            return data.evaluation;
        } catch (error) {
            console.error('에러 발생:', error);
            return "평가를 불러오는 데 실패했습니다.";
        }
    };

    useEffect(() => {
        const fetchEvaluations = async () => {
            const evaluations = {};
            for (let i = 0; i < Object.keys(questions).length; i++) {
                const questionKey = `Q${i + 1}`;
                const answerKey = `A${i + 1}`;

                const question = questions ? questions[questionKey] : null;
                const answer = answers ? answers[answerKey] : null;
                
                if (question && answer) {
                    evaluations[questionKey] = await evaluateAnswer(question, answer);
                }
            }
            setEvaluations(evaluations);
        };

        fetchEvaluations();
    }, [questions, answers, years, job]);

    const questionKeys = questions ? Object.keys(questions) : [];
    const answerKeys = answers ? Object.keys(answers) : [];

    console.log(evaluations)

    return (
        <div>
            <h1>면접 결과</h1>
            <h3>{years}년차, {job}로써 면접에 응시한 결과입니다.</h3>

            {questionKeys.length > 0 && (
                <>
                    {questionKeys.map((key, index) => {
                        const answerKey = `A${index + 1}`;
                        const evaluation = evaluations[key] || {};
                        return (
                            <div key={key}>
                                <p><strong>질문:</strong> {questions[key]}</p>
                                <p><strong>답변:</strong> {answers[answerKey]}</p>
                                <p><strong>평가:</strong> {evaluation.평가 || "평가를 불러오는 데 실패했습니다."}</p>
                                <p><strong>설명:</strong> {evaluation.설명 || "설명 정보가 없습니다."}</p>
                                <p><strong>모범답안:</strong> {evaluation.모범답안 || "모범답안 정보가 없습니다."}</p>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}

export default Report;
