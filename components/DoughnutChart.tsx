"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const accountNames = accounts.map((a) => a.bank_name || a.name || 'Ethiopian Bank');
  const balances = accounts.map((a) => a.balance || a.currentBalance || 0);

  // Ethiopian flag colors for the chart
  const ethiopianColors = [
    '#009639', // Green
    '#FFCD00', // Yellow
    '#DA020E', // Red
    '#0F47AF', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
  ];

  const data = {
    datasets: [
      {
        label: 'Ethiopian Banks (ETB)',
        data: balances,
        backgroundColor: ethiopianColors.slice(0, accounts.length),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff',
      }
    ],
    labels: accountNames
  }

  return <Doughnut
    data={data}
    options={{
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#009639',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.label}: ETB ${context.parsed.toLocaleString()}`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1000
      }
    }}
  />
}

export default DoughnutChart