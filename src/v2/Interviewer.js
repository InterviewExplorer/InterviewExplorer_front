import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../pages/Loading';

function Interviewer() {
    const [summaryData, setSummaryData] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isResultActive, setIsResultActive] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeResumeId, setActiveResumeId] = useState(null);
    const [error, setError] = useState(null);
    const [pdfFiles, setPdfFiles] = useState({});

    useEffect(() => {
        if (location.state) {
            if (location.state.pdfData) {
                setSummaryData(location.state.pdfData);
            }
            if (location.state.newPdfFiles) {
                setPdfFiles(location.state.newPdfFiles);
            }
        }
    }, [location.state]);

    const handleChange = (event) => setQuery(event.target.value);

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
            if (skillList && skillList.trim() !== '') {
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
            <>
                {Object.entries(skillCategories).map(([category, skillList]) => (
                    <tr key={category}>
                        <th>{category.toUpperCase()}</th>
                        <td>{skillList}</td>
                    </tr>
                ))}
            </>
        );
    };


    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC ly_interviewer'>
            {loading ? (
                <Loading />
            ) : (
            <div className='ly_maxWd hp_pt50 hp_pb50'>
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
                    <p className='hp_fs22'>총 {Object.keys(summaryData).length}개</p>
                    {/* <div className="filebox hp_ml20">
                        <label htmlFor="file" className='el_btnXS el_btn0Back'>+ 이력서 추가</label> 
                        <input type="file" id="file" accept=".pdf" multiple onChange={handleFileChange} style={{display: 'none'}}/>
                    </div> */}
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
                                    {resume.name && resume.name.replace(/,\s*$/, '')} ({resume.date_of_birth && resume.date_of_birth.replace(/,\s*$/, '')})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`bl_resumeSummary el_box ${isResultActive ? 'hp_on' : ''}`}>
                        {selectedResume && (
                            <>
                                <h3 className='hp_purpleColor hp_fs18 hp_mb10'>{selectedResume.summary_keywords || '정보 없음'}</h3>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>이름</th>
                                            <td>{(selectedResume.name && selectedResume.name.replace(/,\s*$/, '')) || '정보 없음'}</td>
                                        </tr>
                                        <tr>
                                            <th>생년월일</th>
                                            <td>
                                                {selectedResume.date_of_birth && selectedResume.date_of_birth.replace(/,\s*$/, '') === '없음' ? '-'
                                                : (selectedResume.date_of_birth && selectedResume.date_of_birth.replace(/,\s*$/, '')) || '정보 없음'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>경력</th>
                                            <td>
                                                {selectedResume.work_experience && selectedResume.work_experience.replace(/,\s*$/, '') === '없음' ? '-'
                                                : (selectedResume.work_experience && selectedResume.work_experience.replace(/,\s*$/, '')) || '-'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>프로젝트수</th>
                                            <td>
                                                {selectedResume.number_of_projects && selectedResume.number_of_projects.replace(/,\s*$/, '') === '0개' ||
                                                selectedResume.number_of_projects && selectedResume.number_of_projects.replace(/,\s*$/, '') === '없음' ? '-' 
                                                : (selectedResume.number_of_projects && selectedResume.number_of_projects.replace(/,\s*$/, '')) || '정보 없음'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>프로젝트명</th>
                                            <td>
                                                {!selectedResume.project_description || 
                                                selectedResume.project_description.replace(/,\s*$/, '').trim() === '' || 
                                                selectedResume.project_description.replace(/,\s*$/, '').trim() === '없음' ? (
                                                    '-'
                                                ) : (
                                                    <ul className='bl_listRing'>
                                                        {selectedResume.project_description.split(',')
                                                            .map((project, index) => {
                                                                const trimmedProject = project.trim();
                                                                return trimmedProject && (
                                                                    <li key={index}>{trimmedProject}</li>
                                                                );
                                                            })
                                                            .filter(Boolean)}
                                                    </ul>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h3 className='hp_purpleColor hp_fs18 hp_mt40 hp_mb10'>보유기술</h3>
                                <table className="inner-table">
                                    <tbody>
                                        <TechnicalSkillsRows skills={selectedResume.technical_skills} />
                                    </tbody>
                                </table>
                            </>
                        )}
                        <button className='bl_resumeSummary__btn el_btnM el_btnSkyBord hp_mt50 hp_w100' 
                        onClick={() => handlePdfView(selectedResume.source)} > PDF 원본보기 </button>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Interviewer;