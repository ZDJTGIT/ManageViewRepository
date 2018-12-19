import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Show from './steps/Show';
import Add from './steps/Add';

@Form.create()
@connect(({ monitorUser }) => ({
  monitorUser,
}))
export default class user extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0, // 当前页面 0：用户展示 1：用户新增 2：用户修改
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorUser/getUser',
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
    const { monitorUser } = this.props;
    return (
      <PageHeaderWrapper title="用户模块">
        <Card>
          {(()=>{
            switch(currentStep){
              case 0:
                return <Show users={monitorUser} toAdd={()=>{this.toAdd()}}/>;
              case 1:
                return <Add bac={()=>{this.backToIndex()}}/>;
            }
          })()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}