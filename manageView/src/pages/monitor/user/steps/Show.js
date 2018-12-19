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
@connect(({ monitorUser }) => ({
  monitorUser,
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

  deleteUser=v=>{
    confirm({
      title: `确认删除 ${v.userName} ？`,
      content: "删除后不可恢复，请谨慎操作",
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'monitorUser/deleteUser',
          payload: {userId:v.userId},
          callback:v=>{
            if(v.code===100){
              message.success(v.message);
              dispatch({
                type: 'monitorUser/getUser',
              });
            }else{
              message.success(v.message);
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
    const { users } = this.props.users;
    const { form,toAdd } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
    {
      title: '账户名',
      dataIndex: 'userName',
      key: 'userName',
    },{
      title: '账户编号',
      dataIndex: 'userId',
      key: 'userId',
    },  {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    }, {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },{
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render:(text,record)=>(
        <div>
          <Button icon="form" onClick={()=>{this.setState({showEdit:true,editData:record})}} style={{marginRight:'10%'}}></Button>
          <Button icon="close" shape="circle" type="danger" onClick={()=>{this.deleteUser(record)}}></Button>
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
          description="新建区间前请先确认用户或者角色已存在！"
          type="success"
          showIcon
          closable
        />
        <Button type="primary" icon="medicine-box" style={{marginTop:'1%',marginBottom:'1%'}} onClick={()=>{toAdd()}}>新建用户</Button>
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
                    placeholder="区间类型"
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
                    placeholder="区间类型"
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
                    placeholder="区间类型"
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
        
        <Table dataSource={users} columns={columns} bordered/>
        <Drawer
          title={`正在编辑：${editData.userName}`}
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