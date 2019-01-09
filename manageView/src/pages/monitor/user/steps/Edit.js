import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ monitorUser }) => ({
  monitorUser,
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
        values.createTime = values.createTimeMoment.format('YYYY-MM-DD HH:mm:ss');
        delete values.createTimeMoment;
        delete values.projectId;
        values.userId = editData.userId;
        dispatch({
          type: 'monitorUser/updateUser',
          payload: values,
          callback:v=>{
            if(v.code===100){
              message.success("修改用户成功！");
              dispatch({
                type: 'monitorUser/getUser',
              });
              form.resetFields();
              closeEdit();
            }else{
              message.error("修改用户失败，(* ￣︿￣)，请在稍后再试~");
            }
          }
        })
      }
    })
  }

  render(){
    const { editData,form,showEdit } = this.props;
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
                <Form.Item label="账户名：">
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'please enter user name' }],
                    initialValue:editData.userName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="电话：">
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入用户电话' }],
                    initialValue:editData.phone,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入用户电话"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="邮箱：">
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输入邮箱' }],
                    initialValue:editData.email,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入邮箱"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="公司：">
                  {getFieldDecorator('company', {
                    rules: [{ required: true, message: '请输入公司' }],
                    initialValue:editData.company,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入公司"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="姓名：">
                  {getFieldDecorator('realName', {
                    rules: [{ required: true, message: '请输入用户姓名' }],
                    initialValue:editData.realName, 
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入用户姓名"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="创建时间：">
                  {getFieldDecorator('createTimeMoment', {
                    rules: [{ required: true, message: 'Please choose the dateTime' }],
                    initialValue:moment(editData.createTime), 
                  })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="创建时间"
                      style={{width:'100%'}}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="状态：">
                  {getFieldDecorator('status', {
                    rules: [
                      {
                        required: true,
                        message: 'please enter url description',
                      },
                    ],
                    initialValue:editData.status, 
                  })(
                    <RadioGroup>
                      <Radio value={1}>启动</Radio>
                      <Radio value={0}>冻结</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
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