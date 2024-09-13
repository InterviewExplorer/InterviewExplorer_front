import { ResponsiveRadar } from '@nivo/radar'
import React from 'react';

const MyResponsiveRadar = ({ data }) => (
    <ResponsiveRadar
        data={data}
        keys={['chardonnay', 'carmenere', 'syrah']}
        indexBy="taste"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
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
);

function Chart() {
    const data = [
        {
            "taste": "한글1",
            "chardonnay": 60,
            "carmenere": 40,
            "syrah": 70
        },
        {
            "taste": "bitter",
            "chardonnay": 90,
            "carmenere": 60,
            "syrah": 40
        },
        {
            "taste": "heavy",
            "chardonnay": 80,
            "carmenere": 70,
            "syrah": 50
        },
        {
            "taste": "strong",
            "chardonnay": 50,
            "carmenere": 80,
            "syrah": 30
        },
        {
            "taste": "sunny",
            "chardonnay": 40,
            "carmenere": 60,
            "syrah": 70
        }
    ];

    return (
        <div style={{ height: '500px' }}>
            <MyResponsiveRadar data={data} />
        </div>
    );
}

export default Chart;
