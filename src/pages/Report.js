import React from 'react';
import { useLocation } from 'react-router-dom';

function Report() {
    const location = useLocation();
    const { answers = {}, questions = {} } = location.state || {};

    console.log('Received Answers:', answers);
    console.log('Received Questions:', questions);

    // 질문과 응답의 키 배열을 가져옵니다.
    const questionKeys = Object.keys(questions);
    const answerKeys = Object.keys(answers);

    return (
        <div>
            <h1>면접 결과</h1>
            
            {questionKeys.length > 0 && (
                <>
                    {questionKeys.map((key, index) => (
                        <div key={key}>
                            <p><strong>질문 {index + 1}:</strong> {questions[key]}</p>
                            {answerKeys[index] && (
                                <p><strong>답변:</strong> {answers[answerKeys[index]]}</p>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default Report;
