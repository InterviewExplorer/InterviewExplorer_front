import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../pages/Loading';

function GetInfo2() {
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
        formData.append("interviewType", interviewType);
        if (pdfFile) formData.append('file', pdfFile);

        setLoading(true);

        try {
            // 기본질문 Q3 ~ 7
            const response = await fetch(`http://localhost:8000/${url}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('기본 질문 생성에 실패했습니다.');

            const basicQuestions = await response.json();
            console.log("basicQuestions", basicQuestions);

            // 이력서질문 Q1,2 (기본 질문 포함)
            const resumeFormData = new FormData();
            resumeFormData.append('job', job);
            resumeFormData.append('years', years);
            resumeFormData.append("interviewType", interviewType);
            if (pdfFile) resumeFormData.append('file', pdfFile);
            
            // 기본 질문 추가
            Object.entries(basicQuestions).forEach(([key, value]) => {
                resumeFormData.append(`basicQuestion_${key}`, value);
            });

            const resumeUrl = interviewType === "technical" ? "technical_resume" : "behavioral_resume";
            const resumeResponse = await fetch(`http://localhost:8000/${resumeUrl}`, {
                method: 'POST',
                body: resumeFormData,
            });

            if (!resumeResponse.ok) throw new Error('이력서 질문 생성에 실패했습니다.');

            const resumeQuestions = await resumeResponse.json();
            console.log("resumeQuestions", resumeQuestions);

            // 면접관 영상
            const formData2 = new FormData();
            for (const key in resumeQuestions) formData2.append(key, resumeQuestions[key]);
            for (const key in basicQuestions) formData2.append(key, basicQuestions[key]);
            
            // 면접관 영상
            const response2 = await fetch('http://localhost:8000/ai-presenter/', {
                method: 'POST',
                body: formData2,
            });

            if (!response2.ok) throw new Error('영상 생성에 실패했습니다.');

            const videoOfInterviewer = await response2.json();

            navigate('/guide', { state: { basicQuestions, job, years, videoOfInterviewer, type: interviewType, resumeQuestions } });
        } catch (error) {
            console.error('에러 발생:', error);
            alert('질문 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleFindType = (e) => {
        e.preventDefault();
        let type = e.target.value === "기술면접 응시" ? "technical" : "behavioral";
        submitInterview("basic_question", type);
    }

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC'>
            {loading ? (
                <Loading />
            ) : (
                <form className='el_box el_box__form hp_padding70'>
                    <h1>기본정보 입력 <p>* 필수</p></h1>
                    <label>
                        <span>직업 *</span>
                        <input type="text" placeholder="직업을 입력해주세요." value={job} onChange={handleJobChange} required />
                    </label>
                    <label>
                        <span>경력 *</span>
                        <input type="number" placeholder="년 단위로 숫자만 입력해주세요." value={years} onChange={handleYearsChange} required />
                    </label>
                    <label>
                        <span>이력서</span>
                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <button type="submit" value="기술면접 응시" onClick={handleFindType} className='el_btnM el_btnSkyBord hp_w100 hp_mt70'>기술면접 응시</button>
                    <button type="submit" value="인성면접 응시" onClick={handleFindType} className='el_btnM el_btnSkyBord hp_w100 hp_mt15'>인성면접 응시</button>
                </form>
            )}
        </div>
    );
}

export default GetInfo2;