import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import Loading from '../pages/Loading';
import Chart from '../pages/Chart';

function Report2() {
    const location = useLocation();
    const { answers = {}, questions = {}, job, years, type, feedback } = location.state || {};
    const [evaluations, setEvaluations] = useState({});
    const [loading, setLoading] = useState(true);
    const [explains, setExplains] = useState([]);
    const [summary, setSummary] = useState({});
    const [speakingEvaluation, setSpeakingEvaluation] = useState("");
    const componentRef = useRef(); 
    const [consolidatedFeedback, setConsolidatedFeedback] = useState("");
    const [isOpen, setIsOpen] = useState({});
    const [isAllOpen, setIsAllOpen] = useState(false);
    const [criteriaScores, setCriteriaScores] = useState({});
    const blHeightRef = useRef(null);
    const [blHeight, setBlHeight] = useState(0);
    const [averageScore, setAverageScore] = useState('');

    // 슬라이드 토글 함수
    const handleToggle = (key) => {
        setIsOpen(prevState => ({
            ...prevState,
            [key]: !prevState[key] // 해당 질문의 열림 상태를 토글
        }));
    };

    // 전체 펼치기/닫기 함수
    const handleToggleAll = () => {
        const allOpen = !isAllOpen; // 현재 상태의 반대로 설정
        const newIsOpen = {};
        
        // 모든 질문에 대해 펼치거나 닫기 상태로 설정
        Object.keys(questions).forEach((key) => {
            newIsOpen[key] = allOpen;
        });

        setIsOpen(newIsOpen); // 새로운 상태로 업데이트
        setIsAllOpen(allOpen); // 전체 상태 업데이트
    };

    const evaluateAnswer = async (question, answer) => {
        try {
            const response = await fetch('http://localhost:8000/each', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, answer, years, job, type }),
            });
    
            if (!response.ok) {
                throw new Error('평가 요청에 실패했습니다.');
            }
    
            const data = await response.json();
    
            // criteria_scores를 상태에 저장
            if (data.evaluation && data.evaluation.criteria_scores) {
                setCriteriaScores(prevScores => {
                    const updatedScores = { ...prevScores }; // 기존 상태 복사
    
                    Object.keys(data.evaluation.criteria_scores).forEach(key => {
                        const value = data.evaluation.criteria_scores[key];
                        
                        if (value !== null) {
                            if (!updatedScores[key]) {
                                updatedScores[key] = []; // key가 없으면 배열 초기화
                            }
                            updatedScores[key].push(value); // 배열에 값 추가
                        }
                    });
    
                    return updatedScores; // 새로운 상태 반환
                });
            }
    
            return data.evaluation;
        } catch (error) {
            console.error('에러 발생:', error);
            return { 평가: "평가를 불러오는 데 실패했습니다." };
        }
    };
    

    const evaluateSpeaking = async (answers) => {
        try {
            const response = await fetch('http://localhost:8000/speaking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers }),
            });
    
            if (!response.ok) {
                throw new Error('발화 평가 요청에 실패했습니다.');
            }
    
            const data = await response.json();
    
            if (data && typeof data === 'object' && data.speaking) {
                return data.speaking;
            } else {
                return "발화 평가 정보를 불러오는 데 실패했습니다.";
            }
        } catch (error) {
            console.error('발화 평가 에러 발생:', error);
            return "발화 평가 정보를 불러오는 데 실패했습니다.";
        }
    };

    const handleFeedback = async (feedback) => {
        let consolidated_feedback;
        
        try {
            const res = await axios.post("http://localhost:8000/get_consolidate_feedback", { feedback })
            if (res.status === 200 || res.status === 201) {
                consolidated_feedback = res.data.consolidated_feedback;
                return consolidated_feedback;
            } else {
                throw new Error("Failed to get feedback");
            }
        } catch (e) {
            console.error("Error getting feedback", e);
        }
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            const consolidated_feedback = await handleFeedback(feedback);
            setConsolidatedFeedback(consolidated_feedback);
        }

        fetchFeedback();
    }, []);

    // 점수를 숫자로 변환하는 함수
    const scoreToNumber = (score) => {
        const scoreMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
        return scoreMap[score] || 0;
    };

    // 숫자를 다시 점수로 변환하는 함수
    const numberToScore = (number) => {
        if (number >= 4.5) return 'A';
        if (number >= 3.5) return 'B';
        if (number >= 2.5) return 'C';
        if (number >= 1.5) return 'D';
        return 'F';
    };

    // 평균 점수 계산 함수
    const calculateAverageScore = (evaluations) => {
        const scores = Object.values(evaluations).map(evaluation => scoreToNumber(evaluation.score));
        const sum = scores.reduce((acc, curr) => acc + curr, 0);
        const average = sum / scores.length;
        return numberToScore(average);
    };

    useEffect(() => {
        const fetchEvaluations = async () => {
            const evaluations = {};
            const explanations = [];

            for (let i = 0; i < Object.keys(questions).length; i++) {
                const questionKey = `Q${i + 1}`;
                const answerKey = `A${i + 1}`;

                const question = questions ? questions[questionKey] : null;
                const answer = answers ? answers[answerKey] : null;

                if (question && answer) {
                    const evaluation = await evaluateAnswer(question, answer);
                    evaluations[questionKey] = evaluation;

                    if (evaluation.설명) {
                        explanations.push(evaluation.설명);
                    }
                }
            }

            setEvaluations(evaluations);
            setExplains(explanations);

            // 평균 점수 계산
            const avgScore = calculateAverageScore(evaluations);
            setAverageScore(avgScore);

            try {
                const response = await fetch('http://localhost:8000/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ evaluations: evaluations, type, averageScore: avgScore }),
                });

                if (!response.ok) {
                    throw new Error('요약 요청에 실패했습니다.');
                }

                const data = await response.json();
                
                if (typeof data === 'string') {
                    const cleanedData = data.replace(/^\{\s*"*([^"]*)"*"\s*\}$/, '$1');
                    setSummary(cleanedData);
                } else {
                    setSummary('');
                }

            } catch (error) {
                console.error('요약 에러 발생:', error);
            }

            if (type === 'behavioral') {
                const speakingResult = await evaluateSpeaking(answers);
                setSpeakingEvaluation(speakingResult);
            }

            setLoading(false);
        };

        fetchEvaluations();
    }, [questions, answers, years, job]);

    useEffect(() => {
        if (blHeightRef.current) {
            const height = blHeightRef.current.offsetHeight;
            setBlHeight(height);
        }
    }, [blHeightRef.current, summary, consolidatedFeedback]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const questionKeys = questions ? Object.keys(questions) : [];

    const feedbackArray = feedback && feedback.feedbackList ? feedback.feedbackList.flat() : [];
    const uniqueFeedback = Array.from(new Set(feedbackArray));

    return (
        <div className='ly_all el_bg'>
            {loading ? (
                <Loading />
            ) : (
            <div className='ly_maxWd ly_report' ref={componentRef}>
                <div className='ly_spaceBetween ly_fitemC hp_mb50'>
                    <h1 className='hp_fontGmarket hp_fs36 hp_fw700'>
                        {years}년차 {job} {type === 'technical' ? '기술' : '인성'}면접 결과
                    </h1>
                    <button className='el_pdfBtn el_btnS el_btn0Back' onClick={handlePrint}>PDF로 저장</button>
                </div>
                <div className='ly_flex'>
                    <div className='bl_height' ref={blHeightRef}>
                        {summary && (
                            <div className='el_box el_box__hover hp_mt0'>
                                <h2>종합 평가 <span className='hp_fs24 hp_fw600 hp_purpleColor'>[ {averageScore} ]</span></h2>
                                <p>{summary}</p>
                            </div>
                        )}

                        {consolidatedFeedback && (
                            <div className='el_box el_box__hover'>
                                <h2>자세 피드백</h2>
                                <span>[ </span>
                                {uniqueFeedback.map((feedback, index) => (
                                    <span key={index}>
                                        {feedback}
                                        {index < uniqueFeedback.length - 1 && ', '}
                                    </span>
                                ))}
                                <span> ]</span>
                                <p>{consolidatedFeedback}</p>
                            </div>
                        )}
                    </div>
                    {/* Chart에 blHeight 전달 */}
                    <Chart blHeight={blHeight} criteriaScores={criteriaScores} type={type} job={job} years={years} />
                </div>

                {type === "behavioral" && (
                    <div className='el_box'>
                        <h2>언어습관 및 말투 평가</h2>
                        <p>{speakingEvaluation}</p>
                    </div>
                )}

                {questionKeys.length > 0 && (
                    <div className='el_box el_box__each'>
                        <div className='ly_spaceBetween ly_fitemC'>
                            <h2>개별 평가</h2>
                            <button type='button' className='el_allBtn el_btnXS el_btnGradation' onClick={handleToggleAll}>
                                {isAllOpen ? '전체 닫기' : '전체 펼치기'}
                            </button>
                        </div>
                        {questionKeys.map((key, index) => {
                            const answerKey = `A${index + 1}`;
                            const evaluation = evaluations[key] || {};
                            const isQuestionOpen = isOpen[key];

                            return (
                                <div key={key} className='bl_each'>
                                    <button type='button' className='bl_each__question hp_w100 hp_alignL' onClick={() => handleToggle(key)}>
                                        <b className='bl_each__q el_shqdowBasic'>Q</b> 
                                        <div className='ly_spaceBetween ly_fitemC hp_w100'>
                                            {questions[key]}
                                            <p className='bl_each__dots' style={{ display: isQuestionOpen ? 'none' : 'block' }}></p>
                                        </div>
                                    </button>
                                    <table className={`bl_eachTB ${isOpen[key] ? 'open' : 'closed'}`} style={{ display: isOpen[key] ? 'table' : 'none' }}>
                                        <tbody>
                                            <tr>
                                                <th>답변</th>
                                                <td>{answers[answerKey]}</td>
                                            </tr>
                                            <tr>
                                                <th>평가</th>
                                                <td>{evaluation.score !== undefined ? evaluation.score : "점수를 불러오는 데 실패했습니다."}</td>
                                            </tr>
                                            <tr>
                                                <th>설명</th>
                                                <td>{evaluation.explanation || "설명 정보가 없습니다."}</td>
                                            </tr>
                                            {type === "technical" && (
                                            <tr>
                                                <th>모범<br/>답안</th>
                                                <td>{evaluation.ideal || "모범답안 정보가 없습니다."}</td>
                                            </tr>
                                            )}
                                            {type === "behavioral" && (
                                            <tr>
                                                <th>질문<br/>의도</th>
                                                <td>{evaluation.intention || "질문의 의도 정보가 없습니다."}</td>
                                            </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            )}
        </div>
    );
}

export default Report2;