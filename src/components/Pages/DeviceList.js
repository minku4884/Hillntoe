import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/DeviceList.css";
import HRImg from "/HillnToe/hillntoe/src/asset/HRImg.png";
import BRImg from "/HillnToe/hillntoe/src/asset/BRImg.png";
import DisableImg from "/HillnToe/hillntoe/src/asset/DisabledDevice.png";
import MovingImg from "/HillnToe/hillntoe/src/asset/MovingImg.png";
import ReadyImg from "/HillnToe/hillntoe/src/asset/ReadyImg.png";
import FV_Status_0 from "/HillnToe/hillntoe/src/asset/FV_Status_0.png"
import FV_Status_1 from "/HillnToe/hillntoe/src/asset/FV_Status_1.png"
import FV_Fall from "/HillnToe/hillntoe/src/asset/FV_Fall.png"
import FV_Edge from "/HillnToe/hillntoe/src/asset/FV_Edge.png"
import CV_Status_0 from "/HillnToe/hillntoe/src/asset/CV_Status_0.png"
import CV_Status_1 from "/HillnToe/hillntoe/src/asset/CV_Status_1.png"
import CV_Fall from "/HillnToe/hillntoe/src/asset/CV_Fall.png"

function DeviceList() {
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deviceType, setDeviceType] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [stateImg, setStateImg] = useState(null);
  const [FVHRData, setFVHRData] = useState(null);
  const [FVBRData, setFVBRData] = useState(null);
  const [FVStateImg,setFVStateImg] = useState(CV_Status_1)
  const token = sessionStorage.getItem("authorizeKey");

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await axios.get(
          "http://api.hillntoe.com:7810/api/config/device/info",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response?.status === 200) {
          setDeviceInfo(response.data);
        } else {
          throw new Error(`Failed to fetch device info (${response?.status})`);
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  const clickDeviceHandler = async (deviceId) => {
    setSelectedDevice(deviceId)
    setTimeout(() => {
    setShowModal(true);
      
    }, 600);

    try {
      const response = await axios.get(
        `http://api.hillntoe.com:7810/api/acqdata/lastest?device_id=${deviceId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const response2 = await axios.get(
        `http://api.hillntoe.com:7810/api/config/device/info?device_id=${deviceId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setDeviceType(response2.data[0].device_type);

      if (response?.status === 200) {
        const selectedDeviceInfo = response.data.find(
          (device) => device.device_id === deviceId
        );
        setDeviceData(selectedDeviceInfo.datas);
      } else {
        throw new Error(`Failed to fetch device data (${response?.status})`);
      }
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };

  useEffect(() => {
    if (deviceData.length > 0) {
      const deviceDataStatus = deviceData[deviceData.length - 1].data_value;

      if(deviceType === 14201){
        if(deviceDataStatus.includes("VITAL") && deviceDataStatus.includes("CENTER") == true ){
          setFVStateImg(FV_Status_1)
        } else if (deviceDataStatus.includes("VITAL") && deviceDataStatus.includes("EDGE")) {
          setFVStateImg(FV_Edge)
  
        } else if (deviceDataStatus.includes("DROP" == true)) {
          setFVStateImg(FV_Fall)
  
        } else {
          setFVStateImg(FV_Status_0)
        }
      } else if(deviceType == 14101) {
        if(deviceType === 14101){
          if(deviceDataStatus.includes("READY") == true ){
            setFVStateImg(CV_Status_1)
          } else if (deviceDataStatus.includes("FALL" == true)) {
            setFVStateImg(CV_Fall)
    
          } else {
            setFVStateImg(CV_Status_0)
          }
      }}









      if (deviceDataStatus.includes("VITAL") === true) {
        setStateImg(<img src={ReadyImg} alt="ReadyImg" />);
        setFVHRData(
          deviceDataStatus
            .split(",")
            [deviceDataStatus.split(",").length - 1]?.replace("+", "")
        );
        setFVBRData(
          deviceDataStatus
            .split(",")
            [deviceDataStatus.split(",").length - 3]?.replace("+", "")
        );
      } else if (deviceDataStatus.includes("MOVING")) {
        setStateImg(<img src={MovingImg} alt="MovingImg" />);
        setFVHRData("--:--");
        setFVBRData("--:--");
      } else {
        setStateImg(<img src={DisableImg} alt="DisableImg" />);
        setFVHRData("--:--");
        setFVBRData("--:--");
      }
    }
  }, [deviceData]);


  // 장치 목록의 device_id 배열 생성
  const deviceIds = deviceInfo.map((device) => device.device_id);
  const errorDeviceCount = deviceInfo.reduce((count, error) => {
    if (error.is_enabled === 1) {
      return count + 1;
    }
    return count;
  }, 0);
  const renderDeviceRectangles = () => {
    if (deviceIds.length === 0) {
      return (
<div style={{fontSize: "19px", fontWeight:500, textAlign: "center",margin:'90px 0px 0px 400px'}}>
  등록된 장치가 없습니다
</div>
      );
    }
    return deviceIds.map((deviceId, index) => (
      <div
        className="device-rectangle"
        key={deviceId}
        onClick={() => clickDeviceHandler(deviceId)}
        style={{
          width: "76px",
          height: "76px",
          backgroundColor: `${
            deviceInfo[index].is_enabled === 1 ? "#d2e6fa" : "#d60225"
          }`,
          borderRadius: "9px",
          cursor: "pointer",
          textAlign: "center",
          justifyContent: "center",
          lineHeight: "76px",
          fontWeight: "bold",
          position: "relative",
          color: `${
            deviceInfo[index].is_enabled === 1 ? "#191919" : "#ffffff"
          }`,
          overflow: "hidden",
          margin: "9px",
        }}
      >
        {" "}
        {deviceInfo[index].device_name}
      </div>
    ));
  };
  return (
    <div className="MainContents">
      <Container fluid style={{ marginLeft: 0, padding: 0 }}>
        <Row style={{ marginLeft: "30px" }}>
          <div
            style={{
              width: "1028px",
              height: "276px",
              padding: "0px",
              marginTop: "26px",
              background: "#ffffff",
            }}
          >
            <h6
              style={{
                fontWeight: "bold",
                fontSize: "18.5px",
                background: "#ffffff",
                padding: "11px 0px 0px 20px",
                width: "100%",
                height: "8%",
              }}
            >
              장치 목록
            </h6>
            <div
              className="device-rectangle-container"
              style={{
                background: "#fff",
                width: "95%",
                height: "76%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                marginLeft: "30px",
                paddingTop: "10px",
                overflowY: "auto",
              }}
            >
              <div
                className="device-rectangle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  
                }}
              >
                {renderDeviceRectangles()}
                {/* 초록색 사각형 */}
              </div>
            </div>
          </div>

          <div
            style={{
              width: "536px",
              margin: "26px 31px 0px 32px",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18.5px",
                margin: "11px 0px 10px 10px  ",
              }}
            >
              장치 정보
            </div>
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: "20px 0px",
                  borderBottom: "1px solid #ededed",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#ededed",
                    margin: "0px 0px 0px 58px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  style={{
                    marginLeft: "94px",
                    fontWeight: "500",
                    fontSize: "18px",
                  }}
                >
                  전체 장치 수
                </div>
                <div
                  style={{
                    marginLeft: "160px",
                    fontWeight: "500",
                    fontSize: "19px",
                  }}
                >
                  {deviceIds.length} 개
                </div>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: "20px 0px",
                  borderBottom: "1px solid #ededed",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#d2e6fa",
                    margin: "0px 0px 0px 58px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  style={{
                    marginLeft: "94px",
                    fontWeight: "500",
                    fontSize: "18px",
                  }}
                >
                  정상 장치 수
                </div>
                <div
                  style={{
                    marginLeft: "160px",
                    fontWeight: "500",
                    fontSize: "19px",
                  }}
                >
                  {errorDeviceCount} 개
                </div>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: "20px 0px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#d60225",
                    margin: "0px 0px 0px 58px",
                    borderRadius: "4px",
                  }}
                ></div>
                <div
                  style={{
                    marginLeft: "94px",
                    fontWeight: "500",
                    fontSize: "18px",
                  }}
                >
                  불량 장치 수
                </div>
                <div
                  style={{
                    marginLeft: "160px",
                    fontWeight: "500",
                    fontSize: "19px",
                  }}
                >
                  {deviceIds.length - errorDeviceCount} 개
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
      {/* 모달 */}
      <Modal
        style={{ borderRadius: "10px" }}
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <div className="header-title">장치 정보</div>
        </Modal.Header>
        <Modal.Body>
          <div className="Modal-container">
            <div className="deviceImg">
              <img src={FVStateImg} alt="deviceModal" />
            </div>

            <div className="deviceInfo">
              <h4>
                {
                  deviceInfo.find(
                    (device) => device.device_id === selectedDevice
                  )?.device_name
                }
              </h4>

              {deviceType === 14101 && (
                <>
                  {/* CV MAIN */}
                  {/* CV TITLE */}
                  <h5>HRS_R8A_E_CV</h5>
                  {/* CV STATE IMG */}
                  <div className="STATE-container">
                    {deviceData.length > 0 ? (
                      deviceData[deviceData.length - 1]?.data_value
                        .split(":")[1]
                        ?.split("_")[0]
                        ?.split(",")[0] === "READY" ? (
                        <img
                          src={ReadyImg}
                          alt="ReadyImg"
                          className="readyimage"
                        />
                      ) : deviceData[deviceData.length - 1].data_value
                          .split(":")[1]
                          .split("_")[0]
                          .split(",")[0] === "MOVING" ? (
                        <img
                          src={MovingImg}
                          alt="MovingImg"
                          className="movingimage"
                        />
                      ) : (
                        <img
                          src={DisableImg}
                          alt="DisableImg"
                          className="disableimage"
                        />
                      )
                    ) : null}
                  </div>
                  {/* CV HRBR-CONTAINER */}
                  {deviceData && deviceData.length > 0 && (
                    <div className="HR-BR-container">
                      <div className="HR-container">
                        <img src={HRImg} alt="HRImage" className="HRimage" />
                        <span>
                          {deviceData[deviceData.length - 1]?.data_value
                            .split(":")[1]
                            ?.split("_")[0]
                            ?.split(",")[0] === "READY"
                            ? deviceData[deviceData.length - 1]?.data_value
                                .split(",")
                                [
                                  deviceData[
                                    deviceData.length - 1
                                  ]?.data_value.split(",").length - 1
                                ]?.replace("+", "")
                            : " --.--"}
                        </span>
                        <span className="bpm-title">BPM</span>
                      </div>

                      <div className="BR-container">
                        <img src={BRImg} alt="BRImage" className="BRimage" />
                        <span>
                          {deviceData[deviceData.length - 1]?.data_value
                            .split(":")[1]
                            ?.split("_")[0]
                            ?.split(",")[0] === "READY"
                            ? deviceData[deviceData.length - 1]?.data_value
                                .split(":")[1]
                                ?.split(",")[9]
                                ?.replace("+", "")
                            : " --.--"}
                        </span>
                        <span className="bpm-title">BPM</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {deviceType === 14201 && (
                <>
                  {/* FV */}
                  {/* FV MAIN */}
                  {/* FV TITLE */}
                  <h5>HRS_R8A_E_FV</h5>
                  {/* FV STATE IMG */}
                  <div className="STATE-container">{stateImg}</div>
                  {/* FV HRBR-CONTAINER */}
                  {deviceData && deviceData.length > 0 && (
                    <div className="HR-BR-container">
                      <div className="HR-container">
                        <img src={HRImg} alt="HRImage" className="HRimage" />
                        <span>{FVHRData}</span>
                        <span className="bpm-title">BPM</span>
                      </div>

                      <div className="BR-container">
                        <img src={BRImg} alt="BRImage" className="BRimage" />
                        <span>{FVBRData}</span>
                        <span className="bpm-title">BPM</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button className="closeBtn" onClick={() => setShowModal(false)}>
                닫기
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DeviceList;
