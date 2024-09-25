import React, { useState } from 'react';

function Interviewer() {
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    const handleChange = (event) => setQuery(event.target.value);
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        console.log('Uploaded files:', files);
    };

    const submitQuery = async (value) =>{
        const formData = new FormData();
        formData.append("query",query);
        try {
            
            if(value=="키워드"){const response = await fetch(`http://localhost:8000/search_resumes_nori`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json(); // JSON 데이터로 변환
            setFiles(data); // 받아온 배열 데이터를 상태로 저장
        }
        else if(value=="벡터"){
            const response = await fetch(`http://localhost:8000/search_resumes`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json(); // JSON 데이터로 변환
            setFiles(data); // 받아온 배열 데이터를 상태로 저장
        }
     }catch (error) {
         console.error('에러 발생:', error);
         
     }

    
    
    
    
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
            <button type="submit" onClick={()=>submitQuery("키워드")}>키워드검색</button>
            {/* <button type="submit" onClick={()=>submitQuery("벡터")}>벡터검색</button> */}
            
            <div>
                <h3>Selected Files:</h3>
                <ul>
                {files.map((file, index) => (
                        
                        <li key={index}>{file.resume}</li>
                        
                        
                        
                        
                    ))}
                </ul>
                
            </div>
        </>
    );
}

export default Interviewer;
