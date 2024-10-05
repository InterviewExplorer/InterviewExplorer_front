import React, { useEffect, useState } from 'react';

function FollowQuestions({ job, type, answers, handleQuestion, questions, onRagStateUpdate }) {
    const [hasAnswer, setHasAnswer] = useState(false);
    const [ragAnswer, setRagAnswer] = useState(false);
    const [ragState, setRagState] = useState("No");

    useEffect(() => {        
        if (answers['A7'] !== null && questions['Q9'] == null) { // 답변이 있는지 확인
            setHasAnswer(true);
        }
    }, [answers]);

    useEffect(() => {
        if (hasAnswer) {    // 답변이 있을 때만 새 질문 생성
            const fetchNewQuestion = async () => {
                try {
                    const answersString = Object.values(answers)
                        .filter(answer => answer !== null)
                        .join(' ');

                    const questionString = Object.values(questions)
                        .filter(question => question !== null)
                        .join(' ');

                    const response = await fetch('http://localhost:8000/follow_question', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            job: job,
                            type: type,
                            answers: answersString,
                            questions : questionString
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('서버 응답이 실패했습니다');
                    }

                    const data = await response.json();
                    const LastestQuestion = { Q9: data.Question };

                    handleQuestion(LastestQuestion);
                    
                } catch (error) {
                    console.error('새 질문 생성 중 오류 발생:', error);
                }
            };

            fetchNewQuestion();
            setHasAnswer(false);
        }
    }, [job, type, answers, hasAnswer]);

    useEffect(() => {        
        if (answers['A8'] !== null && questions['Q10'] == null) { // 답변이 있는지 확인
            setRagAnswer(true);
        }
    }, [answers]);

    useEffect(() => {
        if (ragAnswer) {    // 답변이 있을 때만 새 질문 생성
            const fetchNewQuestion = async () => {
                try {
                    const answersString = Object.values(answers)
                        .filter(answer => answer !== null)
                        .join(' ');

                    const questionString = Object.values(questions)
                        .filter(question => question !== null)
                        .join(' ');

                    const extractQ8Data = (data) => {
                        return Object.entries(data)
                            .filter(([key, value]) => key === 'Q8' && value !== null)
                            .reduce((acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            }, {});
                    };

                    const extractA8Data = (data) => {
                        return Object.entries(data)
                            .filter(([key, value]) => key === 'A8' && value !== null)
                            .reduce((acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            }, {});
                    };

                    const extractQ9Data = (data) => {
                        return Object.entries(data)
                            .filter(([key, value]) => key === 'Q9' && value !== null)
                            .reduce((acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            }, {});
                    };
                        
                    const answersRag = extractA8Data(answers);
                    const questionsRag = extractQ8Data(questions);
                    const followQuestion = extractQ9Data(questions);
                        
                    const response = await fetch('http://localhost:8000/follow_question', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            job: job,
                            type: type,
                            answers: answersString,
                            questions : questionString,
                            answersRag : answersRag,
                            questionsRag : questionsRag,
                            followQuestion : followQuestion
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('서버 응답이 실패했습니다');
                    }

                    const data = await response.json();
                    const LastestQuestion = { Q10: data.Question };

                    handleQuestion(LastestQuestion);

                    if (data.rag === "Yes") {
                        setRagState("Yes");
                        onRagStateUpdate("Yes");
                    } else {
                        setRagState("No");
                        onRagStateUpdate("No");
                    }
                    
                } catch (error) {
                    console.error('새 질문 생성 중 오류 발생:', error);
                }
            };

            fetchNewQuestion();
            setRagAnswer(false);
        }
    }, [job, type, answers, ragAnswer]);

    return null;
}

export default FollowQuestions;
