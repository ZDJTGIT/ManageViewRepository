import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ taskList }) => ({
  taskList,
}))
export default class Edit extends Component{
  constructor(props){
    super(props);
    this.state={
      terminal:[],
      sensor:[],
    }
  }

  submit=()=>{
    const { form,dispatch,editData,closeEdit } = this.props;
    // form.validateFields((error,values)=>{
    //   if(!error){
    //     dispatch({
    //       type: 'deviceList/updateDeviceConfig',
    //       payload: values,
    //       callback:v=>{
    //         if(v.code===0){
    //           message.success("修改终端成功");
    //           dispatch({
    //             type: 'deviceList/getAllTerminals',
    //           });
    //           dispatch({
    //             type: 'deviceList/getAllSensors',
    //           });
    //           dispatch({
    //             type: 'deviceList/getAllDeviceConfigs',
    //           });
    //           form.resetFields();
    //           closeEdit();
    //         }else{
    //           message.error("修改终端失败，(* ￣︿￣)，请在稍后再试~");
    //         }
    //       }
    //     })
    //   }
    // })
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

  terminalChange=(value)=>{
    const { deviceList } = this.props;
    deviceList.devices.map(v=>{
      if(v.terminalNumber===value){
        this.setState({terminal:v});
        return;
      }
    })
  }

  render(){
    const { sensor,terminal } = this.state;
    const { editData,form,showEdit,closeEdit,deviceList } = this.props;
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
              <Col span={24}>
                <Form.Item label="绑定Id：">
                  {getFieldDecorator('taskName', {
                    rules: [{ required: true, message: '请输入绑定id' }],
                    initialValue:editData.taskName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="终端编号：">
                  {getFieldDecorator('taskCron', {
                    rules: [{ required: true, message: '请输入终端编号' }],
                    initialValue:editData.taskCron,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="终端通道：">
                  {getFieldDecorator('taskDescription', {
                    rules: [{ required: true, message: '请输入终端通道' }],
                    initialValue:editData.taskDescription,
                  })(
                    <Input
                      style={{ width: '100%' }}
                      placeholder="请输入终端通道"
                    />
                  )}
                </Form.Item>
              </Col>
            <Row gutter={16}>
              <Col style={{textAlign:'center'}} span={12} offset={6}>
                <Button icon="up" type="primary" ghost onClick={()=>{this.submit()}}>提交</Button>
                <Button icon="redo" type="default" style={{marginLeft:'10%'}} onClick={()=>{this.setState({sensor:[],terminal:[]});form.resetFields()}}>重置</Button>
              </Col>
            </Row>
          </Form>
      </div>
    )
  }
}