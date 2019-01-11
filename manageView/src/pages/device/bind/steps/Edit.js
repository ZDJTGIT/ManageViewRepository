import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ deviceList }) => ({
  deviceList,
}))
export default class Edit extends Component{
  constructor(props){
    super(props);
    this.state={
      terminal:[],
      sensor:[],
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/getAllTerminals',
    });
    dispatch({
      type: 'deviceList/getAllSensors',
    });
  }

  submit=()=>{
    const { form,dispatch,editData,closeEdit } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        dispatch({
          type: 'deviceList/updateDeviceConfig',
          payload: values,
          callback:v=>{
            if(v.code===0){
              message.success("修改终端成功");
              dispatch({
                type: 'deviceList/getAllTerminals',
              });
              dispatch({
                type: 'deviceList/getAllSensors',
              });
              dispatch({
                type: 'deviceList/getAllDeviceConfigs',
              });
              form.resetFields();
              closeEdit();
            }else{
              message.error("修改终端失败，(* ￣︿￣)，请在稍后再试~");
            }
          }
        })
      }
    })
  }

  sensorChange=(value)=>{
    const { deviceList } = this.props;
    deviceList.sensors.map(v=>{
      if(v.sensorNumber===value){
        this.setState({sensor:v});
        return;
      }
    });
  }

  terminalChange=(value)=>{
    const { deviceList } = this.props;
    deviceList.devices.map(v=>{
      if(v.terminalNumber===value){
        this.setState({terminal:v});
        return;
      }
    })
  }

  render(){
    const { sensor,terminal } = this.state;
    const { editData,form,showEdit,closeEdit,deviceList } = this.props;
    const { getFieldDecorator } = form;
    return(
      <div>
        {/* <Alert 
            message="Tip：用户界面提示"
            description="新建区间前请先确认用户或者角色已存在！"
            type="warning"
            showIcon
            closable
            style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
          /> */}
          <Form layout="vertical" hideRequiredMark style={{marginTop:'4%'}} id="editForm">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="绑定Id：">
                  {getFieldDecorator('dcId', {
                    rules: [{ required: true, message: '请输入绑定id' }],
                    initialValue:editData.dcId,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="终端编号：">
                  {getFieldDecorator('terminalNumber', {
                    rules: [{ required: true, message: '请输入终端编号' }],
                    initialValue:editData.terminalNumber,
                  })(
                    <Select placeholder="请选择终端编号" showSearch optionFilterProp="children">
                      {deviceList.devices.map(v=>{
                        return (
                          <Option key={Math.random()} value={v.terminalNumber}>{v.terminalNumber}</Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端通道：">
                  {getFieldDecorator('terminalChannel', {
                    rules: [{ required: true, message: '请输入终端通道' }],
                    initialValue:editData.terminalChannel,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入终端通道"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器编号：">
                  {getFieldDecorator('sensorNumber', {
                    rules: [{ required: true, message: '请输入传感器编号' }],
                    initialValue:editData.sensorNumber,
                  })(
                    <Select placeholder="请选择传感器编号" showSearch optionFilterProp="children" onChange={(value)=>{this.sensorChange(value)}}>
                      {deviceList.sensors.map(v=>{
                        return (
                          <Option key={Math.random()} value={v.sensorNumber}>{v.sensorNumber}</Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器地址：">
                  {getFieldDecorator('sensorAddress', {
                    rules: [{ required: true, message: '请输入传感器地址' }],
                    initialValue:sensor.sensorAddress===undefined?editData.sensorAddress:sensor.sensorAddress,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入传感器地址"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器标定系数K：">
                  {getFieldDecorator('timingFactor', {
                    rules: [{ required: true, message: '请输入传感器标定系数K' }],
                    initialValue:sensor.timingFactor===undefined?editData.timingFactor:sensor.timingFactor,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入传感器标定系数K"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="测点编号：">
                  {getFieldDecorator('monitorPointNumber', {
                    rules: [{ required: true, message: '请输入测点编号' }],
                    initialValue:editData.monitorPointNumber,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入测点编号"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="监测类型：">
                  {getFieldDecorator('monitorType', {
                    rules: [{ required: true, message: '请输入监测类型' }],
                    initialValue:editData.monitorType,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入监测类型"
                    />
                  )}
                </Form.Item>
              </Col> 
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="状态:">
                  {getFieldDecorator('status', {
                    rules: [
                      { required: true, message: '请选择状态' },
                    ],
                    initialValue:editData.status,
                  })(
                    <RadioGroup>
                      <Radio value={true}>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col style={{textAlign:'center'}} span={12} offset={6}>
                <Button icon="up" type="primary" ghost onClick={()=>{this.submit()}}>提交</Button>
                <Button icon="redo" type="default" style={{marginLeft:'10%'}} onClick={()=>{this.setState({sensor:[],terminal:[]});form.resetFields()}}>重置</Button>
              </Col>
            </Row>
          </Form>
      </div>
    )
  }
}