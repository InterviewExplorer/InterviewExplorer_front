import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FollowUp({ job, years, answers, questions, handleQuestion,handleInterviewerUpdate }) {
    const [requested, setRequested] = useState({
        A1: false,
        A2: false,
    });

    useEffect(() => {
        const fetchQuestionForAnswer = async (answer, keyPrefix) => {
            try {
                // 서버에 POST 요청을 보낼 URL
                const url = 'http://localhost:8000/generate_question';

                // 서버에 보낼 데이터
                const userInfo = {
                    job,
                    years,
                    answer // 개별 답변을 서버에 보냄
                };

                // 서버에 POST 요청 보내기
                const response = await axios.post(url, userInfo, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // 결과를 콘솔에 출력
                console.log(`Generated Question for ${keyPrefix}:`, response.data);

                // 서버로부터 받은 질문
                const generatedQuestion = response.data;

                // 현재 questions의 마지막 키를 가져와서 새로운 키 생성
                const questionKeys = Object.keys(questions);
                const lastKey = questionKeys[questionKeys.length - 1];
                const lastKeyNumber = lastKey ? parseInt(lastKey.replace('Q', ''), 10) : 0;
                const newKey = `Q${lastKeyNumber + 1}`;

                // handleQuestions 호출
                handleQuestion({ [newKey]: generatedQuestion });

                const data = await response.text();
                console.log(data);
                const formData2 = new FormData();
                
                formData2.append(newKey, data);
                
                const response2 = await fetch('http://localhost:8000/ai-presenter/',{
                    method : 'POST',
                    body: formData2
                });
                if (!response2.ok) {
                    throw new Error('영상 생성에 실패했습니다.');
                }
                
                const data2 = await response2.json();
                handleInterviewerUpdate(data2)
                console.log(data2)
                // 요청 완료 상태 업데이트
                setRequested((prevRequested) => ({
                    ...prevRequested,
                    [keyPrefix]: true,
                }));

                // 디버깅을 위한 로그
                console.log(`Updated questions with new key: ${newKey} and value: ${generatedQuestion}`);
            } catch (error) {
                console.error(`Error fetching question for ${keyPrefix}:`, error);
            }
        };

        // A1에 대해 요청이 한 번도 이루어지지 않았고, 유효한 값이 있을 때 요청 실행
        if (answers.A1 && !requested.A1) {
            fetchQuestionForAnswer(answers.A1, 'A1');
        }

        // A2에 대해 요청이 한 번도 이루어지지 않았고, 유효한 값이 있을 때 요청 실행
        if (answers.A2 && !requested.A2) {
            fetchQuestionForAnswer(answers.A2, 'A2');
        }
    }, [answers, job, years, questions, handleQuestion, requested,handleInterviewerUpdate]);

    return (
        <>
            {/* 기타 UI 요소 */}
        </>
    );
}

export default FollowUp;
