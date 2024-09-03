import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowUp({ job, years, answers, questions, handleQuestion, initialQuestionCount, shouldGenerate }) {
    const [questionState, setQuestionState] = useState(questions);

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

                const questionKeys = Object.keys(questions);
                const randomIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 4);

                // 랜덤으로 하나씩 선택하여 꼬리 질문 생성
                const randomQ1 = randomIndices[0];
                const randomQ2 = randomIndices[1];
                const randomQ3 = randomIndices[2];
                const randomQ4 = randomIndices[3];

                const answer1Key = `A${randomQ1 + 1}`;
                const answer2Key = `A${randomQ2 + 1}`;
                const answer3Key = `A${randomQ3 + 1}`;
                const answer4Key = `A${randomQ4 + 1}`;

                const answer1 = answers[answer1Key];
                const answer2 = answers[answer2Key];
                const answer3 = answers[answer3Key];
                const answer4 = answers[answer4Key];

                if (answer1) {
                    const generatedQuestion1 = await fetchQuestionForAnswer(answer1);
                    if (generatedQuestion1) {
                        newQuestions[`Q${Object.keys(newQuestions).length + 1}`] = generatedQuestion1;
                    }
                }
                if (answer2) {
                    const generatedQuestion2 = await fetchQuestionForAnswer(answer2);
                    if (generatedQuestion2) {
                        newQuestions[`Q${Object.keys(newQuestions).length + 1}`] = generatedQuestion2;
                    }
                }
                if (answer3) {
                    const generatedQuestion3 = await fetchQuestionForAnswer(answer3);
                    if (generatedQuestion3) {
                        newQuestions[`Q${Object.keys(newQuestions).length + 1}`] = generatedQuestion3;
                    }
                }
                if (answer4) {
                    const generatedQuestion4 = await fetchQuestionForAnswer(answer4);
                    if (generatedQuestion4) {
                        newQuestions[`Q${Object.keys(newQuestions).length + 1}`] = generatedQuestion4;
                    }
                }
            }

            if (Object.keys(newQuestions).length > 0) {
                setQuestionState(newQuestions);
                handleQuestion(newQuestions);
            }
        };

        if (shouldGenerate) {
            generateFollowUpQuestions();
        }
    }, [answers, initialQuestionCount, questions, handleQuestion, shouldGenerate]);

    return null; // FollowUp 컴포넌트는 UI를 렌더링하지 않으므로 null 반환
}

export default FollowUp;
