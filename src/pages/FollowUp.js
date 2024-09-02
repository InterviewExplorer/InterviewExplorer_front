import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowUp({ job, years, answers, questions, handleQuestion, initialQuestionCount }) {
    const [questionState, setQuestionState] = useState(questions);
    const [hasGeneratedFollowUps, setHasGeneratedFollowUps] = useState(false); // 추가된 상태

    useEffect(() => {
        const fetchQuestionForAnswer = async (answer) => {
            try {
                const url = 'http://localhost:8000/generate_question';
                const userInfo = { job, years, answer };
                const response = await axios.post(url, userInfo, {
                    headers: { 'Content-Type': 'application/json' }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching question:', error);
                return null;
            }
        };

        const generateFollowUpQuestions = async () => {
            let newQuestions = { ...questions };

            if (initialQuestionCount === 2) {
                console.log("initialQuestionCount 2 실행중");

                const answer1 = answers['A1'];
                const answer2 = answers['A2'];

                if (answer1) {
                    const generatedQuestion1 = await fetchQuestionForAnswer(answer1);
                    if (generatedQuestion1) {
                        newQuestions['Q3'] = generatedQuestion1;
                    }
                }

                if (answer2) {
                    const generatedQuestion2 = await fetchQuestionForAnswer(answer2);
                    if (generatedQuestion2) {
                        newQuestions['Q4'] = generatedQuestion2;
                    }
                }
            } else if (initialQuestionCount === 4) {
                console.log("initialQuestionCount 4 실행중");

                // A1, A2 중 하나를 랜덤으로 선택
                const answerKeys1 = ['A1', 'A2'];
                const randomIndex1 = Math.floor(Math.random() * answerKeys1.length);
                const selectedAnswerKey1 = answerKeys1[randomIndex1];

                // A3, A4 중 하나를 랜덤으로 선택
                const answerKeys2 = ['A3', 'A4'];
                const randomIndex2 = Math.floor(Math.random() * answerKeys2.length);
                const selectedAnswerKey2 = answerKeys2[randomIndex2];

                const answer1 = answers[selectedAnswerKey1];
                const answer2 = answers[selectedAnswerKey2];

                if (answer1) {
                    const generatedQuestion1 = await fetchQuestionForAnswer(answer1);
                    if (generatedQuestion1) {
                        newQuestions['Q5'] = generatedQuestion1;
                    }
                }
                if (answer2) {
                    const generatedQuestion2 = await fetchQuestionForAnswer(answer2);
                    if (generatedQuestion2) {
                        newQuestions['Q6'] = generatedQuestion2;
                    }
                }
            }

            if (Object.keys(newQuestions).length > 0) {
                setQuestionState(newQuestions);
                handleQuestion(newQuestions);
                setHasGeneratedFollowUps(true); // Follow-up 질문 생성 후 상태 업데이트
            }
        };

        // 조건을 만족하고 아직 Follow-up 질문이 생성되지 않았을 때만 generateFollowUpQuestions 호출
        if (!hasGeneratedFollowUps) {
            if (initialQuestionCount === 2 && answers['A1'] && answers['A2']) {
                generateFollowUpQuestions();
            } else if (initialQuestionCount === 4 && answers['A1'] && answers['A2'] && answers['A3'] && answers['A4']) {
                generateFollowUpQuestions();
            }
        }

    }, [answers, hasGeneratedFollowUps, initialQuestionCount, questions, handleQuestion]);

    return null; // FollowUp 컴포넌트는 UI를 렌더링하지 않으므로 null 반환
}

export default FollowUp;
