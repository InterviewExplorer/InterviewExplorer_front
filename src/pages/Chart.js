import { ResponsiveRadar } from '@nivo/radar';
import React from 'react';

const MyResponsiveRadar = ({ data }) => (
    <ResponsiveRadar
        data={data}
        keys={['chardonnay']}
        indexBy="taste"
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

function Chart({ blHeight }) {
    const data = [
        { "taste": "한글1", "chardonnay": 60 },
        { "taste": "bitter", "chardonnay": 90 },
        { "taste": "heavy", "chardonnay": 80 },
        { "taste": "strong", "chardonnay": 50 },
        { "taste": "sunny", "chardonnay": 40 }
    ];

    return (
        <div className='el_chart el_box hp_ml30 hp_mt0 hp_relative' style={{ height: blHeight }}>
            <p className='el_chart__ttl'>분석요소 5가지</p>
            <MyResponsiveRadar data={data} />
        </div>
    );
}

export default Chart;
