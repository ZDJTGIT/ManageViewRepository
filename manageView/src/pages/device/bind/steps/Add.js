import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Radio,DatePicker,Collapse } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Panel = Collapse.Panel;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

@Form.create()
@connect(({ deviceList,sysCode }) => ({
  deviceList,sysCode
}))
export default class Add extends Component{
  constructor(props){
    super(props);
    this.state={
      sensor: "", // 当前选中的传感器
      terminal: "", // 当前选中的终端
      monitorPoint: "", // 测点
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
    dispatch({
      type: 'sysCode/getAllParserMethods',
    });
    dispatch({
      type: 'sysCode/getAllMonitorType',
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
              message.success(v.msg);
              dispatch({
                type: 'deviceList/getAllDeviceConfigs',
              });
            }else{
              message.error(v.msg);
            }
          }
        })
      }
    })
  }

  sensorChange=(value)=>{
    const { terminal } = this.state;
    const { deviceList,dispatch } = this.props;
    let temp = "";
    deviceList.sensors.map(v=>{
      if(v.sensorNumber===value){
        this.setState({sensor:v});
        temp = v;
        return;
      }
    });
    if(terminal){
      dispatch({
        type: 'deviceList/getMonitorPointByTerminalNumberAndSensorNumber',
        payload: {"terminal":terminal,"sensor":temp},
        callback: v=>{
          if(v&&v.code===0&&v.data!=undefined){
            this.setState({monitorPoint:v.data});
          }else{
            this.setState({monitorPoint:""});
            message.error("无对应测点信息，请确认后重新选择传感器和终端");
          }
        }
      })
    }
  }

  terminalChange=(value)=>{
    const { sensor } = this.state;
    const { deviceList,dispatch } = this.props;
    let temp = "";
    deviceList.devices.map(v=>{
      if(v.terminalNumber===value){
        this.setState({terminal:v});
        temp = v;
        return;
      }
    });
    if(sensor){
      dispatch({
        type: 'deviceList/getMonitorPointByTerminalNumberAndSensorNumber',
        payload: {"terminal":temp,"sensor":sensor},
        callback: v=>{
          if(v&&v.code===0&&v.data!=undefined){
            this.setState({monitorPoint:v.data});
          }else{
            this.setState({monitorPoint:""});
            message.error("无对应测点信息，请确认后重新选择传感器和终端");
          }
        }
      })
    }
  } 

  render(){
    const { sensor,terminal,monitorPoint } = this.state;
    const { form,deviceList,sysCode } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 5,offset:2 },
        md: { span: 4,offset:4 },
        lg: { span: 3,offset:6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 11 },
        md: { span: 10 },
        lg: { span: 9 },
      },
    };
    return(
      <PageHeaderWrapper title="终端传感器绑定">
        <Card>
          <Col span={18}>
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
                      <Select placeholder="请选择终端编号" showSearch optionFilterProp="children" onChange={(value)=>{this.terminalChange(value)}}>
                        {deviceList.devices.map(v=>{
                          if(v.terminalStatus===2){
                            return (
                              <Option key={Math.random()} value={v.terminalNumber}>{v.terminalNumber}</Option>
                            );
                          }
                          return ;
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
                          if(v.sensorStatus===1){
                            return (
                              <Option key={Math.random()} value={v.sensorNumber}>{v.sensorNumber}</Option>
                            );
                          }
                          return;
                        })}
                      </Select>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="终端采集频率:" {...formItemLayout}>
                    {getFieldDecorator('collectionFrequency', {
                      rules: [
                        { required: false, message: '终端采集频率' },
                      ],
                      initialValue: terminal.collectionFrequency,
                    })(
                      <Input placeholder="终端采集频率" disabled/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="传感器地址:" {...formItemLayout}>
                    {getFieldDecorator('sensorAddress', {
                      rules: [
                        { required: false, message: '传感器地址' },
                        { validator: this.checkmonitorPoint },
                      ],
                      initialValue: sensor.sensorAddress,
                    },
                    )(
                      <Input placeholder="传感器地址" disabled /> 
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="传感器标定系数K:" {...formItemLayout}>
                    {getFieldDecorator('timingFactor', {
                      rules: [
                        { required: false, message: '传感器标定系数K' },
                      ],
                      initialValue: sensor.timingFactor,
                    })(
                      <Input placeholder="传感器标定系数K" disabled />
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="解析方式:" {...formItemLayout}>
                    {getFieldDecorator('parserMethod', {
                      rules: [
                        { required: false, message: '解析方式' },
                      ],
                      initialValue: sensor.parserMethod,
                    })(
                      <Select placeholder="解析方式" showSearch optionFilterProp="children" disabled>
                        {sysCode.parserMethods.map(v=>{
                          return (
                            <Option key={Math.random()} value={v.scId}>{v.itemName}</Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="测点编号:" {...formItemLayout}>
                    {getFieldDecorator('monitorPointNumber', {
                      rules: [
                        { required: true, message: '测点编号' },
                        { validator: this.checkmonitorPoint },
                      ],
                      initialValue: monitorPoint.monitorPointNumber,
                    })(
                      <Input placeholder="测点编号" disabled/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="监测类型:" {...formItemLayout}>
                    {getFieldDecorator('monitorType', {
                      rules: [
                        { required: false, message: '监测类型' },
                      ],
                      initialValue: monitorPoint.monitorType,
                    })(
                      <Select placeholder="监测类型" optionFilterProp="children" disabled>
                        {sysCode.monitorPoints.map(v=>{
                            return (
                              <Option key={Math.random()} value={v.scId}>{v.itemName}</Option>
                            );
                        })}
                      </Select>
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
                  <Button icon="redo" type="default" style={{marginLeft:'5%'}} onClick={()=>{this.setState({sensor:"",terminal:""});form.resetFields()}}>重置</Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={6}>
            <Collapse bordered={false} defaultActiveKey={['1','2']}>
              <Panel header="使用说明" key="1" style={customPanelStyle}>
                <p>用户只需选择终端及传感器编号，输入终端通道即可。</p>
              </Panel>
              <Panel header="终端编号" key="2" style={customPanelStyle}>
                <p>终端编号只能选择已上线的终端。</p>
              </Panel>
              <Panel header="传感器编号" key="3" style={customPanelStyle}>
                <p>传感器编号只能选择未使用的传感器对应编号。</p>
              </Panel>
              <Panel header="测点编号" key="4" style={customPanelStyle}>
                <p>选择终端、传感器编号后，自动补全测点编号。若无对应测点，请重新选择终端和传感器。</p>
              </Panel>
            </Collapse>
          </Col>
        </Card>
      </PageHeaderWrapper>
    );
  }
}