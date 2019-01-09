import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
@connect(({ subwaySector }) => ({
  subwaySector,
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
        dispatch({
          type: 'subwaySector/updateSector',
          payload: values,
          callback:v=>{
            if(v.code===100){
              message.success("修改地铁区间成功！");
              dispatch({
                type: 'subwaySector/getSectors',
              });
              form.resetFields();
              closeEdit();
            }else{
              message.success("修改地铁区间失败，(* ￣︿￣)，请在稍后再试~");
            }
          }
        })
      }
    })
  }

  render(){
    const { editData,form,showEdit } = this.props;
    const {loading,double} = this.state;
    const { getFieldDecorator } = form;
    return(
      <div>
        <Alert 
            message="Tip：用户界面提示"
            description="新建区间前请先确认用户或者角色已存在！"
            type="warning"
            showIcon
            closable
            style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
          />
          <Form layout="vertical" hideRequiredMark style={{marginTop:'4%'}} id="editForm">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="区间id：">
                  {getFieldDecorator('sectorId', {
                    rules: [{ required: true, message: '请输入区间id' }],
                    initialValue:editData.sectorId,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="所属项目：">
                  {getFieldDecorator('projectId', {
                    rules: [{ required: true, message: '请选择所属项目' }],
                    initialValue:editData.projectId,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请选择所属项目"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="区间名称：">
                  {getFieldDecorator('sectorName', {
                    rules: [{ required: true, message: '请输入区间名称' }],
                    initialValue:editData.sectorName,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入区间名称"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="区间地址：">
                  {getFieldDecorator('sectorAddress', {
                    rules: [{ required: true, message: '请输入区间地址' }],
                    initialValue:editData.sectorAddress,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入区间地址"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="区间经度：">
                  {getFieldDecorator('sectorLongitude', {
                    rules: [{ required: true, message: '请输入区间经度' }],
                    initialValue:editData.sectorLongitude,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入区间经度"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="区间纬度：">
                  {getFieldDecorator('sectorLatitude', {
                    rules: [{ required: true, message: '请输入区间纬度' }],
                    initialValue:editData.sectorLatitude,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入区间纬度"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="区间开始时间：">
                  {getFieldDecorator('sectorBeginTime', {
                    rules: [{ required: true, message: '请选择开始时间' }],
                    initialValue:moment(editData.sectorBeginTime,'YYYY-MM-DD HH:mm:ss'),
                  })(
                    <DatePicker
                      style={{width:'100%'}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择开始时间"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="区间结束时间：">
                  {getFieldDecorator('sectorEndTime', {
                    rules: [{ required: true, message: '请选择结束时间' }],
                    initialValue:moment(editData.sectorEndTime,'YYYY-MM-DD HH:mm:ss'),
                  })(
                    <DatePicker
                      style={{width:'100%'}}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选择技术时间"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="区间描述：">
                  {getFieldDecorator('sectorDescription', {
                    rules: [{ required: true, message: '请输入区间描述' }],
                    initialValue:editData.sectorDescription,
                  })(
                    <TextArea style={{resize:'none'}} rows={4} placeholder="请输入区间描述"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="状态：">
                  {getFieldDecorator('sectorStatus', {
                    rules: [
                      {
                        required: true,
                        message: 'please enter url description',
                      },
                    ],
                    initialValue:editData.sectorStatus, 
                  })(
                    <RadioGroup>
                      <Radio value={1} key={1}>未开始</Radio>
                      <Radio value={2} key={2}>进行中</Radio>
                      <Radio value={3} key={3}>已结束</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
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