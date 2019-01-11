import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ deviceList }) => ({
  deviceList,
}))
export default class Edit extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  submit=()=>{
    const { form,dispatch,editData,closeEdit } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        const params = values;
        params.productDate = values.productDate.format('YYYY-MM-DD HH:mm:ss');
        params.endDate = values.endDate.format('YYYY-MM-DD HH:mm:ss');
        dispatch({
          type: 'deviceList/updateSensor',
          payload: values,
          callback:v=>{
            if(v&&v.code===0){
              message.success("修改终端成功");
              dispatch({
                type: 'deviceList/getAllSensors',
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

  render(){
    const { editData,form,showEdit,closeEdit } = this.props;
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
                <Form.Item label="传感器ID：">
                  {getFieldDecorator('sensorId', {
                    rules: [{ required: true, message: '请输入传感器ID' }],
                    initialValue:editData.sensorId,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item label="传感器名：">
                  {getFieldDecorator('sensorName', {
                    rules: [{ required: true, message: '请输入传感器名' }],
                    initialValue:editData.sensorName,
                  })(<Input style={{ width: '100%' }} placeholder="请输入传感器名" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器编号：">
                  {getFieldDecorator('sensorNumber', {
                    rules: [{ required: true, message: '请输入传感器编号' }],
                    initialValue:editData.sensorNumber,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入传感器编号"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="厂商：">
                  {getFieldDecorator('manufacturer', {
                    rules: [{ required: true, message: '请输入厂商名称' }],
                    initialValue:editData.manufacturer,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入厂商名称"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器型号：">
                  {getFieldDecorator('sensorModel', {
                    rules: [{ required: true, message: '请输入传感器型号' }],
                    initialValue:editData.sensorModel,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入传感器型号"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器地址：">
                  {getFieldDecorator('sensorAddress', {
                    rules: [{ required: true, message: '请输入传感器地址' }],
                    initialValue:editData.sensorAddress,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入传感器地址"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="量程：">
                  {getFieldDecorator('sensorRange', {
                    rules: [{ required: true, message: '请输入量程' }],
                    initialValue:editData.sensorRange,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入量程"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="精度：">
                  {getFieldDecorator('sensorAccuracy', {
                    rules: [{ required: true, message: '请输入精度' }],
                    initialValue:editData.sensorAccuracy,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入精度"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="标定系数K：">
                  {getFieldDecorator('timingFactor', {
                    rules: [{ required: true, message: '请输入标定系数K' }],
                    initialValue:editData.timingFactor,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入标定系数K"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生产日期：">
                  {getFieldDecorator('productDate', {
                    rules: [{ required: true, message: '请选择生产日期' }],
                    initialValue:moment(editData.productDate),
                    // initialValue:editData.productDate,
                  })(
                    <DatePicker
                      style={{width:"100%"}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择生产日期"
                    />
                  )}
                </Form.Item>
              </Col>
              
            </Row>
            <Row gutter={15}>
              <Col span={12}>
                <Form.Item label="结束日期：">
                  {getFieldDecorator('endDate', {
                    rules: [{ required: true, message: '请选择结束日期' }],
                    initialValue:moment(editData.endDate),
                    // initialValue:editData.productDate,
                  })(
                    <DatePicker
                      style={{width:"100%"}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择结束日期"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label="终端状态:">
                  {getFieldDecorator('sensorStatus', {
                    rules: [
                      { required: true, message: '请选择终端状态' },
                    ],
                    initialValue:editData.sensorStatus,
                  })(
                    <RadioGroup>
                      <Radio value={1}>未使用</Radio>
                      <Radio value={2}>使用中</Radio>
                      <Radio value={3}>已损坏</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col style={{textAlign:'center'}} span={12} offset={6}>
                <Button icon="up" type="primary" ghost onClick={()=>{this.submit()}}>提交</Button>
                <Button icon="redo" type="default" style={{marginLeft:'10%'}} onClick={()=>{form.resetFields()}}>重置</Button>
              </Col>
            </Row>
          </Form>
      </div>
    )
  }
}