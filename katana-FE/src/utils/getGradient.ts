let width: number;
let height: number;
let gradient: any;

export default function getGradient(
  ctx: CanvasRenderingContext2D,
  chartArea: any,
  firstColor: string,
  secondColor: string
) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(0.5, secondColor);
  }

  return gradient;
}
