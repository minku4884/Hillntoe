import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

function ChartComponent() {
  const token = sessionStorage.getItem("authorizeKey");

  const fallArr = [0, 0, 0, 0, 0, 0, 0];
  const [HRArr, setHRArr] = useState([0, 0, 0, 0, 0, 0, 0]); // HR COUNT(Arr.length = 12)
  const [BRArr, setBRArr] = useState([0, 0, 0, 0, 0, 0, 0]); // BR COUNT(Arr.length = 12)
  const [chartLabel, setChartLabel] = useState([]);

  useEffect(() => {
    // 데이터 요청 함수 호출
    serchData();
  }, []);

  const serchData = async () => {
    try {
      // 1번 장치 데이터 가져오기
      const response1 = await axios.get(
        `http://api.hillntoe.com:7810/api/acqdata/section?device_id=1&acq_type=H&start_date=202309010000&end_date=202310042359`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // 2번 장치 데이터 가져오기
      const response2 = await axios.get(
        `http://api.hillntoe.com:7810/api/acqdata/section?device_id=2&acq_type=H&start_date=202309010000&end_date=202310042359`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response1?.status === 200 && response2?.status === 200) {
        console.log(response1.data);
        console.log(response2.data);

        // 데이터 합치기
        const combinedData = [...response1.data, ...response2.data];

        const timestampToFormattedDate = (timestamp) => {
          const date = new Date(timestamp * 1000);

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");

          const formattedDate = `${year}${month}${day}${hours}${minutes}`;
          return formattedDate;
        };

        const dateCountHR = {}; // 날짜별로 HR 카운트를 저장할 객체
        const dateCountBR = {}; // 날짜별로 BR 카운트를 저장할 객체

        combinedData.forEach((a) => {
          const maxBRValue = a.datas[2].max_value;
          const maxHRValue = a.datas[3].max_value;
          const date = timestampToFormattedDate(a.timestamp);
          const dateOnly = date.substring(0, 8); // 시간 정보 제외한 날짜 부분
          console.log(dateOnly, maxHRValue, maxBRValue);
          // 날짜별로 HR 카운트 초기화
          if (!dateCountHR[dateOnly]) {
            dateCountHR[dateOnly] = 0;
          }

          // 날짜별로 BR 카운트 초기화
          if (!dateCountBR[dateOnly]) {
            dateCountBR[dateOnly] = 0;
          }

          // maxHRValue가 96보다 큰 경우 HR 카운트 증가
          if (maxHRValue > 96) {
            dateCountHR[dateOnly]++;
          }

          // maxBRValue가 15보다 큰 경우 BR 카운트 증가
          if (maxBRValue > 15) {
            dateCountBR[dateOnly]++;
          }
        });

        setChartLabel(Object.keys(dateCountHR).slice(-7));
        // 각 날짜별 카운트 출력

        const myDataHRCount = Object.values(dateCountHR);
        const reverseHR = myDataHRCount.slice(-7);
        setHRArr(reverseHR);

        const myDataBRCount = Object.values(dateCountBR);
        const reverseBR = myDataBRCount.slice(-7);
        setBRArr(reverseBR);
      } else {
        throw new Error(`Failed to fetch device info`);
      }
    } catch (error) {
      console.error("Error fetching device info:", error);
    }
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "  낙상사고   ",
        data: fallArr,
        fill: false,
        borderColor: "#00de05",
        tension: 0.01,
      },
      {
        label: "  심박수   ",
        data: HRArr,
        fill: false,
        borderColor: "#d60225",
        tension: 0.01,
      },
      {
        label: "  호흡수",
        data: BRArr,
        fill: false,
        borderColor: "#0041b9",
        tension: 0.01,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        max: 15,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "회";
          },
        },
        grid: {
          borderDash: [4, 4],
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
      },
      point: {
        radius: 2.5,
      },
    },
  };

  return (
    <div style={{ width: "694px", height: "240px", margin: "auto" }}>
      <Line type="line" data={data} options={chartOptions} />
    </div>
  );
}

export default ChartComponent;