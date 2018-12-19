import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ monitorProject }) => ({
  monitorProject,
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
          type: 'monitorProject/updateProject',
          payload: values,
          callback:v=>{
            if(v.code===100){
              message.success(v.message);
              dispatch({
                type: 'monitorProject/getProjects',
              });
              closeEdit();
            }else{
              message.success(v.message);
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
                <Form.Item label="项目id：">
                  {getFieldDecorator('projectId', {
                    rules: [{ required: true, message: '请输入项目id' }],
                    initialValue:editData.projectId,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="项目名称：">
                  {getFieldDecorator('projectName', {
                    rules: [{ required: true, message: '请输入项目名称' }],
                    initialValue:editData.projectName,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入项目名称"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="项目地址：">
                  {getFieldDecorator('projectAddress', {
                    rules: [{ required: true, message: '请输入项目地址' }],
                    initialValue:editData.projectAddress,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入项目地址"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="项目描述：">
                  {getFieldDecorator('projectDescription', {
                    rules: [{ required: true, message: '请输入项目描述' }],
                    initialValue:editData.projectDescription,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入项目描述"
                    />
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