import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal,Select, } from 'antd';

@connect(({subwayGlobal})=>({
  subwayGlobal
}))
export default class ChooseSec extends Component{
  constructor(props){
    super(props);
    this.state={
      
    }
  }

  componentWillMount(){
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'subwaySector/getSectors',
    // })
  }
  handleChange=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'subwayGlobal/setChoosedSector',
      payload: {sectorId:value},
      callback:v=>{
        
      }
      
    })
  }

  render(){
    const { subwayGlobal } = this.props;
    return (
      <Modal 
        visible={true}
        style={{textAlign:'center'}}
      >
        <Select 
          style={{width:'50%'}}
          showSearch
          optionFilterProp="children"
          onChange={this.handleChange}
        >
          <Option key="1" value={1}>xx区间</Option>
        </Select>
      </Modal>   
    );
  }
}