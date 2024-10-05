import React, { useEffect, useState } from 'react';

function LatestQuestions({ job, type, answers, handleQuestion, questions ,handleInterviewerUpdate}) {
    const [hasAnswer, setHasAnswer] = useState(false);

    useEffect(() => {        
        if (answers['A5'] !== null && questions['Q8'] == null) { // 답변이 있는지 확인
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

                    console.log("answersString", answersString)

                    const response = await fetch('http://localhost:8000/newQ_create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            job: job,
                            type: type,
                            answers: answersString
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('서버 응답이 실패했습니다');
                    }

                    const data = await response.json();
                    const LastestQuestion = { Q8: data.Questions };
                    followingInterviewers('Q8',data.questions)
                    console.log(data.Questions)
                    console.log(data.questions)
                    handleQuestion(LastestQuestion);
                    
                } catch (error) {
                    console.error('새 질문 생성 중 오류 발생:', error);
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
                console.log("데이터잘옴?",data2)
                handleInterviewerUpdate(data2)
            }     
            fetchNewQuestion();
            setHasAnswer(false);
        }
    }, [job, type, answers, hasAnswer]);

    return null;
}

export default LatestQuestions;
