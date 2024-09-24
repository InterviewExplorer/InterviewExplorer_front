import React, { useState } from 'react';

function Interviewer() {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        console.log('Uploaded files:', files);
    };

    return (
        <>
            <input 
                type="file" 
                accept=".pdf" 
                multiple 
                onChange={handleFileChange} 
            />
            <button onClick={handleUpload}></button>
            <div>
                <h3>Selected Files:</h3>
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Interviewer;
