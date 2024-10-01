import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../pages/Loading';

function Upload() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        const formData = new FormData();
        const newPdfFiles = {};
        selectedFiles.forEach((file) => {
            formData.append(`files`, file);
            formData.append(`sources`, file.name);
            newPdfFiles[file.name] = file;
        });
    
        try {
            setLoading(true);
    
            // Reset index first
            const clearResponse = await fetch("http://localhost:8000/reset_index", {
                method: 'POST',
            });
            if (!clearResponse.ok) {
                throw new Error('인덱스 초기화 중 오류가 발생했습니다.');
            }

            // Then upload PDF files
            const response = await fetch('http://localhost:8000/pdf', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || '파일 업로드 중 오류가 발생했습니다.');
            }
    
            const pdfData = await response.json();
    
            navigate('/interviewer', { state: { pdfData, newPdfFiles } });
        } catch (error) {
            console.error('오류:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC ly_interviewer'>
            {loading ? (
                <Loading />
            ) : (
                <div className='ly_maxWd hp_pt50 hp_pb50'>
                    <div className="filebox hp_alignC">
                        <label htmlFor="file" className='el_uploadBtn el_btnL el_btn0Back hp_fontGmarket'>이력서 업로드</label> 
                        <input type="file" id="file" accept=".pdf" multiple onChange={handleFileChange} style={{display: 'none'}}/>
                        <p className='hp_fontGmarket hp_fs24 hp_mt30'>지원자들의 이력서를 모두 업로드 해주세요.</p>
                        <p className='hp_fontGmarket hp_fs18'>※ 업로드 양에 따라 분석하는데 시간이 더 소요될 수 있습니다.</p>
                    </div>                    
                </div>
            )}
        </div>
    );
}

export default Upload;