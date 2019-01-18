import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio,Badge } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({ sysCode }) => ({
  sysCode
}))
export default class Edit extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    const { data,sysCode } = this.props;
    let parserMethod = "解析错误";
    sysCode.parserMethods.map(v=>{
      if(v.scId==data.parserMethod){
        parserMethod = v.itemName;
      }
    })
    return(

      <div style={{textAlign:"left",fontSize:"20px",margin:"0 100px 0 25%"}}>
        <div>绑定ID：&emsp;&emsp;&emsp;&emsp;&emsp;{data.dcId}</div>
        <div>终端编号：&emsp;&emsp;&emsp;&emsp;{data.terminalNumber}</div>
        <div>终端采集频率：&emsp;&emsp;{data.collectionFrequency}</div>
        <div>终端通道：&emsp;&emsp;&emsp;&emsp;{data.terminalChannel}</div>
        <div>传感器编号：&emsp;&emsp;&emsp;{data.sensorNumber}</div>
        <div>传感器地址：&emsp;&emsp;&emsp;{data.sensorAddress}</div>
        <div>传感器标定系数K：&nbsp;{data.timingFactor}</div>
        <div>解析方式：&emsp;&emsp;&emsp;&emsp;{parserMethod}</div>
        <div>测点编号：&emsp;&emsp;&emsp;&emsp;{data.monitorPointNumber}</div>
        <div>监测类型：&emsp;&emsp;&emsp;&emsp;{data.monitorType}</div>
        <div>状态：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{(_=>{switch(data.status){
          case true :
            return (<span><Badge status="success" />启用</span>);
          case false :
            return (<span><Badge status="default" />禁用</span>);
        }})()}</div>
      </div>
    )
  }
}