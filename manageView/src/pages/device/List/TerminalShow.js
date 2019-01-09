import React, { Component } from 'react';
import { Card, Row, Col, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const Option = Select.Option;


export default class TerminalShow extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  
  render() {
    const a = this.props.location.pathname;
    console.log(a.substring(a.lastIndexOf('/') + 1));
    const survey =_=> {
      return(
        <div style={{height:30}}>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
      )
    }
    return (
      <PageHeaderWrapper >
        
        <Row type='flex' justify='center' gutter='20'>
          <Col span={11}>
            <Card title="设备概况" style={{ borderRadius: '8px' }} extra={survey()}>123123</Card>
          </Col>

          <Col span={11}>
            <Card title="所属用户" style={{ borderRadius: '8px' }} extra={<div style={{height:30}}></div>}>123123</Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    )
  }
}