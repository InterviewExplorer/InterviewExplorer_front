import React, { useState } from 'react';
import Loading from '../pages/Loading';

function Interviewer() {
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [summaryData, setSummaryData] = useState({});
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isResultActive, setIsResultActive] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeResumeId, setActiveResumeId] = useState(null);
    const [error, setError] = useState(null);
    const [pdfFiles, setPdfFiles] = useState({});

    const handleChange = (event) => setQuery(event.target.value);

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        setIsFileUploaded(true);
    
        const formData = new FormData();
        const newPdfFiles = {};
        selectedFiles.forEach((file) => {
            formData.append(`files`, file);
            formData.append(`sources`, file.name);
            newPdfFiles[file.name] = file;
        });
        setPdfFiles(newPdfFiles);
    
        try {
            setLoading(true);
            setError(null);
    
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
    
            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error('오류:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (selectedOptions.includes(value)) {
            setSelectedOptions(selectedOptions.filter((option) => option !== value));
        } else {
            setSelectedOptions([...selectedOptions, value]);
        }
    };

    const submitQuery = async (value) => {
        const formData = new FormData();
        formData.append("query", query);
        selectedOptions.forEach(option => {
            formData.append("career_options", option);
        });

        setLoading(true);
        try {
            const endpoint = value === "키워드" ? "search_resumes_nori" : "search_resumes_openai";
            const response = await fetch(`http://localhost:8000/${endpoint}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error('Error occurred:', error);
        }
        setLoading(false);
    };


    const handleListItemClick = (id) => {

        if (activeResumeId === id) {
            setActiveResumeId(null);
            setIsResultActive(false);
            setSelectedResume(null);
        } else {
            setActiveResumeId(id);
            setIsResultActive(true);
            const resumeData = summaryData[id];
            setSelectedResume(resumeData);
        }
    };

    const handlePdfView = (fileName) => {
        console.log('Attempting to open PDF with fileName:', fileName);
        const file = pdfFiles[fileName];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            window.open(fileUrl, '_blank');
        } else {
            console.error('PDF 파일을 찾을 수 없습니다.');
            alert('PDF 파일을 열 수 없습니다. 파일을 찾을 수 없습니다.');
        }
    };

    const TechnicalSkillsRows = ({ skills }) => {
        if (!skills || skills === '정보 없음') {
            return (
                <tr>
                    <th>보유 기술</th>
                    <td>정보 없음</td>
                </tr>
            );
        }
    
        const skillCategories = skills.split('/ ').reduce((acc, item) => {
            const [category, skillList] = item.split(': ');
            if (skillList && skillList.trim() !== '') {  // 스킬 리스트가 있고 비어있지 않은 경우만 추가
                acc[category] = skillList.trim();
            }
            return acc;
        }, {});
    
        // 모든 카테고리가 비어있는 경우 처리
        if (Object.keys(skillCategories).length === 0) {
            return (
                <tr>
                    <th>보유 기술</th>
                    <td>정보 없음</td>
                </tr>
            );
        }
    
        return (
            <tr>
                <th>보유<br/>기술</th>
                <td>
                    <table className="inner-table">
                        <tbody>
                            {Object.entries(skillCategories).map(([category, skillList]) => (
                                <tr key={category}>
                                    <th>{category.toUpperCase()}</th>
                                    <td>{skillList}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    };


    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC ly_interviewer'>
            {loading ? (
                <Loading />
            ) : (
            <div className='ly_maxWd hp_pt50 hp_pb50'>
                {isFileUploaded ? (                    
                    <>
                        <div className='bl_search el_box'>
                            <input className='bl_search__input' type="text" onChange={handleChange}/>
                            <button className='bl_search__btn el_btnGradation' type="submit" onClick={()=>submitQuery("벡터")}><b className='WA'>검색</b></button>
                        </div>
                        <div className='bl_exprience ly_flexC ly_fitemC hp_mt20'>
                            <span className='bl_exprience__ttl hp_36Color'>경력</span>
                            <label className="container">
                                <input type="checkbox" value="신입" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 신입
                            </label>
                            <label className="container">
                                <input type="checkbox" value="1년이상 3년미만" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 1 ~ 3년
                            </label>
                            <label className="container">
                                <input type="checkbox" value="3년이상 5년미만" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 3 ~ 5년
                            </label>
                            <label className="container">
                                <input type="checkbox" value="5년이상 7년미만" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 5 ~ 7년
                            </label>
                            <label className="container">
                                <input type="checkbox" value="7년이상 10년미만" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 7 ~ 10년
                            </label>
                            <label className="container">
                                <input type="checkbox" value="10년이상" onChange={handleCheckboxChange} />
                                <span className="checkmark"></span> 10년이상
                            </label>
                        </div>
                        <div className='ly_flex ly_fitemC hp_mt50'>
                                <p className='hp_fs22'>총 {summaryData.length}개</p>
                                <div className="filebox hp_ml20">
                                    {/* <label htmlFor="file" className='el_btnXS el_btn0Back'>+ 이력서 추가</label>  */}
                                    {/* <input type="file" id="file" accept=".pdf" multiple onChange={handleFileChange} style={{display: 'none'}}/> */}
                                </div>
                            </div>
                            <div className='ly_flex ly_fitemStart hp_mt20 el_box el_box__result'>
                                <div className={`bl_result  ${isResultActive ? 'hp_on' : ''}`}>
                                    <ul className='bl_resumeList'>
                                    {Object.entries(summaryData).map(([id, resume]) => (
                                            <li 
                                                key={id}
                                                onClick={() => handleListItemClick(id)}
                                                className={activeResumeId === id ? 'hp_on' : ''}
                                            >
                                                {resume.name} ({resume.date_of_birth})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={`bl_resumeSummary el_box ${isResultActive ? 'hp_on' : ''}`}>
                                {selectedResume && (
                                    <table>
                                        <tbody>
                                        <tr>
                                            <th>이름</th>
                                            <td>{selectedResume.name || '정보 없음'}</td>
                                        </tr>
                                        <tr>
                                            <th>생년월일</th>
                                            <td>{selectedResume.date_of_birth || '정보 없음'}</td>
                                        </tr>
                                        <tr>
                                            <th>프로젝트 수</th>
                                            <td>{selectedResume.number_of_projects || '정보 없음'}</td>
                                        </tr>
                                        <tr>
                                            <th>프로젝트 이름</th>
                                            <td>{selectedResume.project_description || '정보 없음'}</td>
                                        </tr>
                                        <tr>
                                            <th>키워드</th>
                                            <td>{selectedResume.summary_keywords || '정보 없음'}</td>
                                        </tr>
                                        <TechnicalSkillsRows skills={selectedResume.technical_skills} />
                                        <tr>
                                            <th>경력</th>
                                            <td>{selectedResume.work_experience || '정보 없음'}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    )}
                                    <button 
                                    className='bl_resumeSummary__btn el_btnM el_btnSkyBord hp_mt50 hp_w100' 
                                    onClick={() => handlePdfView(selectedResume.source)}
                                    > PDF 원본보기 </button>
                                </div>
                            </div>
                        </>
                ) : (
                    <div className="filebox hp_alignC">
                        <label htmlFor="file" className='el_uploadBtn el_btnL el_btn0Back hp_fontGmarket'>이력서 업로드</label> 
                        <input type="file" id="file" accept=".pdf" multiple onChange={handleFileChange} style={{display: 'none'}}/>
                        <p className='hp_fontGmarket hp_fs30 hp_mt50'>지원자들의 이력서를 모두 업로드 해주세요.</p>
                        <p className='hp_fontGmarket hp_fs22 hp_mt10'>※ 업로드 양에 따라 분석하는데 시간이 더 소요될 수 있습니다.</p>
                    </div>                    
                )}
            </div>
            )}
        </div>
    );
}

export default Interviewer;