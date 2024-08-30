import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetInfo() {
    const navigate = useNavigate();
    const [job, setJob] = useState('');
    const [years, setYears] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가

    const handleQuestions = (newData) => {
        setQuestions(prevQuestions => ({
            ...prevQuestions,
            ...newData
        }));
    };

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

        setLoading(true);  // 로딩 시작

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

            const formData2 = new FormData();
            for (const key in data) {
                formData2.append(key, data[key]);
            }

            const response2 = await fetch('http://localhost:8000/ai-presenter/',{
                method : 'POST',
                body: formData2
            });
            if (!response2.ok) {
                throw new Error('영상 생성에 실패했습니다.');
            }
            const data2 = await response2.json();
            console.log(data2);
            // 질문 생성에 성공한 경우
            navigate('/interview_technical', { state: { questions: data, interviewer: data2 }});
        } catch (error) {
            console.error('에러 발생:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            {loading ? (
                <div>로딩 중...</div>  // 로딩 중일 때 표시할 메시지
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>직업 :
                        <input
                            type="text"
                            placeholder="직군을 입력해주세요."
                            value={job}
                            onChange={handleJobChange}
                            required
                        />
                    </label>
                    <br />
                    <label>경력 :
                        <input
                            type="text"
                            placeholder="년 단위로 숫자만 입력해주세요."
                            value={years}
                            onChange={handleYearsChange}
                            required
                        />
                    </label>
                    <br />
                    <label>이력서 :
                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <br />
                    <button type="submit">기술면접 응시</button>
                </form>
            )}
        </div>
    );
}

export default GetInfo;
