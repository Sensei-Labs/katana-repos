import { ReactNode, useMemo } from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { WrapperStyle } from './style';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const _colors = [
  '#0072F5',
  '#9750DD',
  '#F5A524',
  '#17C964',
  '#F31260',
  '#B583E7',
  '#0B7439',
  '#A66908',
  '#037086',
  '#FF6BD5'
];

type DataItemType = {
  name: string;
  values: number[];
  labels: string[];
};

type RadarChartRenderProps = {
  data: DataItemType;
  header?: ReactNode;
  colors?: string[];
  width?: number;
  height?: number;
};

const options = {
  scale: {
    pointLabels: {
      color: 'white',
      fillStyle: 'red'
    }
  },
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: 'white'
      }
    },
    title: {
      display: false
    }
  }
};

function PolarAreaChartRender({
  data,
  colors = _colors
}: Omit<RadarChartRenderProps, 'header'>) {
  const transformData = useMemo(() => {
    const backgroundColor: string[] = [];

    data.values.forEach((item, index) => {
      const color = colors[index];
      backgroundColor.push(`${color}5d`);
    });

    const datasets = [
      {
        borderWidth: 0,
        fill: 'red',
        data: data.values,
        backgroundColor
      }
    ];

    return { datasets, labels: data.labels };
  }, [colors, data]);

  return <PolarArea options={options} data={transformData} />;
}

function PolarAreaChart({
  colors,
  data,
  width,
  header,
  height
}: RadarChartRenderProps) {
  return (
    <>
      {header}
      <WrapperStyle>
        <PolarAreaChartRender
          data={data}
          width={width}
          height={height}
          colors={colors}
        />
      </WrapperStyle>
    </>
  );
}

export default PolarAreaChart;
