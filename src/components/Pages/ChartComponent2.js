import { useTheme } from "@emotion/react";
import axios from "axios";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";

function ChartComponent2() {
  const token = sessionStorage.getItem("authorizeKey");

  const [HRArr, setHRArr] = useState([0, 0, 0, 0, 0, 0, 0]); // HR COUNT(Arr.length = 12)
  const [BRArr, setBRArr] = useState([0, 0, 0, 0, 0, 0, 0]); // BR COUNT(Arr.length = 12)
  const [chartLabel,setChartLabel] = useState([1,2,3,4,5,6,7])

  


















  
  let data = {
    labels: null,
    datasets: [
      {
        label: "심박수",
        data: HRArr,
        fill: false,
        borderColor: "#d60225",
        tension: 0.01,
      },
      {
        label: "호흡수",
        data: BRArr,
        fill: false,
        borderColor: "#0041b9",
        tension: 0.01,
        yAxisID: "y2", // y2 축에 연결하기 위해 yAxisID 추가
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        grid: {
          display: false, // x축 그리드 라인 숨기기
        },
      },
      y: {
        beginAtZero: true,
        min: 40,
        max: 160,
        ticks: {
          callback: function (value) {
            return value + "bpm";
          },
        },
        grid: {
          borderDash: [4, 4], // y축 점선 스타일 설정
        },
      },
      y2: {
        beginAtZero: true,
        min: 0,
        max: 30, // 수정: BRArr 데이터의 최대값을 고려하여 적절한 값으로 변경
        position: "right",
        ticks: {
          callback: function (value) {
            return value + "bpm";
          },
        },
        grid: {
          display: false, // y2 축 그리드 라인 숨기기
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#191919",
          boxHeight: 1,
          boxWidth: 20,
          font: {
            weight: "bold",
            size: 13.5,
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.1, // 수정: 뾰족한 그래프를 만들기 위해 tension 조정
      },
      point: {
        radius: 2.5,
      },
    },
  };

  return (
    <div style={{ width: "694px", height: "240px", margin: "auto" }}>
      <Line data={data} options={chartOptions} />
    </div>
  );
}

export default ChartComponent2;
