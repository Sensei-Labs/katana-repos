import { formatMoney } from '@/utils/generalFormat';
import { Chart, ChartArea } from 'chart.js';
import { getDarkerColor, getLightenColor } from '@/utils/colors';

export const thicknessPlugin = {
  id: 'thickness',
  beforeDraw: function (chart: Chart) {
    const datasetMeta = chart.getDatasetMeta(0);
    const innerRadius = (datasetMeta.controller as any).innerRadius;
    const outerRadius = (datasetMeta.controller as any).outerRadius;
    const heightOfItem = outerRadius - innerRadius;

    const countOfData = chart.getDatasetMeta(0).data.length;
    const additionalRadius = Math.floor(
      heightOfItem / (countOfData === 1 ? 2 : countOfData)
    );
    const moreAdditionalRadius = additionalRadius * 0.3;

    const weightsMap = datasetMeta.data
      .map((v: any) => v.circumference)
      .sort((a: any, b: any) => a - b)
      .reduce((a: any, c: any, ci: any) => {
        a.set(c, ci + 1);
        return a;
      }, new Map());

    datasetMeta.data.forEach((dataItem: any) => {
      const weight = weightsMap.get(dataItem.circumference);
      dataItem.outerRadius =
        innerRadius + additionalRadius + moreAdditionalRadius * weight;
    });
  }
};

export const contentCenterPlugin = (isDark: boolean = true) => ({
  id: 'center-value',
  beforeDraw: function (chart: Chart) {
    const { ctx } = chart;
    const datasetMeta = chart.getDatasetMeta(0);

    ctx.font = 'bold 1.5rem sans-serif';

    const total = `$${formatMoney(
      datasetMeta.data.reduce((beforeDataItem: any, dataItem: any) => {
        return beforeDataItem + dataItem.$context.parsed;
      }, 0)
    )}`;

    const textPrincipalWidth = ctx.measureText(total).width;

    const x = (chart.chartArea.left + chart.chartArea.right) / 2;
    const y = (chart.chartArea.top + chart.chartArea.bottom) / 2;

    ctx.fillStyle = isDark ? 'white' : 'black';
    ctx.fillText(total, x - textPrincipalWidth / 2, y);

    const totalText = 'Total';
    ctx.font = 'bold 0.85rem sans-serif';
    ctx.fillStyle = '#A6A6A6';

    const textTotalWidth = ctx.measureText(totalText).width;
    ctx.fillText(totalText, x - textTotalWidth / 2, y + 25);
  }
});

function createGradient(
  ctx: CanvasRenderingContext2D,
  area: ChartArea,
  color: string
) {
  const colorStart = getDarkerColor(color, 0.2);
  const colorMid = getLightenColor(color, 0.2);
  const colorEnd = color;

  const gradient = ctx.createLinearGradient(0, 400, 1100, 0);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.6, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}

export function getBackgroundGradientColor(chart: Chart, colors: string[]) {
  const { ctx, chartArea } = chart;
  if (!chartArea) {
    // This case happens on initial chart load
    return;
  }
  console.log(colors);
  return colors.map((color) => createGradient(ctx, chartArea, color));
}
