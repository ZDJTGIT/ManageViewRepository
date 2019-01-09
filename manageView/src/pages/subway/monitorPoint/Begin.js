import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Steps,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Add from './steps/Add';
// import Show from './steps/Show';
// import Add from './steps/Add';
import MonitorPoint from './MonitorPoint';
import ChooseSec from '../ChooseSec';

@connect(({subwayGlobal})=>({
  subwayGlobal
}))
export default class Begin extends Component{
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

  render(){
    const { currentStep } = this.state;
    const { monitorProject,subwayGlobal } = this.props;
    return (
      <div>
        {(()=>{
          if(subwayGlobal.choosedSector>0){
            return <MonitorPoint />;
          }else{
            return <ChooseSec />;
          }
        })()}
      </div>
    );
  }
}