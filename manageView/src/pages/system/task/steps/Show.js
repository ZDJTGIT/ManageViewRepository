import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio,Modal,Badge,Tooltip } from 'antd';
import {ChartCard,MiniArea,MiniBar,MiniProgress,Field,Bar,Pie,TimelineChart,yuan} from '@/components/Charts';
// import Info from './Info';
import Edit from './Edit';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { confirm } = Modal;

@Form.create()
@connect(({ taskList }) => ({
  taskList
}))
export default class Show extends Component{
  constructor(props){
    super(props);
    this.state={
      showInfo:false, // 展示详情开关
      showEdit:false, // 展示修改开关
      editData:"", // 编辑内容
      showInfoData:"", // 预览内容
      showSend:false, // 发送内容modal开关
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'taskList/getAllTasks',
    // })
  }

  deleteTask=v=>{
    confirm({
      title: `确认删除 ${v.taskName} 任务 ？`,
      content: "删除后不可恢复，请谨慎操作",
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'taskList/deleteTask',
          payload: v,
          callback:v=>{
            if(v&&v.code===0){
              message.success(v.msg);
              dispatch({
                type: 'taskList/getAllTasks',
              });
            }else{
              message.error(v.msg);
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
    const { showEdit,editData,showInfo,showInfoData,showSend } = this.state;
    const { form,toAdd,taskList,tasks } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },  {
      title: '任务组名',
      dataIndex: 'taskGroup',
      key: 'taskGroup',
    },{
      title: '任务描述',
      dataIndex: 'taskDescription',
      key: 'taskDescription',
    }, {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
    },{
      title: '任务触发表达式',
      dataIndex: 'taskCorn',
      key: 'taskCorn',
    },{
      title: '任务触发间隔时间（单位分钟）',
      dataIndex: 'intervalInMinutes',
      key: 'intervalInMinutes',
    },{
      title: '任务执行类',
      dataIndex: 'taskClass',
      key: 'taskClass',
    },{
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render:(text,record)=>(
        <div>
          <Tooltip placement="top" title={"详情"}>
            <Icon type="search" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.setState({showInfo:true,showInfoData:record})}} />
          </Tooltip>
          <Tooltip placement="top" title={"编辑"}>
            <Icon type="edit" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.setState({editData:record,showEdit:true})}} />
          </Tooltip>
          <Tooltip placement="top" title={"删除"}>
            <Icon type="delete" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.deleteTask(record)}} />
          </Tooltip>
          <Tooltip placement="top" title={"手动采集"}>
            <Icon type="setting" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.setState({showSend:true})}} />
          </Tooltip>
        </div>
      ),
    }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
        md: { span: 4 },
        lg: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 14 },
      },
    };
    const survey =_=> {
      return(
        <div style={{height:30}}>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
      )
    }
    const salesPieData = [
      {
        x: '家用电器',
        y: 4544,
      },
      {
        x: '食用酒水',
        y: 3321,
      },
      {
        x: '个护健康',
        y: 3113,
      },
      {
        x: '服饰箱包',
        y: 2341,
      },
      {
        x: '母婴产品',
        y: 1231,
      },
      {
        x: '其他',
        y: 1231,
      },
    ];    
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        <Card style={{marginTop:1}}>
          <Button type="primary" icon="file-add" style={{marginBottom:'5px',marginRight:'10px',border:"0px"}} onClick={()=>{router.push('/system/addList')}}>新建</Button>
          <Button type="danger" icon="delete" style={{marginBottom:'5px',marginRight:'10px'}} onClick={()=>{toAdd()}}>批量删除</Button>
          <Button type="primary" icon="select" style={{marginBottom:'5px',marginRight:'10px'}} onClick={()=>{toAdd()}}>导出设备</Button>
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
          
          <Table rowSelection={rowSelection} dataSource={tasks} columns={columns}/>
        </Card>
        <Modal
          visible={showInfo}
          title={"预览"}
          onCancel={()=>{this.setState({showInfo:false})}}
          footer={null}
          destroyOnClose
          width={800}
         
        >
          {/* <Info data={showInfoData} /> */}
        </Modal>
        <Modal
          visible={showSend}
          title={"手动采集"}
          onCancel={()=>{this.setState({showSend:false})}}
          footer={null}
          destroyOnClose
          width={800}
         
        >
          1111111111111111
        </Modal>
        <Drawer
          title={`正在编辑：${editData.taskName} 任务`}
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