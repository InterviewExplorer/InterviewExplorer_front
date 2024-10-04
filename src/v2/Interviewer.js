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
    const [scores, setScores] = useState([])
    const [filteredResume,setFilteredResume]=useState([])
    const [tempSummaryData, setTempSummaryData] = useState();

    useEffect(() => {
        if (location.state) {
            if (location.state.pdfData) {
                setSummaryData(Object.values(location.state.pdfData).sort((a, b) => a.name.localeCompare(b.name, 'ko')));
                setTempSummaryData(Object.values(location.state.pdfData).sort((a, b) => a.name.localeCompare(b.name, 'ko')))
                
            }
            if (location.state.newPdfFiles) {
                setPdfFiles(location.state.newPdfFiles);
            }
        }
    }, [location.state]);




    useEffect(() => {
        
        if (summaryData && typeof summaryData === 'object' && Object.keys(summaryData).length > 0 && scores) {
            
          const summaryArray = Object.values(summaryData).filter(item => typeof item === 'object');
          const updatedSummaryData = summaryArray
      .filter(resumeItem => scores.some(scoreItem => scoreItem.source === resumeItem.source))
      .map(resumeItem => {
        const scoreItem = scores.find(scoreItem => scoreItem.source === resumeItem.source);
        return { ...resumeItem, score: scoreItem ? scoreItem.score : 0 };
      })
      .sort((a, b) => b.score - a.score); // 점수 내림차순 정렬
      console.log(updatedSummaryData)
    setSummaryData(updatedSummaryData);
    
        }
        
      }, [scores]);

    useEffect(()=>{
        if(tempSummaryData){
            
            const loadData = async () => {
                
                if(selectedOptions.length===0){
                    
                    setSummaryData(tempSummaryData);
                    return;
                }
                setSummaryData(tempSummaryData);
                const formdata = new FormData();
                selectedOptions.forEach((item) => {
                  formdata.append("career_options", item);
                });
                
                try {
                  const response = await fetch("http://localhost:8000/career_filter", {
                    method: 'POST',
                    body: formdata
                  });
                  const data = await response.json();
                  setFilteredResume(data);
                } catch (error) {
                  console.error('Error:', error);
                }
              };
              
              loadData();
              
        }
        
    },[selectedOptions])
    useEffect(() => {
        
        if (summaryData && typeof summaryData === 'object' && Object.keys(summaryData).length > 0 && filteredResume) {
            
          const summaryArray = Object.values(summaryData).filter(item => typeof item === 'object');
          const updatedSummaryData = summaryArray
      .filter(resumeItem => filteredResume.some(scoreItem => scoreItem.source === resumeItem.source))
      .map(resumeItem => {
        const scoreItem = filteredResume.find(scoreItem => scoreItem.source === resumeItem.source);
        return { ...resumeItem, filteredResume: scoreItem ? scoreItem.career : 0 };
      })
      .sort((a, b) => b.career - a.career); 
      setSummaryData(updatedSummaryData)
      
        }
        
      }, [filteredResume]);


      const handleProjectListClick =(event) =>{
        if (event.target.checked) {
                const sortedData=Object.values(summaryData).sort((a,b)=>b.number_of_projects-a.number_of_projects)
                setSummaryData(sortedData)}
        else{
            const sortedData=Object.values(summaryData).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
            setSummaryData(sortedData)

        }
                
            }
        
        
        
        
    const handleChange = (event) => setQuery(event.target.value);

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if(event.target.checked){
            setSelectedOptions([...selectedOptions, value]);
        }
        
            
         else {
            setSelectedOptions(selectedOptions.filter((option) => option !== value));
            
        }
        
        
    };

    const submitQuery = async (value) => {
        const formData = new FormData();
        formData.append("query", query);
        
        // setSummaryData(location.state.pdfData)
        setLoading(true);
        try {
            const endpoint = "search_resumes";
            const response = await fetch(`http://localhost:8000/${endpoint}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setScores(data)
            // setSummaryData(data);
            console.log(data)
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
                        <input type="checkbox" value="1~3년" onChange={handleCheckboxChange} />
                        <span className="checkmark"></span> 1 ~ 3년
                    </label>
                    <label className="container">
                        <input type="checkbox" value="3~5년" onChange={handleCheckboxChange} />
                        <span className="checkmark"></span> 3 ~ 5년
                    </label>
                    <label className="container">
                        <input type="checkbox" value="5~7년" onChange={handleCheckboxChange} />
                        <span className="checkmark"></span> 5 ~ 7년
                    </label>
                    <label className="container">
                        <input type="checkbox" value="7~10년" onChange={handleCheckboxChange} />
                        <span className="checkmark"></span> 7 ~ 10년
                    </label>
                    <label className="container">
                        <input type="checkbox" value="10년이상" onChange={handleCheckboxChange} />
                        <span className="checkmark"></span> 10년이상
                    </label>
                    <label>
                    <input type="checkbox"onChange={handleProjectListClick}
                            /> 프로젝트수 정렬
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
                                    {resume.name} ({resume.date_of_birth})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`bl_resumeSummary el_box ${isResultActive ? 'hp_on' : ''}`}>
                        {selectedResume && (
                            <>
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
                                        <th>프로젝트수</th>
                                        <td>{selectedResume.number_of_projects || '정보 없음'}</td>
                                    </tr>
                                    <tr>
                                        <th>프로젝트명</th>
                                        <td>{selectedResume.project_description || '정보 없음'}</td>
                                    </tr>
                                    <tr>
                                        <th>키워드</th>
                                        <td>{selectedResume.summary_keywords || '정보 없음'}</td>
                                    </tr>
                                    <tr>
                                        <th>경력</th>
                                        <td>{selectedResume.work_experience || '정보 없음'}</td>
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