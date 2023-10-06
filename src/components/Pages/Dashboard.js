import React, { useEffect, useState } from "react";
import DeviceList from "./DeviceList";
import axios from "axios";
import ChartComponent from "./ChartComponent";
import ChartComponent2 from "./ChartComponent2";
import { Chart, registerables } from 'chart.js';
import MainContents from "./MainContents";
import './Dashboard.css'
Chart.register(...registerables);

function Dashboard() {
  return (
    <div> 
      <DeviceList/>
        <MainContents />
      <div style={{ display: 'flex', justifyContent:'center', flexWrap: 'wrap' ,marginTop:'26px',gap:'30px'}}>
        <div style={{width:782, height:292, background:'#fcfcfc',textAlign:'center',alignItems:'center', }}>
      <div className="Chart-Title" style={{  width:'100%', height:'52px', fontSize: '18.5px',display:'flex' ,padding:'17px 0px 18px 26px', }}>전체 불안정 그래프</div>
      <ChartComponent/>
      </div>
      <div style={{width:782, height:292, background:'#fcfcfc',textAlign:'center',alignItems:'center' }}>
      <div className="Chart-Title" style={{ width:'100%', height:'52px', fontSize: '18.5px', display:'flex' ,padding:'17px 0px 18px 26px'}}>평균 심박수ㆍ호흡수 추이 그래프</div>
      <ChartComponent2/>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;