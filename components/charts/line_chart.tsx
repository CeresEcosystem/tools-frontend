/* eslint-disable no-unused-vars */
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
} from 'chart.js';

import { Line } from 'react-chartjs-2';

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

export default function LineChart({
  data,
  labels,
  callbackTitle,
  callbackLabel,
}: {
  data: number[] | string[];
  labels: string[];
  callbackTitle?: (tooltipItems: any) => string | void | string[];
  callbackLabel?: (context: any) => string | void | string[];
}) {
  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            backgroundColor: 'rgb(83, 41, 104)',
            callbacks: {
              title: callbackTitle
                ? (tooltipItems: any) => callbackTitle(tooltipItems)
                : () => {},
              label: callbackLabel
                ? (context: any) => callbackLabel(context)
                : () => {},
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, .1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, .1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            fill: true,
            label: 'Dataset 2',
            data,
            borderColor: 'rgb(255, 255, 255)',
            backgroundColor: 'rgb(240, 57, 140)',
            tension: 0.1,
            pointBackgroundColor: 'rgba(255, 255, 255, 0)',
            pointBorderColor: 'rgba(255, 255, 255, 0)',
            pointHoverBackgroundColor: 'rgb(255, 255, 255)',
            borderWidth: 1.3,
          },
        ],
      }}
    />
  );
}
