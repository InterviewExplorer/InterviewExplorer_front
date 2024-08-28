import React, { useState } from 'react';

function Pdf() {
  const [job, setJob] = useState('');
  const [years, setYears] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState('');

  const handleJobChange = (event) => {
    setJob(event.target.value);
  };

  const handleYearsChange = (event) => {
    setYears(event.target.value);
  };

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('job', job);
    formData.append('years', years);
    formData.append('file', pdfFile);

    try {
      const response = await fetch('http://localhost:8000/generateQ/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }

      const data = await response.json();
      setResult(data.result); // 서버로부터 받은 결과값을 상태로 설정
    } catch (error) {
      console.error('에러 발생:', error);
      setResult('에러가 발생했습니다.'); // 에러 메시지 설정
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={job} onChange={handleJobChange}>
          <option value="">선택</option>
          <option value="developer">개발자</option>
          {/* 다른 옵션 추가 가능 */}
        </select>
        <input
          type="text"
          placeholder="ex:) 3년"
          value={years}
          onChange={handleYearsChange}
        />
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">전송</button>
      </form>

      {/* 서버로부터 받은 결과값을 화면에 표시 */}
      {result && (
        <div>
          <h3>결과:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default Pdf;
