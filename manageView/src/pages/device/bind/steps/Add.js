import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Radio,DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ deviceList }) => ({
  deviceList,
}))
export default class Add extends Component{
  constructor(props){
    super(props);
    this.state={
      sensor: [] // 当前选中的传感器
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
    const { form,dispatch } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        dispatch({
          type: 'deviceList/addDeviceConfig',
          payload: values,
          callback:v=>{
            if(v&&v.code===0){
              form.resetFields();
              message.success("设备绑定成功");
              dispatch({
                type: 'deviceList/getAllDeviceConfigs',
              });
            }else{
              message.error("设备绑定失败，(* ￣︿￣)，请在稍后再试~")
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

  render(){
    const { sensor } = this.state;
    const { form,deviceList } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 5,offset:2 },
        md: { span: 4,offset:4 },
        lg: { span: 3,offset:6 },
      },
      wrapperCol: {
        xs: { span: 11 },
        sm: { span: 10 },
        md: { span: 9 },
        lg: { span: 8 },
      },
    };
    return(
      <PageHeaderWrapper title="终端传感器绑定">
        <Card>
          <Form layout="horizontal">
            <Button type="primary" icon="left" onClick={()=>{router.push('/device/bindDevice')}}>返回</Button>
            <Row>
              <Col span={12} offset={6}>
                {/* <Alert 
                  message="Tip：新建终端设备提示"
                  description="请尽量避免终端设备名称相同！"
                  type="warning"
                  showIcon
                  closable
                  style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
                /> */}
              </Col>
              <Col span={24}>
                <FormItem label="终端编号:" {...formItemLayout}>
                  {getFieldDecorator('terminalNumber', {
                    rules: [
                      { required: true, message: '请输入终端编号' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Select placeholder="请选择终端编号" showSearch optionFilterProp="children">
                      {deviceList.devices.map(v=>{
                        return (
                          <Option key={Math.random()} value={v.terminalNumber}>{v.terminalNumber}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="终端通道:" {...formItemLayout}>
                  {getFieldDecorator('terminalChannel', {
                    rules: [
                      { required: true, message: '请输入终端通道' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入终端通道"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="传感器编号:" {...formItemLayout}>
                  {getFieldDecorator('sensorNumber', {
                    rules: [
                      { required: true, message: '请输入传感器编号' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Select placeholder="请选择传感器编号" showSearch optionFilterProp="children" onChange={(value)=>{this.sensorChange(value)}}>
                      {deviceList.sensors.map(v=>{
                        return (
                          <Option key={Math.random()} value={v.sensorNumber}>{v.sensorNumber}</Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="传感器地址:" {...formItemLayout}>
                  {getFieldDecorator('sensorAddress', {
                    rules: [
                      { required: true, message: '请输入传感器地址' },
                      { validator: this.checkmonitorPoint },
                    ],
                    initialValue: sensor.sensorAddress,
                  },
                  )(
                    <Input placeholder="请输入传感器地址" readOnly /> 
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="传感器标定系数K:" {...formItemLayout}>
                  {getFieldDecorator('timingFactor', {
                    rules: [
                      { required: true, message: '请输入传感器标定系数K' },
                    ],
                    initialValue: sensor.timingFactor,
                  })(
                    <Input placeholder="请输入传感器标定系数K" readOnly />
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="测点编号:" {...formItemLayout}>
                  {getFieldDecorator('monitorPointNumber', {
                    rules: [
                      { required: true, message: '请输入测点编号' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入测点编号"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="监测类型:" {...formItemLayout}>
                  {getFieldDecorator('monitorType', {
                    rules: [
                      { required: true, message: '请输入监测类型' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入监测类型"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="状态:" {...formItemLayout}>
                  {getFieldDecorator('status', {
                    rules: [
                      { required: true, message: '请选择状态' },
                    ],
                    initialValue:true,
                  })(
                    <RadioGroup>
                      <Radio value={true}>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>   
              </Col>
              <Col style={{textAlign:'center'}} span={12} offset={6}>
                <Button icon="up" type="primary" ghost onClick={()=>{this.submit()}}>提交</Button>
                <Button icon="redo" type="default" style={{marginLeft:'5%'}} onClick={()=>{form.resetFields()}}>重置</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}