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
    return(

      <div style={{textAlign:"left",fontSize:"20px",margin:"0 100px 0 30%"}}>
        <div>终端ID：&emsp;&emsp;{data.terminalId}</div>
        <div>终端编号：&emsp;{data.terminalNumber}</div>
        <div>终端名称：&emsp;{data.terminalName}</div>
        <div>厂商：&emsp;&emsp;&emsp;{data.manufacturer}</div>
        <div>终端型号：&emsp;{data.terminalModel}</div>
        <div>额定电压：&emsp;{data.voltage}</div>
        <div>终端通道：&emsp;{data.channelNumber}</div>
        <div>采集频率：&emsp;{data.collectionFrequency}</div>
        <div>生产日期：&emsp;{data.productDate}</div>
        <div>有效日期：&emsp;{data.endDate}</div>
        <div>终端状态：&emsp;{(_=>{switch(data.terminalStatus){
          case 1 :
            return (<span><Badge status="default" />未使用</span>);
          case 2 :
            return (<span><Badge status="success" />已上线</span>);
          case 3 :
            return (<span><Badge status="warning" />离线中</span>);
          case 4 :
            return (<span><Badge status="error" />已损坏</span>);
        }})()}</div>
      </div>
    )
  }
}