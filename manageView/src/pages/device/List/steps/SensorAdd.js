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
export default class SensorAdd extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  submit=()=>{
    const { form,dispatch } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        const param = values;
        param.productDate = values.sensorTime[0].format('YYYY-MM-DD HH:mm:ss');
        param.endDate = values.sensorTime[1].format('YYYY-MM-DD HH:mm:ss');
        dispatch({
          type: 'deviceList/addSensor',
          payload: param,
          callback:v=>{
            if(v&&v.code===0){
              form.resetFields();
              message.success("新增传感器成功");
              dispatch({
                type: 'deviceList/getAllSensors',
              });
            }else{
              message.error("新增传感器失败，(* ￣︿￣)，请在稍后再试~")
            }
          }
        })
      }
    })
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCode/getAllParserMethods',
    })
  }

  render(){
    const { form,sysCode } = this.props;
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
      <PageHeaderWrapper title="新增传感器">
        <Card>
          <Col span={18}>
            <Form layout="horizontal">
              <Button type="primary" icon="left" onClick={()=>{router.push('/device/sensorlist')}}>返回</Button>
              <Row>
                <Col span={12} offset={7}>
                  <Alert 
                    message="Tip：新建传感器设备提示"
                    description="请尽量避免传感器设备名称相同！"
                    type="warning"
                    showIcon
                    closable
                    style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
                  />
                </Col>
                <Col span={24}>
                  <FormItem label="传感器名:" {...formItemLayout}>
                    {getFieldDecorator('sensorName', {
                      rules: [
                        { required: true, message: '请输入传感器名' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入传感器名"/>
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
                      <Input placeholder="请输入传感器编号"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="生产厂商:" {...formItemLayout}>
                    {getFieldDecorator('manufacturer', {
                      rules: [
                        { required: true, message: '请输入生产厂商' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入生产厂商"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="传感器型号:" {...formItemLayout}>
                    {getFieldDecorator('sensorModel', {
                      rules: [
                        { required: true, message: '请输入传感器型号' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入传感器型号"/>
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
                    })(
                      <Input placeholder="请输入传感器地址"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="量程:" {...formItemLayout}>
                    {getFieldDecorator('sensorRange', {
                      rules: [
                        { required: true, message: '请输入量程' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入量程"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="精度:" {...formItemLayout}>
                    {getFieldDecorator('sensorAccuracy', {
                      rules: [
                        { required: true, message: '请输入精度' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入精度"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="解析方式:" {...formItemLayout}>
                    {getFieldDecorator('parserMethod', {
                      rules: [
                        { required: true, message: '请选择解析方式' },
                      ],
                    })(
                      <Select placeholder="请选择解析方式" showSearch optionFilterProp="children">
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
                  <FormItem label="标定系数K:" {...formItemLayout}>
                    {getFieldDecorator('timingFactor', {
                      rules: [
                        { required: true, message: '请输入标定系数K' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入标定系数K"/>
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="传感器时间:" {...formItemLayout}>
                    {getFieldDecorator('sensorTime', {
                      rules: [
                        { required: true, message: '请选择传感器生产-结束时间' },
                      ],
                    })(
                      <RangePicker
                        style={{width:'100%'}}
                        showTime={{
                          hideDisabledOptions: true,
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    )}
                  </FormItem>   
                </Col>
                <Col span={24}>
                  <FormItem label="传感器状态:" {...formItemLayout}>
                    {getFieldDecorator('sensorStatus', {
                      rules: [
                        { required: true, message: '请选择传感器状态' },
                      ],
                      initialValue:1,
                    })(
                      <RadioGroup>
                        <Radio value={1}>未使用</Radio>
                        {/* <Radio value={2}>使用中</Radio>
                        <Radio value={3}>已损坏</Radio> */}
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
          </Col>
          <Col span={6}>
            <Collapse bordered={false} defaultActiveKey={['1','2']}>
              <Panel header="传感器编号" key="1" style={customPanelStyle}>
                <p>传感器编号属于识别终端的标识符，原则上不允许出现重复。一般由字母加数字组合而成。</p>
              </Panel>
              <Panel header="量程" key="2" style={customPanelStyle}>
                <p>量程是指传感器的测量范围。</p>
              </Panel>
              <Panel header="精度" key="3" style={customPanelStyle}>
                <p>反映测量结果与真值接近程度的量，称为精度，它与误差的大小相对应，因此可用误差大小来表示精度的高低，误差小则精度高，误差大则精度低。</p>
              </Panel>
              <Panel header="解析方式" key="4" style={customPanelStyle}>
                <p>传感器在dtu模块的解析方式，用于识别适用的适配器。</p>
              </Panel>
              <Panel header="标定系数" key="5" style={customPanelStyle}>
                <p>标定系数说明</p>
              </Panel>
            </Collapse>
          </Col>
        </Card>
      </PageHeaderWrapper>
    );
  }
}