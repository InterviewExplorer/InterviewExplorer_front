import React, { useState, useEffect } from 'react';
import axios from 'axios'
import handleQuestions from "./GetInfo"


const Follow = ({job, years, answers, questions}) => {

    const [questionCount, setQuestionCount] = useState(0); // 질문 생성 카운트 추가
    const [fetchingQuestions, setFetchingQuestions] = useState(false); // 질문 생성 요청 상태 추적

    // answers -> 꼬리물기 질문으로 보내기
    useEffect(() => {
        const sendAnswer = async () => {
            try {
                // 두 번의 질문 생성만 허용
                if (questionCount < 2 && !fetchingQuestions) {

                    const answerValues = Object.values(answers);

                    // 답변 셔플 선택
                    // const randomAnswer = answerValues[Math.floor(Math.random() * answerValues.length)];
                    
                    const res = await axios.post('http://localhost:8000/generate_question/', {
                        job: job,
                        years: years,
                        answer: answerValues
                    });

                    // JSON 배열로 응답 받기
                    const newQuestionText = res.data;

                    if (newQuestionText.length > 0) {

                        // 기존 questions에서 마지막 키 값 찾기
                        const questionKeys = Object.keys(questions);
                        const lastKeyNumber = Math.max(...questionKeys.map(key => parseInt(key.substring(1), 10)));

                        // 기존 questions에서 마지막 키 값 찾기
                        const newQuestionKey = `Q${lastKeyNumber + 1}`;

                        // 기존 questions와 꼬리물기 질문 합치기
                        // const combinedQuestions = { ...questions, [newQuestionKey]: newQuestionText };
                        handleQuestions({ [newQuestionKey]: newQuestionText });

                        // 질문 생성 카운트 증가
                        setQuestionCount(prevCount => prevCount + 1);

                        console.log("서버 응답: " + JSON.stringify(res.data));

                        // setNewQuestions(combinedQuestions);

                    }

                    setFetchingQuestions(false);
                }
            } catch (error) {
                console.error('서버 요청 실패: ', error);
                setFetchingQuestions(false);
            }
        };
        if (Object.keys(answers).length > 0) {
            sendAnswer();
        }
    }, [answers]);

}

export default Follow;