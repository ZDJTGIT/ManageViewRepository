import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './steps/Add';
import Show from './steps/Show';

@connect(({taskList})=>({
  taskList,
}))
export default class TaskList extends Component{
  constructor(props){
    super(props);
    this.state={
      currentStep:0 // 当前页数
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'taskList/getAllTasks',
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
    const { monitorProject,taskList} = this.props;
    return (
      <PageHeaderWrapper>
        {
          (()=>{
            switch(currentStep){
              case 0:
                return <Show toAdd={()=>{this.toAdd()}} tasks={taskList.tasks}/>;
              // case 1:
              //   return <Add bac={()=>{this.backToIndex()}}/>;
            }
          })()
        }
      </PageHeaderWrapper>
    );
  }
}