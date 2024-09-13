import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetInfo() {
    const navigate = useNavigate();
    const [job, setJob] = useState('');
    const [years, setYears] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleJobChange = (event) => setJob(event.target.value);
    const handleYearsChange = (event) => setYears(event.target.value);
    const handleFileChange = (event) => setPdfFile(event.target.files[0]);

    const submitInterview = async (url, interviewType) => {
        if (!job || !years) {
            alert('직업군과 연차는 필수 입력 항목입니다.');
            return;
        }

        const formData = new FormData();
        formData.append('job', job);
        formData.append('years', years);
        if (pdfFile) formData.append('file', pdfFile);

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/${url}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('질문 생성에 실패했습니다.');

            const data = await response.json();
            const formData2 = new FormData();
            for (const key in data) formData2.append(key, data[key]);

            const response2 = await fetch('http://localhost:8000/ai-presenter/', {
                method: 'POST',
                body: formData2,
            });

            if (!response2.ok) throw new Error('영상 생성에 실패했습니다.');

            const data2 = await response2.json();
            navigate('/guide', { state: { questions: data, job, years, interviewer: data2, type: interviewType } });
        } catch (error) {
            console.error('에러 발생:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleTechnicalSubmit = (event) => {
        event.preventDefault();
        submitInterview('generateQ/', 'technical');
    };

    const handleBehavioralSubmit = (event) => {
        event.preventDefault();
        submitInterview('generateQ_behavioral/', 'behavioral');
    };

    return (
        <div>
            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <form>
                    <label>
                        직업 :
                        <input
                            type="text"
                            placeholder="직군을 입력해주세요."
                            value={job}
                            onChange={handleJobChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        경력 :
                        <input
                            type="number"
                            placeholder="년 단위로 숫자만 입력해주세요."
                            value={years}
                            onChange={handleYearsChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        이력서 :
                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <br />
                    <br />
                    <button type="submit" onClick={handleTechnicalSubmit}>기술면접 응시</button>
                    <button type="submit" onClick={handleBehavioralSubmit}>인성면접 응시</button>
                </form>
            )}
        </div>
    );
}

export default GetInfo;
