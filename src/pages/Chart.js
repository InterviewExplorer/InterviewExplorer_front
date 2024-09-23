import { ResponsiveRadar } from '@nivo/radar';
import React, { useEffect, useState } from 'react';

// 한글 레이블과 영어 키의 매핑 객체
const labelToKeyMap = {
    '문제해결': 'problem_solving',
    '기술적 이해도': 'technical_understanding',
    '논리적 사고': 'logical_thinking',
    '학습능력': 'learning_ability',
    '협업 및 소통': 'collaboration_communication',
    '정직성(신뢰성)': 'honesty_reliability',
    '대인관계': 'interpersonal_skills',
    '동기부여(열정)': 'motivation_passion',
    '적응력': 'adaptability',
    '자기인식': 'self_awareness'
};

// 숫자 배열의 평균을 계산하는 함수
const calculateAverage = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
};

const MyResponsiveRadar = ({ data }) => (
    <ResponsiveRadar
        data={data}
        keys={[ '면접자', '평균' ]}
        indexBy="element"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={['#BB7BDF', '#B5BBE3']}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-right',
                direction: 'column',
                translateX: -70,
                translateY: -60,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    // <ResponsiveRadar
    //     data={data}
    //     keys={['면접자']}
    //     indexBy="element"
    //     valueFormat=">-.2f"
    //     margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
    //     borderColor={{ from: 'color' }}
    //     gridLabelOffset={36}
    //     dotSize={10}
    //     dotColor="white"
    //     dotBorderWidth={2}
    //     colors={{ datum: 'white' }}
    //     blendMode="multiply"
    //     motionConfig="wobbly"
    // />
);

function Chart({ blHeight, criteriaScores, type, job, years }) {
    const [averageScore, setAverageScore] = useState({});

    useEffect(() => {
        const fetchAverages = async () => {
            try {
                const formData = new FormData();
                formData.append('job', job);
                formData.append('years', years);
                formData.append('type', type);

                const response = await fetch('http://localhost:8000/average', {
                    method: 'POST',
                    body: formData,
                });
                
                const data = await response.json();
                setAverageScore(data)

            } catch (error) {
                console.error('Error fetching averages:', error);
            }
        };

        fetchAverages();
    }, [job, years, type]);

    // `type`에 따라 `element` 값을 설정
    const elements = type === 'technical'
        ? ['기술적 이해도', '문제해결', '논리적 사고', '협업 및 소통', '학습능력']
        : ['정직성(신뢰성)', '대인관계', '동기부여(열정)', '적응력', '자기인식'];

    // 데이터 생성
    const data = elements.map((element) => {
        const key = labelToKeyMap[element];
        const score = key ? calculateAverage(criteriaScores[key] || []) : 0;
        const average = averageScore[key] || 0;
        
        return {
            element,
            '면접자': score,
            '평균': isNaN(average) ? 0 : average,
        };
    });

    return (
        <div className='el_chart el_box hp_ml30 hp_mt0 hp_relative' style={{ height: blHeight }}>
            <p className='el_chart__ttl'>분석 요소</p>
            <MyResponsiveRadar data={data} />
        </div>
    );
}

export default Chart;
