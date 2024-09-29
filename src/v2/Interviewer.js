import React, { useState } from 'react';
import Loading from '../pages/Loading';

function Interviewer() {
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    
    const [loading, setLoading] = useState(false);
    const handleChange = (event) => setQuery(event.target.value);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        console.log('Uploaded files:', files);
    };
    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (selectedOptions.includes(value)) {
          // 이미 선택된 항목이면 제거
          setSelectedOptions(selectedOptions.filter((option) => option !== value));
        } else {
          // 선택되지 않은 항목이면 추가
          setSelectedOptions([...selectedOptions, value]);
        }
    };
    const submitQuery = async (value) =>{
        const formData = new FormData();
        formData.append("query",query);
        selectedOptions.forEach(option => {
            formData.append("career_options", option);
        });
        console.log(selectedOptions)
        setLoading(true);
        try {
            
            if(value=="키워드"){const response = await fetch(`http://localhost:8000/search_resumes_nori`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json(); // JSON 데이터로 변환
            
            setFiles(data); // 받아온 배열 데이터를 상태로 저장
        }
        else if(value=="벡터"){
            const response = await fetch(`http://localhost:8000/search_resumes_openai`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json(); // JSON 데이터로 변환
            setFiles(data); // 받아온 배열 데이터를 상태로 저장
        }
     }catch (error) {
         console.error('에러 발생:', error);
     }
     setLoading(false);
}

    const [isResultActive, setIsResultActive] = useState(false);
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeResumeId, setActiveResumeId] = useState(null);

    const handleListItemClick = (id) => {
        if (activeResumeId === id) {
            setActiveResumeId(null);
            setIsResultActive(false);
            setSelectedResume(null);
        } else {
            setActiveResumeId(id);
            setIsResultActive(true);
            const resumeData = summaryData[id] && summaryData[id][0];
            setSelectedResume(resumeData);
        }
    };

    // 이다정
    const summaryData = {
        1: [
          {
            name: "홍길동",
            birth: "1996.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        2: [
          {
            name: "김철수",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        3: [
          {
            name: "김영희",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        4: [
          {
            name: "바나나",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        5: [
          {
            name: "고양이",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        6: [
          {
            name: "홍길동",
            birth: "1996.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        7: [
          {
            name: "김철수",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        8: [
          {
            name: "김영희",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        9: [
          {
            name: "바나나",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ],
        10: [
          {
            name: "고양이",
            birth: "2000.01.01",
            skill: "Java, Python, C++, C#, UI/UX Design Figma Adobe XD Sketch HTML5 CSS3/SASS JavaScript React, Next.js Styled-components Git",
            keyword: ["소통", "협력", "리더쉽", "긍정적", "진취적"]
          }
        ]
    };

    return (
        <div className='ly_all el_bg ly_flexC ly_fitemC ly_interviewer'>
            {loading ? (
                <Loading />
            ) : (
            <div className='ly_maxWd hp_pt50 hp_pb50'>
                <div>
                    {/* <input type="file" accept=".pdf" multiple onChange={handleFileChange} /> */}
                    <div className='bl_search el_box'>
                        <input className='bl_search__input' type="text" onChange={handleChange}/>
                        <button className='bl_search__btn' type="submit" onClick={()=>submitQuery("벡터")}><b className='WA'>검색</b></button>
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
                </div>
                <div className='ly_flex ly_fitemStart hp_mt85 el_box el_box__result'>
                    <div className={`bl_result  ${isResultActive ? 'hp_on' : ''}`}>
                        <ul className='bl_resumeList'>
                            {Object.keys(summaryData).map((id) => (
                                <li 
                                    key={id} 
                                    onClick={() => handleListItemClick(id)}
                                    className={activeResumeId === id ? 'hp_on' : ''}
                                >
                                    {summaryData[id][0].name} ({summaryData[id][0].birth})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`bl_resumeSummary el_box ${isResultActive ? 'hp_on' : ''}`}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>이름</th>
                                    <td>{selectedResume?.name || ''}</td>
                                </tr>
                                <tr>
                                    <th>생년월일</th>
                                    <td>{selectedResume?.birth || ''}</td>
                                </tr>
                                <tr>
                                    <th>보유기술</th>
                                    <td>{selectedResume?.skill || ''}</td>
                                </tr>
                                <tr>
                                    <th>키워드</th>
                                    <td>{selectedResume?.keyword?.join(', ') || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                        <a className='bl_resumeSummary__btn el_btnM el_btnSkyBord hp_mt50 hp_w100' href=''>PDF 원본보기</a>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Interviewer;
