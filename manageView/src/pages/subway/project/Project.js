import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './steps/Add';
import Show from './steps/Show';


export default class Project extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0 // 当前页数
    }
  }

  // componentWillMount(){
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'monitorProject/getProjects',
  //   })
  // }

  toAdd=()=>{
    this.setState({currentStep:1});
  }

  backToIndex=()=>{
    this.setState({currentStep:0});
  }

  render(){
    const { currentStep } = this.state;
    const { monitorProject } = this.props;
    return (
      <PageHeaderWrapper title="项目模块">
        <Card>
          {
            (()=>{
              switch(currentStep){
                case 0:
                  return <Show />;
                case 1:
                  return <Add bac={()=>{this.backToIndex()}}/>;
              }
            })()
          }
        </Card>
      </PageHeaderWrapper>
    );
  }
}