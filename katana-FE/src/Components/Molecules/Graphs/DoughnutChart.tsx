import { Col, Empty, Row, Skeleton } from 'antd';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import {
  contentCenterPlugin,
  thicknessPlugin,
  getBackgroundGradientColor
} from '@/Components/Molecules/Graphs/Plugins/donut';

import { WrapperStyle } from './style';
import LegendDonut from 'src/Components/Atoms/Legends';
import { useDarkModeContext } from 'dark-mode-context';

ChartJS.register(ArcElement, Tooltip, Legend);

const _colors = [
  '#9750DD',
  '#F5A524',
  '#F31260',
  '#17C964',
  '#0072F5',
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

type DoughnutChartRenderProps = {
  data: DataItemType;
  header?: ReactNode;
  colors?: string[];
  width?: number;
  height?: number;
  loading?: boolean;
};

const options: ChartJS['options'] = {
  // spacing: 2,
  maintainAspectRatio: true,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: { formattedValue: string; label: string }) => {
          return ` ${context?.label}: $${context.formattedValue}`;
        }
      }
    }
  }
};

function DoughnutRender({
  data,
  colors = _colors
}: Omit<DoughnutChartRenderProps, 'header'>) {
  const { isDarkMode } = useDarkModeContext();
  const [removeSet, setRemoveSet] = useState<number[]>([]);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);
  const [chartData, setChartData] = useState<{
    datasets: ChartJS<'doughnut'>['data']['datasets'];
    labels: string[];
  }>({
    datasets: [],
    labels: []
  });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const newData: number[] = [];
    const backgroundColors: string[] = [];

    data.values.forEach((item, index) => {
      if (removeSet.includes(index)) return;
      const color = colors[index];
      newData.push(item);
      if (colors) {
        backgroundColors.push(color);
      }
    });

    const datasets: ChartJS<'doughnut'>['data']['datasets'] = [
      {
        borderWidth: 0,
        borderRadius: 3,
        borderAlign: 'outer' as any,
        data: newData,
        backgroundColor: getBackgroundGradientColor(chart, backgroundColors),
        hoverBackgroundColor: backgroundColors
      } as any
    ];

    const dataToSave = { datasets, labels: data.labels };

    setChartData(dataToSave);
  }, [colors, data.labels, data.values, removeSet]);

  const onSetIndex = (index: number) => {
    setRemoveSet((prev) => {
      const exist = prev.includes(index);
      if (exist) return prev.filter((item) => item !== index);
      return [...prev, index];
    });
  };

  return (
    <>
      <Doughnut
        ref={chartRef}
        data={chartData}
        options={options}
        key={`${chartData.datasets.length}-${isDarkMode}`}
        plugins={
          chartData.datasets.length
            ? [thicknessPlugin, contentCenterPlugin(isDarkMode)]
            : []
        }
      />
      <Row justify="center" gutter={[10, 5]}>
        {chartData.labels.map((label, index) => {
          return (
            <Col key={index}>
              <LegendDonut
                index={index}
                label={label}
                value={data.values[index]}
                onClick={onSetIndex}
                color={colors[index]}
                isDisabled={removeSet.includes(index)}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
}

function DoughnutChart({
  colors,
  data,
  width,
  header,
  height,
  loading
}: DoughnutChartRenderProps) {
  if (loading) {
    return (
      <div>
        <Skeleton active />
        <div>
          <Skeleton.Input active size="large" style={{ width: '100%' }} />
        </div>
        <div className="mt-3">
          <Skeleton.Input active style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  if (!loading && !data.values.length) {
    return (
      <Empty
        className="h-60 flex justify-center items-center"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <>
      {header}
      <WrapperStyle>
        <DoughnutRender
          data={data}
          width={width}
          height={height}
          colors={colors}
        />
      </WrapperStyle>
    </>
  );
}

export default DoughnutChart;
