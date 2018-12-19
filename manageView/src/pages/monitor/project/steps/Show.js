import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio,Modal } from 'antd';
import moment from 'moment';
import Edit from './Edit';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { confirm } = Modal;

@Form.create()
@connect(({ monitorProject }) => ({
  monitorProject,
}))
export default class Show extends Component{
  constructor(props){
    super(props);
    this.state={
      showEdit:false, // 展示修改开关
      editData:"", // 编辑内容
    }
  }

  componentWillMount(){

  }

  deleteProject=v=>{
    confirm({
      title: `确认删除 ${v.projectName} ？`,
      content: "删除后不可恢复，请谨慎操作",
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'monitorProject/deleteProject',
          payload: {projectId:v.projectId},
          callback:v=>{
            if(v&&v.code===100){
              message.success("删除项目成功");
              dispatch({
                type: 'monitorProject/getProjects',
              });
            }else{
              message.error("删除项目失败，(* ￣︿￣)，请在稍后再试~");
            }
          }
        });
      }
    });
  }

  closeEdit=()=>{
    this.setState({showEdit:false});
  }

  render(){
    const { showEdit,editData } = this.state;
    const { form,toAdd,projects } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
    {
      title: '项目id',
      dataIndex: 'projectId',
      key: 'projectId',
    },{
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },  {
      title: '项目地址',
      dataIndex: 'projectAddress',
      key: 'projectAddress',
    }, {
      title: '项目描述',
      dataIndex: 'projectDescription',
      key: 'projectDescription',
    },{
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render:(text,record)=>(
        <div>
          <Button icon="form" onClick={()=>{this.setState({showEdit:true,editData:record})}} style={{marginRight:'10%'}}></Button>
          <Button icon="close" shape="circle" type="danger" onClick={()=>{this.deleteProject(record)}}></Button>
        </div>
      ),
    }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 8 },
        md: { span: 7 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 14 },
      },
    };
    return (
      <div>
        <Alert 
          message="Tip：用户界面提示"
          description="新建项目前请先确认用户或者角色已存在！"
          type="success"
          showIcon
          closable
        />
        <Button type="primary" icon="medicine-box" style={{marginTop:'1%',marginBottom:'1%'}} onClick={()=>{toAdd()}}>新建项目</Button>
        <Form layout="horizontal">
          <Row>
            <Col xs={24}  sm={11} md={11} lg={6}>
              <FormItem label="所属项目:" {...formItemLayout}>
                {getFieldDecorator('projectId', {
                  rules: [
                    { required: false, message: '请选择所属项目' },
                    { validator: this.checkmonitorPoint },
                  ],
                })(
                  <Select
                    placeholder="项目类型"
                  >
                    <Option value="1">xx项目</Option>
                  </Select>
                )}
              </FormItem>   
            </Col>
            <Col xs={24}  sm={10} md={10} lg={6}>
              <FormItem label="所属项目:" {...formItemLayout}>
                {getFieldDecorator('projectId', {
                  rules: [
                    { required: false, message: '请选择所属项目' },
                    { validator: this.checkmonitorPoint },
                  ],
                })(
                  <Select
                    placeholder="项目类型"
                  >
                    <Option value="1">xx项目</Option>
                  </Select>
                )}
              </FormItem>   
            </Col>
            <Col xs={24}  sm={10} md={10} lg={6}>
              <FormItem label="所属项目:" {...formItemLayout}>
                {getFieldDecorator('projectId', {
                  rules: [
                    { required: false, message: '请选择所属项目' },
                    { validator: this.checkmonitorPoint },
                  ],
                })(
                  <Select
                    placeholder="项目类型"
                  >
                    <Option value="1">xx项目</Option>
                  </Select>
                )}
              </FormItem>   
            </Col>
            <Col xs={24}  sm={6} md={6} lg={6}>
              <Button icon="search" type="primary" ghost>搜索</Button>
              <Button icon="redo" type="default" style={{marginLeft:'5%'}}>重置</Button>
            </Col>
          </Row>
        </Form>
        
        <Table dataSource={projects} columns={columns} bordered/>
        <Drawer
          title={`正在编辑第${editData.projectId}号项目`}
          width={720}
          placement="right"
          onClose={()=>{this.setState({showEdit:false});this.editForm.resetFields()}}
          maskClosable={true}
          visible={showEdit}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <Edit showEdit={showEdit} editData={editData} ref={c=>{this.editForm=c}} closeEdit={()=>{this.closeEdit()}}/>
        </Drawer>
      </div>
      );
  }
}