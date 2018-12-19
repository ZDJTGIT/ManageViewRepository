import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Radio,DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
@connect(({ monitorProject }) => ({
  monitorProject,
}))
export default class Add extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  submit=()=>{
    const { form,dispatch,bac } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        // console.log(values);
        dispatch({
          type: 'monitorProject/addProject',
          payload: values,
          callback:v=>{
            if(v&&v.code===100){
              form.resetFields();
              message.success("新增项目成功");
              dispatch({
                type: 'monitorProject/getProjects',
              });
            }else{
              message.error("新增项目失败，(* ￣︿￣)，请在稍后再试~")
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
              message="Tip：新建项目提示"
              description="项目名称请避免相同！"
              type="warning"
              showIcon
              closable
              style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
            />
          </Col>
          <Col span={24}>
            <FormItem label="项目名:" {...formItemLayout}>
              {getFieldDecorator('projectName', {
                rules: [
                  { required: true, message: '请输入项目名' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入项目名"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="项目地址:" {...formItemLayout}>
              {getFieldDecorator('projectAddress', {
                rules: [
                  { required: true, message: '请输入项目地址' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入项目地址"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="项目描述:" {...formItemLayout}>
              {getFieldDecorator('projectDescription', {
                rules: [
                  { required: true, message: '请输入项目描述' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <TextArea style={{resize:'none'}} rows={4} placeholder="请输入项目描述"/>
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