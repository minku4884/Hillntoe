import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MainContents.css";
import { Doughnut } from "react-chartjs-2";
import basicbox from "/HillnToe/hillntoe/src/asset/basicbox.png";
import basicboxColor from "/HillnToe/hillntoe/src/asset/basicboxColor.png";
import cautionbox from "/HillnToe/hillntoe/src/asset/cautionbox.png";
import cautionboxColor from "/HillnToe/hillntoe/src/asset/cautionboxColor.png";
import dangerbox from "/HillnToe/hillntoe/src/asset/dangerbox.png";
import dangerboxColor from "/HillnToe/hillntoe/src/asset/dangerboxColor.png";
import stablebox from "/HillnToe/hillntoe/src/asset/stablebox.png";
import stableboxColor from "/HillnToe/hillntoe/src/asset/stableboxColor.png";

function MainContents({ totalSleepTime }) {
  const [toiletData, setToiletData] = useState([]);
  const [alarmInfo, setAlarmInfo] = useState([]);
  const [timestamp, setTimestamp] = useState(0);
  const [usageTime, setUsageTime] = useState(0); // 화장실 이용 시간 추가

  const convertTimestampToFormattedDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedDate = `${year} ${formattedMonth}.${formattedDay} ${formattedHours}:${formattedMinutes}`;
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("authorizeKey");
      try {
        const [timestampResponse, alarmInfoResponse] = await Promise.all([
          axios.get(
            `http://api.hillntoe.com:7810/api/timestamp/tostring?timestamp=${timestamp}`,
            {
              headers: { Authorization: token },
            }
          ),
          axios.get("http://api.hillntoe.com:7810/api/alarm/info", {
            headers: { Authorization: token },
          }),
        ]);

        if (timestampResponse?.status === 200) {
        } else {
          throw new Error(
            `Failed to fetch timestamp info (${timestampResponse?.status})`
          );
        }

        if (alarmInfoResponse?.status === 200) {
          const alarmData = alarmInfoResponse.data;
          setAlarmInfo(alarmData.map((item) => item));
        } else {
          throw Error(
            `Failed to fetch alarm info (${alarmInfoResponse?.status})`
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timestamp]);

  // const clickDeviceHandler = async () => {
  //   const token = sessionStorage.getItem("authorizeKey");
  //   try {
  //     const response = await axios.get(
  //       `http://192.168.0.78:7810/api/acqdata/lastest?device_id=1`,
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );

  //     if (response?.status === 200) {
  //       // console.log(response.data[0].datas[4].data_value);
  //       const data1 = response.data[0].datas[4].data_value
  //         .split(":")[1]
  //         .split("_")[0]
  //         .split(",")[0];

  //       if (data1 === "MOVING" || data1 === "READY" || data1 === "MEASURE") {
  //         updateUsageTime();
  //       }
  //     } else {
  //       throw new Error(`Failed to fetch device data (${response?.status})`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching device data:", error);
  //   }
  // };
  // clickDeviceHandler();

  const minutes = totalSleepTime ? totalSleepTime.split(" ")[1] : "";
  const percentage = minutes ? (minutes / (9 * 60)) * 100 : 0;

  const deviceValues = toiletData.map((data) => {
    return data.datas && data.datas[4] ? data.datas[4].data_value : "";
  });

  const splitValues = deviceValues
    .filter((value) => value !== "")
    .map((data) => {
      return data.split(":")[1].split("_")[0].split(",")[0];
    });

  const sleepData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#007BFF", "#d2e6fa"],
        borderWidth: 0,
      },
    ],
  };

  const toiletData1 = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#007BFF", "#dbfec6"],
        borderWidth: 0,
      },
    ],
  };

  const toiletData2 = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#007BFF", "#f8f8f8"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    rotation: -90,
    circumference: 360,
    tooltips: { enabled: false },
    hover: { mode: null },
    legend: { display: false },
    maintainAspectRatio: true,
    responsive: true,
    plugins: {},
    layout: {
      padding: 0, // 여백을 0으로 설정합니다.
    },
  };

  return (
    <div className="content-container">
      <div className="content-box">
        {/* 첫 번째 content-main 섹션 */}
        <div className="content-main" style={{ width: "498px" }}>
          <div className="header-container">재실 감지 패턴</div>
          <div className="main-container">
            <div className="main-time main-time2">
              <div style={{ marginRight: "125px" }}>
                <div style={{ fontSize: "14px" }}>화장실 평균 이용시간</div>
                <div>1시간 58분</div>
                <div style={{ fontSize: "14px", marginTop: "31px" }}>
                  1회 평균 이용시간
                </div>
                <div>
                  {Math.floor(usageTime / 60)}분 {usageTime % 60}초
                </div>
              </div>
            </div>
            <div className="main-chart">
              <Doughnut data={toiletData1} options={options} />
            </div>
          </div>
          <div className="main-danger">
            수면 위험도
            <div>
              <img src={stablebox} alt="stable" />
              <img src={basicboxColor} alt="basic" />
              <img src={cautionbox} alt="caution" />
              <img src={dangerbox} alt="danger" />
            </div>
          </div>
        </div>

        {/* 두 번째 content-main 섹션 */}
        <div className="content-main" style={{ width: "498px" }}>
          <div className="header-container">수면 패턴 감지</div>
          <div className="main-container">
            <div className="main-time main-time1">
              <div style={{}}>
                <span
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    marginRight: "33px",
                  }}
                >
                  잠든 시간
                </span>
                24:00
              </div>
              <span></span>
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    marginRight: "92px",
                  }}
                >
                  일어난 시간
                </span>{" "}
                09:00
              </div>
            </div>
            <div className="main-chart">
              <Doughnut data={sleepData} options={options} />
            </div>
          </div>
          <div className="main-danger">
            <div className="main-danger-title">수면 위험도</div>
            <div>
              <img src={stableboxColor} alt="stable" />
              <img src={basicbox} alt="basic" />
              <img src={cautionbox} alt="caution" />
              <img src={dangerbox} alt="danger" />
            </div>
          </div>
        </div>

        {/* 세 번째 content-main 섹션 */}
        <div className="content-main">
          <div className="header-container">최근 알람</div>
          <div className="main-recent-alarm">
            {alarmInfo.map((alarm, index) => (
              <div className="main-alarm" key={index}>
                <span style={{ marginRight: "10px" }}>
                  [{convertTimestampToFormattedDate(alarm.alarm_timestamp)}]
                </span>
                <span style={{ marginRight: "10px" }}>{alarm.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContents;
