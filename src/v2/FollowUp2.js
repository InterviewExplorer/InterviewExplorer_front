import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowUp2({ job, years, answers, questions, handleQuestion, initialQuestionCount, handleInterviewerUpdate, type }) {
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
        
        const followingInterviewers = async (questionNum, generatedQuestion) => {
            const formData = new FormData();
            //키와 생성된 문제를 formdata 에 추가
            formData.append(questionNum, generatedQuestion);

            //꼬리질문에 대한 영상 생성
            const response = await fetch('http://localhost:8000/ai-presenter/', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('영상 생성에 실패했습니다.');
            }

            const data2 = await response.json();
            handleInterviewerUpdate(data2);
        };

        const generateFollowUpQuestions = async () => {
            let newQuestions = { ...questions };

            const answer6 = answers['A6'];
            const answer7 = answers['A7'];

            if (answer6 && !newQuestions['Q9']) {
                const generatedQuestion1 = await fetchQuestionForAnswer(answer6);
                if (generatedQuestion1) {
                    let questionNum = 'Q9';
                    newQuestions['Q9'] = generatedQuestion1;
                    await followingInterviewers(questionNum, generatedQuestion1);
                }
            }

            if (answer7 && !newQuestions['Q10']) {
                const generatedQuestion2 = await fetchQuestionForAnswer(answer7);
                if (generatedQuestion2) {
                    let questionNum = 'Q10';
                    newQuestions['Q10'] = generatedQuestion2;
                    await followingInterviewers(questionNum, generatedQuestion2);
                }
            }

            if (Object.keys(newQuestions).length > 0) {
                setQuestionState(newQuestions);
                handleQuestion(newQuestions);
                setHasGeneratedFollowUps(true); // Follow-up 질문 생성 후 상태 업데이트
            }
        };

        generateFollowUpQuestions();

    }, [answers, hasGeneratedFollowUps]);

    return null; // FollowUp 컴포넌트는 UI를 렌더링하지 않으므로 null 반환
}

export default FollowUp2;
