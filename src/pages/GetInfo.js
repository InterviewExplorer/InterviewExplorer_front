import axios from 'axios';
import React, { useState } from 'react';
import { json, useNavigate } from 'react-router-dom';

function GetInfo() {
    const navigate = useNavigate();
    const [job, setJob] = useState('');
    const [years, setYears] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleJobChange = (event) => {
        setJob(event.target.value);
    };

    const handleYearsChange = (event) => {
        setYears(event.target.value);
    };

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!job || !years) {
            alert('직업군과 연차는 필수 입력 항목입니다.');
            return;
        }

        const formData = new FormData();
        formData.append('job', job);
        formData.append('years', years);
        if (pdfFile) {
            formData.append('file', pdfFile);
        }

        try {
            const response = await fetch('http://localhost:8000/generateQ/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('질문 생성에 실패했습니다.');
            }

            const data = await response.json();
            setQuestions(data);
            setCurrentQuestionIndex(0);
            
            const response2 = await fetch('http://localhost:8000/generate_question/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    job: job,
                    years: years,
                }),
            });

            if (!response2.ok) {
                throw new Error('꼬리물기 질문 생성에 실패했습니다.');
            }

            const data2 = await response2.json();

            const combinedQuestions = { ...data, ...data2 };

            setQuestions(combinedQuestions)

            console.log("총 문제: " + JSON.stringify(combinedQuestions));

            // 질문 생성에 성공한 경우
            navigate('/interview_technical', { state: { questions: combinedQuestions } });
        } catch (error) {
            console.error('에러 발생:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>직업 :
                <select value={job} onChange={handleJobChange} required>
                    <option value="">선택</option>
                    <option value="developer">개발자</option>
                </select>
            </label>
            <br/>
            <label>경력 :
                <input
                    type="text"
                    placeholder="년 단위로 숫자만 입력해주세요."
                    value={years}
                    onChange={handleYearsChange}
                    required
                />
            </label>
            <br/>
            <label>이력서 :
                <input type="file" accept=".pdf" onChange={handleFileChange} />
            </label>
            <br/>
            <button type="submit">기술면접 응시</button>
        </form>
    );
}

export default GetInfo;
