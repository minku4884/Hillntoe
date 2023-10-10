import { useEffect } from "react";
import axios from "axios";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import Select from 'react-select'


function ChartComponent2() {
  const token = sessionStorage.getItem("authorizeKey");

  const [HRArr, setHRArr] = useState([60, 70, 40, 50, 60, 70, 0]); // HR COUNT(Arr.length = 12)
  const [BRArr, setBRArr] = useState([20, 10, 20, 10, 10, 10, 0]); // BR COUNT(Arr.length = 12)
  const [chartLabel, setChartLabel] = useState([]);
  const [AvgHRData,setAvgHRDate] = useState([]);
  const [AvgBRData,setAvgBRData] = useState([]);




  const HRBRData = () => {
    axios.get(`http://api.hillntoe.com:7810/api/acqdata/count?device_id=1&acq_type=D&count=7`,{headers:{Authorization:token}})
    .then((response)=>{
      const data = response.data
      data.map((value,index)=>{
        AvgHRData.push(value.datas[2].max_value)
      })
      data.map((value,index)=>{
        AvgBRData.push(value.datas[3].max_value)
      })        
    })
    .catch((error)=>{console.error(error)})
  }


  // 차트 Label  function
  const LabelArrayData = () => {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), 9, 2);
    const startDate = new Date(today.getFullYear(), 9, 8);
  
    const dateArray = [];
  
    for (let date = startDate; date >= endDate; date.setDate(date.getDate() - 1)) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedDate = `${month}월${day}일`;
      dateArray.push(formattedDate);
    }
  
    const dateArraysort = dateArray.reverse();
    setChartLabel(dateArraysort);
  }
  HRBRData(); 


  useEffect(() => {
    LabelArrayData();
  }, []); 

 
  console.log(AvgHRData)
  console.log(AvgBRData)




  let data = {
    labels: chartLabel,
    datasets: [
      {
        label: "심박수",
        data: AvgHRData,
        fill: false,
        borderColor: "#d60225",
        tension: 0.01,
      },
      {
        label: "호흡수",
        data: AvgBRData,
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

  const options = [
    { value: '7days', label: '7days' },
    { value: '30days', label: '30days' },
    ]




  return (
    <div style={{ width: "694px", height: "240px", margin: "auto" }}>
      <Line data={data} options={chartOptions} />
    </div>
  );
}

export default ChartComponent2;
