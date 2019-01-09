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
          type: 'deviceList/updateTerminal',
          payload: values,
          callback:v=>{
            if(v.code===0){
              message.success("修改终端成功");
              dispatch({
                type: 'deviceList/getAllTerminals',
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
                <Form.Item label="终端Id：">
                  {getFieldDecorator('terminalId', {
                    rules: [{ required: true, message: '请输入终端id' }],
                    initialValue:editData.terminalId,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="终端编号：">
                  {getFieldDecorator('terminalNumber', {
                    rules: [{ required: true, message: '请输入终端编号' }],
                    initialValue:editData.terminalNumber,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入终端编号"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端名称：">
                  {getFieldDecorator('terminalName', {
                    rules: [{ required: true, message: '请输入终端名称' }],
                    initialValue:editData.terminalName,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入终端名称"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="厂商：">
                  {getFieldDecorator('manufacturer', {
                    rules: [{ required: true, message: '请输入厂商' }],
                    initialValue:editData.manufacturer,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入厂商"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端型号：">
                  {getFieldDecorator('terminalModel', {
                    rules: [{ required: true, message: '请输入终端型号' }],
                    initialValue:editData.terminalModel,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入终端型号"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="额定电压：">
                  {getFieldDecorator('voltage', {
                    rules: [{ required: true, message: '请输入额定电压' }],
                    initialValue:editData.voltage,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入额定电压"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="通道数：">
                  {getFieldDecorator('channelNumber', {
                    rules: [{ required: true, message: '请输入通道数' }],
                    initialValue:editData.channelNumber,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入通道数"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="采集频率：">
                  {getFieldDecorator('collectionFrequency', {
                    rules: [{ required: true, message: '请输入采集频率' }],
                    initialValue:editData.collectionFrequency,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入采集频率"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
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
              <Col span={12}>
                <Form.Item label="结束日期：">
                  {getFieldDecorator('endDate', {
                    rules: [{ required: true, message: '请输入结束日期' }],
                    initialValue:moment(editData.endDate),
                    // initialValue:editData.endDate,
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
                  {getFieldDecorator('status', {
                    rules: [
                      { required: true, message: '请选择终端状态' },
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