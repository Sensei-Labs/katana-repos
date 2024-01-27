import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Col, Empty, Row, Skeleton } from 'antd';
import { Line } from 'react-chartjs-2';
import { ReactNode, useMemo, useState } from 'react';
import { WrapperStyle } from './style';
import LegendDonut from '@/Components/Atoms/Legends';
import { useDarkModeContext } from 'dark-mode-context';

const _colors = ['#0072F5', '#9750DD', '#F5A524', '#17C964', '#F31260'];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: ChartOptions<any> = (isDark: boolean = true) => ({
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
        label: (context: {
          formattedValue: string;
          dataset: { label: string };
        }) => {
          return `${context?.dataset?.label}: $${context.formattedValue}`;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        color: isDark ? 'white' : 'black'
      },
      grid: {
        display: false
      }
    },
    x: {
      ticks: {
        color: isDark ? 'white' : 'black'
      },
      grid: {
        display: false
      }
    }
  }
});

export type DataItemType = {
  values: number[];
  name: string;
};

type DataSetType = {
  label: string;
  tension: number;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

type LineChartRenderProps = {
  data: DataItemType[];
  labels: string[];
  header?: ReactNode;
  colors?: string[];
  width?: number;
  height?: number;
  loading?: boolean;
};

function LineChartRender({
  data,
  labels,
  colors = _colors
}: Omit<LineChartRenderProps, 'header'>) {
  const { isDarkMode } = useDarkModeContext();
  const [removeSet, setRemoveSet] = useState<number[]>([]);

  const transformData = useMemo(() => {
    const datasets: DataSetType[] = [];

    data.forEach((item, index) => {
      if (removeSet.includes(index)) return;
      datasets.push({
        label: item.name,
        data: item.values,
        tension: 0.3,
        backgroundColor: `${colors[index]}CC`,
        borderColor: colors[index]
      });
    });

    return {
      labels,
      datasets
    };
  }, [colors, data, labels, removeSet]);

  const onSetIndex = (index: number) => {
    setRemoveSet((prev) => {
      const exist = prev.includes(index);
      if (exist) return prev.filter((item) => item !== index);
      return [...prev, index];
    });
  };

  const labelsToRender = useMemo(() => {
    const _labels: string[] = [];

    data.forEach((label) => {
      if (_labels.includes(label.name)) return;
      _labels.push(label.name);
    });

    return _labels;
  }, [data, removeSet]);

  return (
    <>
      <Line options={options(isDarkMode)} data={transformData} />
      <Row className="mt-2" justify="center" gutter={[10, 5]}>
        {labelsToRender.map((label, index) => {
          const totalToShow = data?.[index]?.values?.reduce((a, b) => {
            return a + b;
          }, 0);

          return (
            <Col key={index}>
              <LegendDonut
                index={index}
                label={label}
                value={totalToShow}
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

function LineChart({
  colors,
  labels,
  data,
  width,
  header,
  height,
  loading
}: LineChartRenderProps) {
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

  if (!loading && !data.length) {
    return <Empty className="h-40" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      {header}
      <WrapperStyle>
        <LineChartRender
          data={data}
          width={width}
          labels={labels}
          height={height}
          colors={colors}
        />
      </WrapperStyle>
    </>
  );
}

export default LineChart;
