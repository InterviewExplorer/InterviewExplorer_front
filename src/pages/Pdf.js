import axios from 'axios';
import React, { useState } from 'react';
import VideoRecorder from './VideoRecorder';
import { useNavigate } from 'react-router-dom';

function Pdf() {
    const navigate = useNavigate();
    const [job, setJob] = useState('');
    const [years, setYears] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // dj
    const [answers, setAnswers] = useState(null);
    const handleAnswers = (newData) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            ...newData
        }));
    };
    console.log("answers", answers);

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
        } catch (error) {
            console.error('에러 발생:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
        }
        try {
            const response = await axios.post('http://localhost:8000/generate_question/', {
                job: job,
                years: years,
            });

            if (response.status !== 201) {
                throw new Error('통신에러');
            }

            const data = response.data;
            setQuestions(data);
            setCurrentQuestionIndex(0);
        } catch (error) {
            console.error('Axios 에러 발생:', error);
            alert('꼬리물기 질문 생성 중 오류가 발생했습니다.');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const [showEndInterviewButton, setShowEndInterviewButton] = useState(false);

    const handleEndInterview = () => {
        navigate('/report'); // /report 페이지로 이동
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select value={job} onChange={handleJobChange} required>
                    <option value="">직업군 선택</option>
                    <option value="developer">개발자</option>
                    {/* 필요에 따라 다른 옵션 추가 */}
                </select>
                <input
                    type="text"
                    placeholder="연차 (예: 3년)"
                    value={years}
                    onChange={handleYearsChange}
                    required
                />
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button type="submit">질문 생성</button>
            </form>

            {questions && (
                <div>
                    <h3>질문 {currentQuestionIndex + 1}:</h3>
                    <p>
                        {currentQuestionIndex === 0 
                            ? questions.first_question 
                            : questions.second_question}
                    </p>
                    {currentQuestionIndex < 1 && (
                        <button onClick={handleNextQuestion}>다음 질문</button>
                    )}
                    {showEndInterviewButton && (
                        <button onClick={handleEndInterview}>면접 종료</button>
                    )}
                    
                    <VideoRecorder handleAnswers={handleAnswers}/>
                </div>
            )}
        </div>
    );
}

export default Pdf;