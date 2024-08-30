import React, { useEffect } from 'react';
import axios from 'axios';

function FollowUp({ job, years, answers, questions, handleQuestion }) {
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

                // 디버깅을 위한 로그
                console.log(`Updated questions with new key: ${newKey} and value: ${generatedQuestion}`);
            } catch (error) {
                console.error(`Error fetching question for ${keyPrefix}:`, error);
            }
        };

        // A1과 A2에 대해 각각 서버 요청 실행
        if (answers.A1) {
            fetchQuestionForAnswer(answers.A1, 'A1');
        }

        if (answers.A2) {
            fetchQuestionForAnswer(answers.A2, 'A2');
        }
    }, [answers]);

    return (
        <>
            {/* 기타 UI 요소 */}
        </>
    );
}

export default FollowUp;
