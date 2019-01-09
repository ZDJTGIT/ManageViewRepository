import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './steps/Add';
import Show from './steps/Show';
// import Add from './steps/Add';

@connect(({subwayGlobal})=>({
  subwayGlobal
}))
export default class MonitorPoint extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0 // 当前页数
    }
  }

  componentWillMount(){
    
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'subwaySector/getSectors',
    // })
  }

  toAdd=()=>{
    this.setState({currentStep:1});
  }

  backToIndex=()=>{
    this.setState({currentStep:0});
  }

  render(){
    const { currentStep } = this.state;
    const { monitorProject,subwaySector } = this.props;
    const { subwayGlobal } = this.props;
    return (
      <PageHeaderWrapper title="项目模块">
        <Card>
          {
            (()=>{
              switch(currentStep){
                case 0:
                  return <Show sectors={null} toAdd={()=>{this.toAdd()}}/>;
                case 1:
                  // return <Add bac={()=>{this.backToIndex()}}/>;
              }
            })()
          }
        </Card>
      </PageHeaderWrapper>
    );
  }
}