import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Radio,DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ monitorUser }) => ({
  monitorUser,
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
        delete values.assurePassword;
        values.createTime = values.createTimeMoment.format('YYYY-MM-DD HH:mm:ss');
        delete values.createTimeMoment;
        dispatch({
          type: 'monitorUser/addUser',
          payload: values,
          callback:v=>{
            if(v&&v.code===100){
              form.resetFields();
              message.success("新增用户成功");
              dispatch({
                type: 'monitorUser/getUser',
              });
            }else{
              message.error("新增用户失败，(* ￣︿￣)，请在稍后再试~")
            }
          }
        })
      }
    })
  }

  render(){
    const { form,bac } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 5,offset:1 },
        md: { span: 4,offset:3 },
        lg: { span: 3,offset:4 },
      },
      wrapperCol: {
        xs: { span: 13 },
        sm: { span: 12 },
        md: { span: 11 },
        lg: { span: 10 },
      },
    };
    return(
      <Form layout="horizontal">
        <Button type="primary" icon="left" onClick={()=>{bac()}}>返回</Button>
        <Row>
          <Col span={12} offset={6}>
            <Alert 
              message="Tip：用户界面提示"
              description="新建用户请避开用户重名！"
              type="warning"
              showIcon
              closable
              style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
            />
          </Col>
          <Col span={24}>
            <FormItem label="账户名:" {...formItemLayout}>
              {getFieldDecorator('userName', {
                rules: [
                  { required: true, message: '请输入账户名' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入账户名"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="密码:" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入密码' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input type="password" placeholder="请输入密码"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="确认密码:" {...formItemLayout}>
              {getFieldDecorator('assurePassword', {
                rules: [
                  { required: true, message: '请再次输入密码，保持密码一致' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input type="password" placeholder="确认密码"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="电话:" {...formItemLayout}>
              {getFieldDecorator('phone', {
                rules: [
                  { required: true, message: '请输入用户电话' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入用户电话"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="邮箱:" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: '请输入用户邮箱' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入用户邮箱"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="公司:" {...formItemLayout}>
              {getFieldDecorator('company', {
                rules: [
                  { required: true, message: '请输入用户公司名称' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入用户公司名称"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="姓名:" {...formItemLayout}>
              {getFieldDecorator('realName', {
                rules: [
                  { required: true, message: '请输入用户姓名' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入用户姓名"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="创建时间:" {...formItemLayout}>
              {getFieldDecorator('createTimeMoment', {
                rules: [
                  { required: true, message: '请选择用户创建时间' },
                ],
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="创建时间"
                />
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="状态:" {...formItemLayout}>
              {getFieldDecorator('status', {
                rules: [
                  { required: true, message: '请选择用户状态' },
                  // { validator: this.checkmonitorPoint },
                ],
                initialValue:1,
              })(
                <RadioGroup>
                  <Radio value={1}>启动</Radio>
                  <Radio value={0}>冻结</Radio>
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
    );
  }
}