import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

function ChartComponent() {
  const token = sessionStorage.getItem("authorizeKey");

  const fallArr = [0, 0, 0, 0, 0, 0, 0];
  const [HRArr, setHRArr] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [BRArr, setBRArr] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [chartLabel, setChartLabel] = useState([]);
  const [yMaxValue, setYMaxValue] = useState(0);

  useEffect(() => {
    // 데이터 요청 함수 호출
    searchData();
  }, []);

  const searchData = () => {
    // 1번 장치 데이터 가져오기
    axios
      .get(
        `http://api.hillntoe.com:7810/api/acqdata/section?device_id=1&acq_type=H&start_date=202309010000&end_date=202310042359`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response1) => {
        // 2번 장치 데이터 가져오기
        axios
          .get(
            `http://api.hillntoe.com:7810/api/acqdata/section?device_id=2&acq_type=H&start_date=202309010000&end_date=202310042359`,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((response2) => {
            if (response1.status === 200 && response2.status === 200) {
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

              const dateCountHR = {};
              const dateCountBR = {};
              combinedData.forEach((a) => {
                const maxBRValue = a.datas[2].max_value;
                const maxHRValue = a.datas[3].max_value;
                const date = timestampToFormattedDate(a.timestamp);
                const dateOnly = date.substring(0, 8);

                if (!dateCountHR[dateOnly]) {
                  dateCountHR[dateOnly] = 0;
                }

                if (!dateCountBR[dateOnly]) {
                  dateCountBR[dateOnly] = 0;
                }

                if (maxHRValue > 96) {
                  dateCountHR[dateOnly]++;
                }

                if (maxBRValue > 15) {
                  dateCountBR[dateOnly]++;
                }
              });

              const today = new Date();
              const endDate = new Date(today.getFullYear(), 9, 2);
              const startDate = new Date(today.getFullYear(), 9, 8);

              const dateArray = [];

              for (
                let date = startDate;
                date >= endDate;
                date.setDate(date.getDate() - 1)
              ) {
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const formattedDate = `${month}월${day}일`;
                dateArray.push(formattedDate);
              }

              const dateArraySort = dateArray.reverse();
              setChartLabel(dateArraySort);

              const myDataHRCount = Object.values(dateCountHR);
              const reverseHR = myDataHRCount.slice(-7);
              setHRArr(reverseHR);

              const myDataBRCount = Object.values(dateCountBR);
              const reverseBR = myDataBRCount.slice(-7);
              setBRArr(reverseBR);

              // yMaxValue 설정
              const maxValue = Math.max(...reverseHR, ...reverseBR);
              setYMaxValue(Math.floor(maxValue*1.4));
            } else {
              throw new Error(`Failed to fetch device info`);
            }
          })
          .catch((error2) => {
            console.error("Error fetching device info 2:", error2);
          });
      })
      .catch((error1) => {
        console.error("Error fetching device info 1:", error1);
      });
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
        max: yMaxValue,
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