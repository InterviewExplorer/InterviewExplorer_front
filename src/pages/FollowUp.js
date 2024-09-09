import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowUp({ job, years, answers, questions, handleQuestion, initialQuestionCount, handleInterviewerUpdate, type }) {
    const [questionState, setQuestionState] = useState(questions);
    const [hasGeneratedFollowUps, setHasGeneratedFollowUps] = useState(false); // 추가된 상태

    useEffect(() => {
        const fetchQuestionForAnswer = async (answer) => {
            try {
                const url = 'http://localhost:8000/follow_question';
                const userInfo = { job, years, answer, questions, type };
                const response = await axios.post(url, userInfo, {
                    headers: { 'Content-Type': 'application/json' }
                });
                return response.data.question;

            } catch (error) {
                console.error('Error fetching question:', error);
                return null;
            }
        };
        
        const followingInterviewers =async (questionNum, generatedQuestion) =>{
            const formData = new FormData();
            //키와 생성된 문제를 formdata 에 추가
            formData.append(questionNum,generatedQuestion);

            //꼬리질문에 대한 영상 생성
            const response = await fetch('http://localhost:8000/ai-presenter/',{
                method : 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('영상 생성에 실패했습니다.');
            }

            const data2 = await response.json();
            handleInterviewerUpdate(data2)
        }     
        const generateFollowUpQuestions = async () => {
            let newQuestions = { ...questions };

            const answer1 = answers['A1'];
            const answer2 = answers['A2'];
            const answer3 = answers['A3'];
            const answer4 = answers['A4'];

            if (initialQuestionCount === 2) {
                if (answer1 && !answer2) {
                    const generatedQuestion1 = await fetchQuestionForAnswer(answer1);
                    if (generatedQuestion1) {
                        let questionNum = 'Q3';
                        newQuestions['Q3'] = generatedQuestion1;
                        await followingInterviewers(questionNum,generatedQuestion1)
                    }
                }

                if (answer2 && !answer3) {
                    const generatedQuestion2 = await fetchQuestionForAnswer(answer2);
                    if (generatedQuestion2) {
                        let questionNum = 'Q4';
                        newQuestions['Q4'] = generatedQuestion2;
                        await followingInterviewers(questionNum,generatedQuestion2)
                    }
                }
            } else if (initialQuestionCount === 4) {
                // A1, A2 중 하나를 랜덤으로 선택
                const answerKeys1 = ['A1', 'A2'];
                const randomIndex1 = Math.floor(Math.random() * answerKeys1.length);
                const selectedAnswerKey1 = answerKeys1[randomIndex1];

                // A3, A4 중 하나를 랜덤으로 선택
                const answerKeys2 = ['A3', 'A4'];
                const randomIndex2 = Math.floor(Math.random() * answerKeys2.length);
                const selectedAnswerKey2 = answerKeys2[randomIndex2];

                const ranswer1 = answers[selectedAnswerKey1];
                const ranswer2 = answers[selectedAnswerKey2];

                if (answer1 && answer2 && !answer3) {
                    const generatedQuestion1 = await fetchQuestionForAnswer(ranswer1);
                    if (generatedQuestion1) {
                        let questionNum = 'Q5';
                        newQuestions['Q5'] = generatedQuestion1;
                        await followingInterviewers(questionNum,generatedQuestion1)
                    }
                }
                if (answer3 && answer4) {
                    const generatedQuestion2 = await fetchQuestionForAnswer(ranswer2);
                    if (generatedQuestion2) {
                        let questionNum = 'Q6';
                        newQuestions['Q6'] = generatedQuestion2;
                        await followingInterviewers(questionNum,generatedQuestion2)
                    }
                }
            }

            if (Object.keys(newQuestions).length > 0) {
                setQuestionState(newQuestions);
                handleQuestion(newQuestions);
                setHasGeneratedFollowUps(true); // Follow-up 질문 생성 후 상태 업데이트
            }
        };

        generateFollowUpQuestions()

    }, [answers, hasGeneratedFollowUps]);

    return null; // FollowUp 컴포넌트는 UI를 렌더링하지 않으므로 null 반환
}

export default FollowUp;
