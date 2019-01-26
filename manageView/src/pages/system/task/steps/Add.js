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
@connect(({ taskList }) => ({
  taskList
}))
export default class Add extends Component{
  constructor(props){
    super(props);
    this.state={
      sensor: "", // 当前选中的传感器
      terminal: "", // 当前选中的终端
      monitorPoint: "", // 测点
      taskType: true, // 任务类型 true:CRON表达式版 false:SIMPLE简易版 
    }
  }

  submit=()=>{
    const { taskType } = this.state;
    const { form,dispatch } = this.props;
    form.validateFields((error,values)=>{
      if(!error){
        if(taskType){
          dispatch({
            type: 'taskList/addTask',
            payload: values,
            callback:v=>{
              if(v&&v.code===0){
                form.resetFields();
                message.success(v.msg);
                dispatch({
                  type: 'taskList/getAllTasks',
                });
              }else{
                message.error(v.msg);
              }
            }
          })
        }else{
          dispatch({
            type: 'taskList/addSimpleTask',
            payload: values,
            callback:v=>{
              if(v&&v.code===0){
                form.resetFields();
                message.success(v.msg);
                dispatch({
                  type: 'taskList/getAllTasks',
                });
              }else{
                message.error(v.msg);
              }
            }
          })
        }
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

  cronPlate =_=> {
    const { taskType } = this.state;
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
        xs: { span: 12 },
        sm: { span: 11 },
        md: { span: 10 },
        lg: { span: 9 },
      },
    };
    return(
      <Col span={24}>
        <FormItem label="任务表达式:" {...formItemLayout}>
          {getFieldDecorator('taskCron', {
            rules: [
              { required: true, message: '请输入任务表达式' },
              { validator: this.checkmonitorPoint },
            ],
          })(
            <Input placeholder="请输入任务表达式"/>
          )}
        </FormItem>   
      </Col>
    )
  }
  simplPlate =_=> {
    const { taskType } = this.state;
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
        xs: { span: 12 },
        sm: { span: 11 },
        md: { span: 10 },
        lg: { span: 9 },
      },
    };
    return(
      <Col span={24}>
        <FormItem label="触发间隔（分/次）:" {...formItemLayout}>
          {getFieldDecorator('intervalInMinutes', {
            rules: [
              { required: true, message: '请输入触发间隔' },
              { validator: this.checkmonitorPoint },
            ],
          })(
            <Input placeholder="请输入触发间隔"/>
          )}
        </FormItem>   
      </Col>
    )
  }


  render(){
    const { sensor,terminal,monitorPoint,taskType } = this.state;
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
      <PageHeaderWrapper title="任务新增">
        <Card>
          <Col span={18}>
            <Form layout="horizontal">
              <Button type="primary" icon="left" onClick={()=>{router.push('/system/taskList')}}>返回</Button>
              <Row>
                <Col span={12}>
                  <Button style={{marginTop:"3%"}} type="default" icon="swap" onClick={()=>{this.setState({taskType:!taskType})}}>创建一个{taskType?"SIMPL":"CRON"}任务</Button>
                </Col>
                <Col span={24}>
                  <FormItem label="任务名称:" {...formItemLayout}>
                    {getFieldDecorator('taskName', {
                      rules: [
                        { required: true, message: '请输入任务名称' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入任务名称"/>
                    )}
                  </FormItem>   
                </Col>
                {taskType?this.cronPlate():this.simplPlate()}
                {/* <Col span={24}>
                  <FormItem label="任务表达式:" {...formItemLayout}>
                    {getFieldDecorator('taskCron', {
                      rules: [
                        { required: true, message: '请输入任务表达式' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入任务表达式"/>
                    )}
                  </FormItem>   
                </Col> */}
                <Col span={24}>
                  <FormItem label="任务描述:" {...formItemLayout}>
                    {getFieldDecorator('taskDescription', {
                      rules: [
                        { required: true, message: '请输入任务描述' },
                        { validator: this.checkmonitorPoint },
                      ],
                    })(
                      <Input placeholder="请输入任务描述"/>
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
              <Panel header="任务名称" key="1" style={customPanelStyle}>
                <p>任务名称是方便用于辨别任务。</p>
              </Panel>
              <Panel header="任务表达式" key="2" style={customPanelStyle}>
                <p>任务表达式决定了该任务的执行时机。</p>
              </Panel>
              <Panel header="任务描述" key="3" style={customPanelStyle}>
                <p>任务描述用于给任务添加特别的提醒，以及相应的操作说明等。</p>
              </Panel>
            </Collapse>
          </Col>
        </Card>
      </PageHeaderWrapper>
    );
  }
}