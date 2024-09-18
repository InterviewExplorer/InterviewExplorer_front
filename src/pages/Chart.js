import { ResponsiveRadar } from '@nivo/radar';
import React from 'react';

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
        keys={['면접자']}
        indexBy="element"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor="white"
        dotBorderWidth={2}
        colors={{ datum: 'white' }}
        blendMode="multiply"
        motionConfig="wobbly"
    />
);

function Chart({ blHeight, type, criteriaScores }) {
    console.log("criteriaScores", criteriaScores);

    // `type`에 따라 `element` 값을 설정
    const elements = type === 'technical'
        ? ['기술적 이해도', '문제해결', '논리적 사고', '협업 및 소통', '학습능력']
        : ['정직성(신뢰성)', '대인관계', '동기부여(열정)', '적응력', '자기인식'];

    // 데이터 생성
    const data = elements.map((element) => {
        const key = labelToKeyMap[element];
        const average = key ? calculateAverage(criteriaScores[key] || []) : 0;
        console.log("key", key);
        console.log("average", average);

        return {
            element,
            '면접자': average
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
