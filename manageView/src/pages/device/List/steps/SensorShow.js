import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Table,Drawer,DatePicker,Radio,Modal,Badge } from 'antd';
import {ChartCard,MiniArea,MiniBar,MiniProgress,Field,Bar,Pie,TimelineChart,yuan} from '@/components/Charts';
import SensorInfo from './SensorInfo';
import SensorEdit from './SensorEdit';
// import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { confirm } = Modal;

@Form.create()
@connect(({ deviceList,sysCode }) => ({
  deviceList,sysCode
}))
export default class SensorShow extends Component{
  constructor(props){
    super(props);
    this.state={
      showInfo:false, // 展示详情开关
      showEdit:false, // 展示修改开关
      editData:"", // 编辑内容
      showInfoData:"", // 详情内容
      deleteSensors:[], // 批量待删除的状态
    }
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCode/getAllParserMethods',
    })
  }

  deleteSensor=record=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/sensorIsInUse',
      payload: record.sensorNumber,
      callback:v=>{
        let msg = "删除后不可恢复，请谨慎操作"
        if(v&&v.code===0){
          msg = "注意：该传感器正在使用中，强行删除可能出现一系列不可预估问题!";
        }
        confirm({
          title: `确认删除 ${record.sensorName} ？`,
          content: <div style={{fontSize:"16px",color:"#F00"}}>{msg}</div>,
          okText: '确定',
          okType: 'danger',
          width: '666px',
          centered: 'true',
          maskClosable: 'true',
          cancelText: '取消',
          onOk:()=>{
            dispatch({
              type: 'deviceList/deleteSensor',
              payload: record,
              callback:_=>{
                if(_&&_.code===0){
                  message.success("删除传感器成功");
                  dispatch({
                    type: 'deviceList/getAllSensors',
                  });
                }else{
                  message.error("删除传感器失败，(* ￣︿￣)，请在稍后再试~");
                }
              }
            });
          }
        });
      }
    })
  }

  deleteSensors=()=>{
    const { deleteSensors } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/sensorsInUse',
      payload: deleteSensors,
      callback:v=>{
        let msg = ""
        if(v&&v.code===0){
          v.data.map(_=>{
            msg = `${msg}${_.sensorName}、`
          })
        }
        if(msg.length>0){
          msg = "注意："+msg.substring(0,msg.length-1)+" 传感器正在使用中，强行删除可能引发一系列未知错误！";
        }else{
          msg = "删除操作不可恢复，确认删除？";
        }
        confirm({
          title: `确认批量删除选中的传感器？`,
          content: <div style={{fontSize:"16px",color:"#F00"}}>{msg}</div>,
          okText: '确定',
          okType: 'danger',
          width: '666px',
          centered: 'true',
          maskClosable: 'true',
          cancelText: '取消',
          onOk:()=>{
            dispatch({
              type: 'deviceList/deleteSensors',
              payload: deleteSensors,
              callback:v=>{
                if(v&&v.code===0){
                  message.success("删除传感器成功");
                  this.setState({deleteSensors:[]})
                  dispatch({
                    type: 'deviceList/getAllSensors',
                  });
                }else{
                  message.error("删除传感器失败，(* ￣︿￣)，请在稍后再试~");
                }
              }
            });
          }
        });
      }
    });
    
  }

  closeEdit=()=>{
    this.setState({showEdit:false});
  }

  render(){
    const { showEdit,editData,showInfo,showInfoData } = this.state;
    const { form,toAdd,devices,sysCode } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
    {
      title: '传感器名称',
      dataIndex: 'sensorName',
      key: 'sensorName',
    },{
      title: '传感器编号',
      dataIndex: 'sensorNumber',
      key: 'sensorNumber',
    },  {
      title: '传感器型号',
      dataIndex: 'sensorModel',
      key: 'sensorModel',
    }, {
      title: '厂商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },{
      title: '量程',
      dataIndex: 'sensorRange',
      key: 'sensorRange',
    },{
      title: '精度',
      dataIndex: 'sensorAccuracy',
      key: 'sensorAccuracy',
    },{
      title: '标定系数',
      dataIndex: 'timingFactor',
      key: 'timingFactor',
    },{
      title: '解析方式',
      dataIndex: 'parserMethod',
      key: 'parserMethod',
      render:(value,record)=>{
        let temp = "解析错误";
        sysCode.parserMethods.map(v=>{
          if(v.scId==record.parserMethod){
            temp = v.itemName;
          }
        })
        return(temp);
      }
    },{
      title: '状态',
      dataIndex: 'sensorStatus',
      key: 'sensorStatus',
      render:(record)=>{
        const notStart = (
          <span>
            <Badge status="default" />未使用
          </span>
        );
        const started = (
          <span>
            <Badge status="success" />使用中
          </span>
        );
        const end = (
          <span>
            <Badge status="error" />已损坏
          </span>
        );
        if (record === 1) {
          return notStart;
        } else if (record === 2) {
          return started;
        } else if (record === 3) {
          return end;
        } else {
          return notStart;
        }
      }
    },{
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render:(text,record)=>(
        <div>
          <Icon type="search" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.setState({showInfo:true,showInfoData:record})}} />
          <Icon type="edit" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.setState({showEdit:true,editData:record})}} />
          <Icon type="delete" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} onClick={()=>{this.deleteSensor(record)}} />
          <Icon type="setting" style={{ fontSize: '20px', color: '#08c',cursor:'pointer',marginRight:5 }} />
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
        this.setState({deleteSensors:selectedRowKeys});
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div>
        <Row type='flex' justify='center' gutter='5'>
          <Col span={12}>
            <Card title="设备概况" style={{ borderRadius: '8px' }} extra={survey()}>
              <div style={{height:200}}>
              <Pie
                hasLegend
                title="销售额"
                subTitle="销售额"
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))
                    }}
                  />
                )}
                data={salesPieData}
                valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
              />
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="所属用户" style={{ borderRadius: '8px' }} extra={<div style={{height:30}}></div>}>
              <div style={{height:200}}></div>
            </Card>
          </Col>
        </Row>
        <Card style={{marginTop:1}}>
          <Button type="primary" icon="file-add" style={{marginBottom:'5px',marginRight:'10px',border:"0px"}} onClick={()=>{router.push('/device/addSensor')}}>新建</Button>
          <Button type="danger" icon="delete" style={{marginBottom:'5px',marginRight:'10px'}} onClick={()=>{this.deleteSensors()}}>批量删除</Button>
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
          
          <Table rowSelection={rowSelection} dataSource={devices} columns={columns} rowKey={record=>record.sensorId}/>
        </Card>
        <Modal
          visible={showInfo}
          title={<div><Icon type="eye" /> 预览</div>}
          onCancel={()=>{this.setState({showInfo:false})}}
          footer={null}
          destroyOnClose
          width={800}
        >
        <SensorInfo data={showInfoData}/>
        </Modal>
        <Drawer
          title={`正在编辑：${editData.sensorName}`}
          width={800}
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
          <SensorEdit showEdit={showEdit} editData={editData} ref={c=>{this.editForm=c}} closeEdit={()=>{this.closeEdit()}}/>
        </Drawer>
      </div>
      );
  }
}