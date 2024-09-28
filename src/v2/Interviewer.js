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

    return (
        <>
            <input 
                type="file" 
                accept=".pdf" 
                multiple 
                onChange={handleFileChange} 
            />
            <input type="text" onChange={handleChange}/>
            {/* <button type="submit" onClick={()=>submitQuery("키워드")}>키워드검색</button> */}
            <button type="submit" onClick={()=>submitQuery("벡터")}>검색</button>
            <label>
        <input
          type="checkbox"
          value="신입"
          onChange={handleCheckboxChange}
        />
        신입
      </label>
      <label>
        <input
          type="checkbox"
          value="3년이하"
          onChange={handleCheckboxChange}
        />
        3년이하
      </label>
      <label>
        <input
          type="checkbox"
          value="4년이상"
          onChange={handleCheckboxChange}
        />
        4년이상 6년이하
      </label>
      <label>
        <input
          type="checkbox"
          value="7년이상"
          onChange={handleCheckboxChange}
        />
        7년이상
      </label>
            <div>
                <h3>Selected Files:</h3>
                <ul>
                {files.map((file, index) => (
                        <>
                        <li key={index}>{file.source}</li>
                        {/* <li key={index}>{file.score}</li> */}
                        {/* <li key={index}>{file.context}</li>
                        <li key={index}>{file.reason}</li> */}
                        {/* <li key={index}>{file.content}</li> */}
                        </>
                        
                        
                        
                        
                        
                        
                        
                        
                    ))}
                </ul>
                
            </div>
            {loading&&<h1>로딩</h1>}
        </>
    );
}

export default Interviewer;
