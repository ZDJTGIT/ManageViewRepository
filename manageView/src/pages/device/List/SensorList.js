import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './steps/Add';
import SensorShow from './steps/SensorShow';

@connect(({deviceList})=>({
  deviceList,
}))
export default class SensorList extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0 // 当前页数
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/getAllSensors',
    })
  }

  toAdd=()=>{
    this.setState({currentStep:1});
  }

  backToIndex=()=>{
    this.setState({currentStep:0});
  }

  render(){
    const { currentStep } = this.state;
    const { monitorProject,deviceList} = this.props;
    return (
      <PageHeaderWrapper>
        {
          (()=>{
            switch(currentStep){
              case 0:
                return <SensorShow toAdd={()=>{this.toAdd()}} devices={deviceList.sensors}/>;
              // case 1:
              //   return <Add bac={()=>{this.backToIndex()}}/>;
            }
          })()
        }
      </PageHeaderWrapper>
    );
  }
}