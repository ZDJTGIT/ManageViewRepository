import React, { Component } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Button,
  Input,
  Select,
  Timeline,
  Affix,
} from 'antd';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import { dtuhttp,wstcp } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './binding.less';
// import { Buffer } from 'buffer';

const { Option } = Select;

const fieldLabels = {
  name2: '终端编号',
  url2: '通道',
  owner2: 'Modbus地址',
  approver2: 'Modbus地址(传感器编号)',
  dateRange2: '地址长度',
  type2: '传感器选择',
};

const fieldLabels2 = {
  name2: '终端编号',
  url2: '通道',
  owner2: 'Modbus地址',
  approver2: 'Modbus地址(传感器编号)',
  dateRange2: '地址长度',
  type2: '传感器选择',
};

@Form.create()
export default class AdvancedForm extends Component {

  state = {
    zhongduan: [],
    sensorbinding:[],
    length:0,
    serverinfoSearch:[],
    sensorinfoSearch:[],
    errroinfoSearch:[],
    serverinfo:[],
    sensorinfo:[],
    errroinfo:[],
    key: 'tab1',
    searchSmuId:-1,
    searchsmuChan:-1,
    isSb:false,
  };


  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.zhongduanAxios();
    this.sensorBinding();
    this.mywebsocket();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }

  mywebsocket = ()=> {
    const socket = new SockJs(`${wstcp}webSocket`);

    /**
     * 建立成功的回调函数
     */
    socket.onopen = ()=> {
      console.log('open a connection');
    };

    /**
     * 服务器有消息返回的回调函数
     */
    socket.onmessage = (e)=> {
      console.log('message', e.data);
    };

    /**
     * websocket链接关闭的回调函数
     */
    socket.onclose = ()=> {
      console.log('close');
    };

    const stompClient = Stomp.over(socket);
    // let info=[];
    // let sensor=[];
    // let error=[];
    let index=0;
    stompClient.connect({}, ()=> {
        stompClient.subscribe(`/topic/notice`,  (data)=> {
          const { searchSmuId,searchsmuChan,serverinfoSearch,serverinfo } = this.state;
          if(searchSmuId!==-1 && searchsmuChan===-1){
            if((data.body.indexOf(searchSmuId))!==-1){
              this.info(serverinfo,index+=1,data,1,serverinfoSearch);
            }else{
              this.info(serverinfo,index+=1,data,1,-1);
            }
          }else if(searchSmuId!==-1 && searchsmuChan!==-1){
            if((data.body.indexOf(searchSmuId))!==-1 && (data.body.indexOf(`终端通道：${searchSmuId}`))!==-1){
              this.info(serverinfo,index+=1,data,1,serverinfoSearch);
            }else{
              this.info(serverinfo,index+=1,data,1,-1);
            }
          }else{
            this.info(serverinfo,index+=1,data,1,serverinfoSearch);
          }
        });
        stompClient.subscribe(`/topic/sensor`,  (data)=> {
          const { searchSmuId,searchsmuChan,sensorinfoSearch,sensorinfo } = this.state;
          if(searchSmuId!==-1 && searchsmuChan===-1){
            if((data.body.indexOf(searchSmuId))!==-1){
              this.info(sensorinfo,index+=1,data,2,sensorinfoSearch);
            }else{
              this.info(sensorinfo,index+=1,data,2,-1);
            }
          }else if(searchSmuId!==-1 && searchsmuChan!==-1){
            if((data.body.indexOf(searchSmuId))!==-1 && (data.body.indexOf(`终端通道：${searchSmuId}`))!==-1){
              this.info(sensorinfo,index+=1,data,1,sensorinfoSearch);
            }else{
              this.info(sensorinfo,index+=1,data,2,-1);
            }
          }else{
            this.info(sensorinfo,index+=1,data,2,sensorinfoSearch);
          }
        });
        stompClient.subscribe(`/topic/error`,  (data)=> {
          const { searchSmuId,searchsmuChan,errroinfoSearch,errroinfo } = this.state;
          if(searchSmuId!==-1 && searchsmuChan===-1){
            if((data.body.indexOf(searchSmuId))!==-1){
              this.info(errroinfo,index+=1,data,3,errroinfoSearch);
            }else{
              this.info(errroinfo,index+=1,data,3,-1);
            }
          }else if(searchSmuId!==-1 && searchsmuChan!==-1){
            if((data.body.indexOf(searchSmuId))!==-1 && (data.body.indexOf(`终端通道：${searchSmuId}`))!==-1){
              this.info(errroinfo,index+=1,data,3,errroinfoSearch);
            }else{
              this.info(errroinfo,index+=1,data,3,-1);
            }
          }else{
            this.info(errroinfo,index+=1,data,3,errroinfoSearch);
          }
        });
        stompClient.subscribe(`/topic/errorId`,  (data)=> {
          const { searchSmuId,searchsmuChan,errroinfoSearch,errroinfo } = this.state;
          if(searchSmuId!==-1 && searchsmuChan===-1){
            if((data.body.indexOf(searchSmuId))!==-1){
              this.info(errroinfo,index+=1,data,3,errroinfoSearch);
            }else{
              this.info(errroinfo,index+=1,data,3,-1);
            }
          }else if(searchSmuId!==-1 && searchsmuChan!==-1){
            if((data.body.indexOf(searchSmuId))!==-1 && (data.body.indexOf(`终端通道：${searchSmuId}`))!==-1){
              this.info(errroinfo,index+=1,data,1,errroinfoSearch);
            }else{
              this.info(errroinfo,index+=1,data,3,-1);
            }
          }else{
            this.info(errroinfo,index+=1,data,3,errroinfoSearch);
          }
        });
    });
  }

  info = (info,index,data,type,infosearch)=> {
    if(type===1){
      if(infosearch!==-1){
        info.push(<Timeline.Item key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        infosearch.push(<Timeline.Item key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>)
        this.setState({
          serverinfo:info,
          serverinfoSearch:infosearch,
        })
       }
       else{
        info.push(<Timeline.Item key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        this.setState({
          serverinfo:info,
        })
      }
    }else if(type===2){
      if(infosearch!==-1){
        info.push(<Timeline.Item color="green" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        infosearch.push(<Timeline.Item color="green" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>)
        this.setState({
          sensorinfo:info,
          sensorinfoSearch:infosearch,
        })
      }else{
        info.push(<Timeline.Item color="green" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        this.setState({
          sensorinfo:info,
        })
      }

    }else if(type===3){
      if(infosearch!==-1){
        info.push(<Timeline.Item color="red" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        infosearch.push(<Timeline.Item color="red" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>)
        this.setState({
          errroinfo:info,
          errroinfoSearch:infosearch,
        })
      }else{
        info.push(<Timeline.Item color="red" key={index}>{(new Date()).toLocaleDateString()} {(new Date()).toLocaleTimeString()}：{data.body}</Timeline.Item>);
        this.setState({
          errroinfo:info,
        })
      }
    }
  }

  zhongduanAxios = ()=> {
    axios
      .get(`${dtuhttp}terminal/listTerminal`)
      .then(res => {
        this.setState({
          zhongduan: res.data.data,
        });
      })
  }

  sensorBinding = ()=> {
    axios
      .get(`${dtuhttp}terminal/listSenBin`)
      .then(res => {
        this.setState({
          sensorbinding:res.data.data,
        });
      })
  }

  bindingAxion = (value)=> {
    axios.post(`${dtuhttp}deviceBinding/binding`,value
    ).then(res => {
      console.log(res.data);
    }
  )
  }

  sensorType = ()=> {
    const { sensorbinding } = this.state;
    const cul = [];
    if(!(sensorbinding.length===0)){
      sensorbinding.forEach((value)=>{
        cul.push(<Option key={value.sbiId} value={value.instruction}>{value.name}</Option>)
      })
    }
    return cul;
  }

  zhongduan = ()=> {
    const { zhongduan } = this.state;
    const cul = [];
    if(!(zhongduan.length===0)){
      zhongduan.forEach((value)=>{
        cul.push(<Option key={value.dtuId} value={value.dtuImei}>{value.dtuImei}</Option>)
      })
    }
    return cul;
  }

  modbus = ()=> {
    const cul = [];
    let index=0;
    for (let a=0; a<16; a+=1){
      for (let b=0; b<16 ; b+=1){
          index+=1;
          const ii = (a).toString(16).toLocaleUpperCase();
          const jj = (b).toString(16).toLocaleUpperCase();
          cul.push(<Option key={index} value={`${ii}${jj}`}>{`${ii}${jj}`}</Option>);
      }
    }
    return cul;
  }

  sensornumber = (e)=> {
    const value = e.target;
    const a = (value.value.length)*0.5;
    this.setState({
      length:a,
    })
  }

  handleSubmit = e => {
    this.setState({
      isSb:true,
    })
    window.setTimeout(()=>{
      this.setState({
        isSb:false,
      })
    },4000);
    e.preventDefault();
    const { form } = this.props;
    form.validateFields(['smucmsid','smucmschan','sensornumber','length','sensortype'],(err,value) => {
      if (err) return;
      const val= {
        method: value.sensortype,
        smuId: value.smucmsid,
        cmsId: value.smucmsid,
        cmsChannel: value.smucmschan,
        dataLength: value.length,
        validData: value.sensornumber,
      }
      this.bindingAxion(val);
    });
  };

  filterSmu = () => {
    const { form } = this.props;
    const { serverinfo,sensorinfo,errroinfo } = this.state;
    const serverinfos = [];
    const sensorinfos = [];
    const errroinfos = [];
    const smuidSerch = form.getFieldValue("smucmsidSerch");
    const smuscherch = form.getFieldValue("smucmschanSerch");
    if(smuidSerch!==undefined && smuscherch===undefined){
      console.log("yige")
      serverinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        if(position!==-1){
          serverinfos.push(data)
        }
      });
      sensorinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        if(position!==-1){
          sensorinfos.push(data)
        }
      });
      errroinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        if(position!==-1){
          errroinfo.push(data)
        }
      });
      this.setState({
        searchSmuId:smuidSerch,
        serverinfoSearch:serverinfos,
        sensorinfoSearch:sensorinfos,
        errroinfoSearch:errroinfos,
      })
    }else if(smuidSerch!==undefined && smuscherch!==undefined){
      console.log("liangge")
      serverinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        const positionid = method.indexOf(`终端通道：${smuscherch}`);
        if(position!==-1 && positionid!==-1){
          serverinfos.push(data)
        }
      });
      sensorinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        const positionid = method.indexOf(`终端通道：${smuscherch}`);
        if(position!==-1 && positionid!==-1){
          sensorinfos.push(data)
        }
      });
      errroinfo.forEach((data)=>{
        const method = (data.props.children)[4];
        const position = method.indexOf(smuidSerch);
        const positionid = method.indexOf(`终端通道：${smuscherch}`);
        if(position!==-1 && positionid!==-1){
          errroinfos.push(data)
        }
      });
      this.setState({
        searchSmuId:smuidSerch,
        searchsmuChan:smuscherch,
        serverinfoSearch:serverinfos,
        sensorinfoSearch:sensorinfos,
        errroinfoSearch:errroinfos,
      })
    }

  }

  collectionData = ()=> {
    
  }

  clsDataServer = ()=> {
    const { form } = this.props;
    const name = ["smucmsidSerch","smucmschanSerch"];
    const { serverinfo,sensorinfo,errroinfo } = this.state;
    const serverinfos = [];
    const sensorinfos = [];
    const errroinfos = [];
    form.resetFields(name);

    serverinfo.forEach((data)=>{
      serverinfos.push(data)
    });
    sensorinfo.forEach((data)=>{
      sensorinfos.push(data)
    });
    errroinfo.forEach((data)=>{
      errroinfos.push(data)
    });

    this.setState({
      serverinfoSearch:serverinfos,
      sensorinfoSearch:sensorinfos,
      errroinfoSearch:errroinfos,
      searchSmuId:-1,
      searchsmuChan:-1,
    })
  }

  clsServerinfo = ()=> {
    this.setState({
      serverinfo:[],
      serverinfoSearch:[],
    })
  }

  clsSensorinfo = ()=> {
    this.setState({
      sensorinfo:[],
      sensorinfoSearch:[],
    })
  }

  clsErrorinfo = ()=> {
    this.setState({
      errroinfo:[],
      errroinfoSearch:[],
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { length,serverinfoSearch,key,sensorinfoSearch,errroinfoSearch,isSb } =this.state;
    const tabList = [{
      key: 'tab1',
      tab: '消息记录',
    }, {
      key: 'tab2',
      tab: '数据接收记录',
    },{
      key: 'tab3',
      tab: '异常记录',
    }];
    
    const contentList = {
      tab1: <div><Col style={{marginBottom:'10px'}}><Affix offsetTop={10}><Button type="primary" onClick={this.clsServerinfo.bind()}>清除消息记录</Button></Affix></Col><Col><Timeline>{serverinfoSearch}</Timeline></Col></div>,
      tab2: <div><Col style={{marginBottom:'10px'}}><Affix offsetTop={10}><Button type="primary" onClick={this.clsSensorinfo.bind()}>清除数据接收记录</Button></Affix></Col><Col><Timeline>{sensorinfoSearch}</Timeline></Col></div>,
      tab3: <div><Col style={{marginBottom:'10px'}}><Affix offsetTop={10}><Button type="primary" onClick={this.clsErrorinfo.bind()}>清除异常记录</Button></Affix></Col><Col><Timeline>{errroinfoSearch}</Timeline></Col></div>,
    };

    return (
      <PageHeaderLayout
        title="终端绑定"
        content="珠海终端绑定界面"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="终端绑定" className={styles.card} bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}> 
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name2}>
                  {getFieldDecorator('smucmsid', {
                    rules: [{ required: true, message: '请选择终端' }],
                  })(
                    <Select showSearch placeholder="输入关键字可搜索">
                      { this.zhongduan() }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.url2}>
                  {getFieldDecorator('smucmschan', {
                    rules: [{ required: true, message: '请选择通道' }],
                  })(
                    <Select placeholder="请选择通道">
                      <Option value="00">00</Option>
                      <Option value="01">01</Option>
                      <Option value="02">02</Option>
                      <Option value="03">03</Option>
                      <Option value="04">04</Option>
                      <Option value="05">05</Option>
                      <Option value="06">06</Option>
                      <Option value="07">07</Option>
                      <Option value="08">08</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.approver2}>
                  {getFieldDecorator('sensornumber', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input placeholder="请输入" onChange={this.sensornumber.bind()} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.dateRange2}>
                  {getFieldDecorator('length',{initialValue:length})(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.type2}>
                  {getFieldDecorator('sensortype', {
                    rules: [{ required: true, message: '请选择绑定传感器类型' }],
                  })(
                    <Select placeholder="输入关键字可搜索" showSearch optionFilterProp="children">
                      {this.sensorType()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} style={{marginTop:'40px'}}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={isSb}>
                    绑定
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="采集单个数据" className={styles.card} bordered={false}>
          <Form onSubmit={this.collectionData} hideRequiredMark style={{ marginTop: 8 }}> 
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels2.name2}>
                  {getFieldDecorator('smucmsidCollection', {
                    rules: [{ required: true, message: '请选择终端' }],
                  })(
                    <Select showSearch placeholder="输入关键字可搜索">
                      { this.zhongduan() }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels2.url2}>
                  {getFieldDecorator('smucmschanCollection', {
                    rules: [{ required: true, message: '请选择通道' }],
                  })(
                    <Select placeholder="请选择通道">
                      <Option value="00">00</Option>
                      <Option value="01">01</Option>
                      <Option value="02">02</Option>
                      <Option value="03">03</Option>
                      <Option value="04">04</Option>
                      <Option value="05">05</Option>
                      <Option value="06">06</Option>
                      <Option value="07">07</Option>
                      <Option value="08">08</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels2.approver2}>
                  {getFieldDecorator('sensornumberCollection', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input placeholder="请输入" onChange={this.sensornumber.bind()} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels2.dateRange2}>
                  {getFieldDecorator('lengthCollection',{initialValue:length})(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels2.type2}>
                  {getFieldDecorator('sensortypeCollection', {
                    rules: [{ required: true, message: '请选择绑定传感器类型' }],
                  })(
                    <Select placeholder="输入关键字可搜索" showSearch optionFilterProp="children">
                      {this.sensorType()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} style={{marginTop:'40px'}}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    采集
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 接收数据筛选条件 */}
        <Card>
          <Form layout="inline">
            <Form.Item>
              {getFieldDecorator('smucmsidSerch', {rules: [{ required: true, message: '请选择绑定传感器类型' }],
                  })(
                    <Select showSearch placeholder="终端编号" style={{width:'200px'}}>
                      { this.zhongduan() }
                    </Select>
                  )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('smucmschanSerch', {
                  })(
                    <Select placeholder="终端通道" style={{width:'150px'}}>
                      <Option value="00">00</Option>
                      <Option value="01">01</Option>
                      <Option value="02">02</Option>
                      <Option value="03">03</Option>
                      <Option value="04">04</Option>
                      <Option value="05">05</Option>
                      <Option value="06">06</Option>
                      <Option value="07">07</Option>
                      <Option value="08">08</Option>
                    </Select>
                  )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.filterSmu}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.clsDataServer.bind()}>
                显示所有
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card
          style={{ width: '100%' }}
          // title="消息接收"
          // extra={<a href="#">More</a>}
          tabList={tabList}
          activeTabKey={key}
          onTabChange={(key2) => { this.onTabChange(key2, 'key'); }}
        >
          {contentList[key]}
        </Card>
      </PageHeaderLayout>
    );
  }
}

