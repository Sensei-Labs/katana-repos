import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ReactNode, useMemo } from 'react';
import getGradient from '@/utils/getGradient';
import { WrapperStyle } from './style';

const _colors = ['#6CE5E8', '#9750DD', '#F5A524', '#17C964', '#F31260'];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options: ChartOptions<any> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'white'
      }
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      ticks: {
        color: 'white'
      },
      grid: {
        display: false
      }
    },
    x: {
      ticks: {
        color: 'white'
      },
      grid: {
        display: false
      }
    }
  }
};

type DataItemType = {
  values: number[];
  name: string;
};

type DataSetType = {
  fill: boolean;
  label: string;
  tension: number;
  data: number[];
  borderColor: string;
  backgroundColor: string | ((context: any) => any);
};

type LineAreaChartRenderProps = BaseComponent & {
  data: DataItemType[];
  labels: string[];
  header?: ReactNode;
  colors?: string[];
  width?: number;
  height?: number;
};

function LineAreaChartRender({
  data,
  labels,
  colors = _colors
}: Omit<LineAreaChartRenderProps, 'header'>) {
  const transformData = useMemo(() => {
    const datasets: DataSetType[] = [];

    data.forEach((item, index) => {
      datasets.push({
        fill: true,
        label: item.name,
        data: item.values,
        tension: 0.3,
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(
            ctx,
            chartArea,
            `${colors[index]}00`,
            `${colors[index]}CC`
          );
        },
        borderColor: colors[index]
      });
    });

    return {
      labels,
      datasets
    };
  }, [colors, data, labels]);

  return <Line options={options} data={transformData} />;
}

function LineAreaChart({
  colors,
  labels,
  data,
  width,
  header,
  height,
  ...rest
}: LineAreaChartRenderProps) {
  return (
    <>
      {header && <div className="mb-5">{header}</div>}
      <WrapperStyle {...rest}>
        <LineAreaChartRender
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

export default LineAreaChart;
