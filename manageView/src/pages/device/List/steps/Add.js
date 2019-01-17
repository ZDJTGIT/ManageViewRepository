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

    }
  }

  submit=()=>{
    const { form,dispatch } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        const param = values;
        param.productDate = values.terminalTime[0].format('YYYY-MM-DD HH:mm:ss');
        param.endDate = values.terminalTime[1].format('YYYY-MM-DD HH:mm:ss');
        dispatch({
          type: 'deviceList/addTerminal',
          payload: param,
          callback:v=>{
            if(v&&v.code===0){
              form.resetFields();
              message.success("新增终端成功");
              dispatch({
                type: 'deviceList/getAllTerminals',
              });
            }else{
              message.error("新增终端失败，(* ￣︿￣)，请在稍后再试~")
            }
          }
        })
      }
    })
  }

  render(){
    const { form } = this.props;
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
      <PageHeaderWrapper title="新增终端">
        <Card>
          <Form layout="horizontal">
            <Button type="primary" icon="left" onClick={()=>{router.push('/device/list/*')}}>返回</Button>
            <Row>
              <Col span={12} offset={6}>
                <Alert 
                  message="Tip：新建终端设备提示"
                  description="请尽量避免终端设备名称相同！"
                  type="warning"
                  showIcon
                  closable
                  style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
                />
              </Col>
              <Col span={24}>
                <FormItem label="终端名:" {...formItemLayout}>
                  {getFieldDecorator('terminalName', {
                    rules: [
                      { required: true, message: '请输入终端名' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入终端名"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="终端编号:" {...formItemLayout}>
                  {getFieldDecorator('terminalNumber', {
                    rules: [
                      { required: true, message: '请输入终端编号' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入终端编号"/>
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
                <FormItem label="终端型号:" {...formItemLayout}>
                  {getFieldDecorator('terminalModel', {
                    rules: [
                      { required: true, message: '请输入终端型号' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入终端型号"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="额定电压:" {...formItemLayout}>
                  {getFieldDecorator('voltage', {
                    rules: [
                      { required: true, message: '请输入额定电压' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入额定电压" suffix={"单位：伏特（v）"}/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="通道数:" {...formItemLayout}>
                  {getFieldDecorator('channelNumber', {
                    rules: [
                      { required: true, message: '请输入通道数' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入通道数"/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="采集频率:" {...formItemLayout}>
                  {getFieldDecorator('collectionFrequency', {
                    rules: [
                      { required: true, message: '请输入采集频率' },
                      { validator: this.checkmonitorPoint },
                    ],
                  })(
                    <Input placeholder="请输入采集频率" suffix={"单位：秒/次（s/count）"}/>
                  )}
                </FormItem>   
              </Col>
              <Col span={24}>
                <FormItem label="终端时间:" {...formItemLayout}>
                  {getFieldDecorator('terminalTime', {
                    rules: [
                      { required: true, message: '请选择终端生产-结束时间' },
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
                <FormItem label="终端状态:" {...formItemLayout}>
                  {getFieldDecorator('terminalStatus', {
                    rules: [
                      { required: true, message: '请选择终端状态' },
                    ],
                    initialValue:1,
                  })(
                    <RadioGroup>
                      <Radio value={1}>未使用</Radio>
                      {/* <Radio value={2}>已上线</Radio>
                      <Radio value={3}>离线中</Radio> */}
                      <Radio value={4}>已损坏</Radio>
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