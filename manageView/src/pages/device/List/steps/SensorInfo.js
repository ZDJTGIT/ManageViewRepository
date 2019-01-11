import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio,Badge } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class Edit extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    const { data } = this.props;
    console.log(data);
    return(

      <div style={{textAlign:"left",fontSize:"20px",margin:"0 100px 0 30%"}}>
        <div>传感器ID：&emsp;&emsp;&emsp;&emsp;{data.sensorId}</div>
        <div>传感器编号：&emsp;&emsp;&emsp;{data.sensorNumber}</div>
        <div>传感器名称：&emsp;&emsp;&emsp;{data.sensorName}</div>
        <div>厂家：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{data.manufacturer}</div>
        <div>传感器型号：&emsp;&emsp;&emsp;{data.sensorModel}</div>
        <div>传感器地址：&emsp;&emsp;&emsp;{data.sensorAddress}</div>
        <div>传感器量程：&emsp;&emsp;&emsp;{data.sensorRange}</div>
        <div>传感器精度：&emsp;&emsp;&emsp;{data.sensorAccuracy}</div>
        <div>传感器标定系数：&emsp;{data.timingFactor}</div>
        <div>生产日期：&emsp;&emsp;&emsp;&emsp;{data.productDate}</div>
        <div>结束日期：&emsp;&emsp;&emsp;&emsp;{data.endDate}</div>
        <div>传感器状态：&emsp;&emsp;&emsp;{(_=>{switch(data.sensorStatus){
          case 1 :
            return (<span><Badge status="default" />未使用</span>);
          case 2 :
            return (<span><Badge status="success" />使用中</span>);
          case 3 :
            return (<span><Badge status="error" />已损坏</span>);
        }})()}</div>
      </div>
    )
  }
}