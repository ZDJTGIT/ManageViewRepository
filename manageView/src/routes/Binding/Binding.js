import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Col,
  Row,
  Button,
  Input,
  Select,
} from 'antd';
import axios from 'axios';
import { dtuhttp } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './binding.less';

const { Option } = Select;

const fieldLabels = {
  name2: '终端编号',
  url2: '通道',
  owner2: 'Modbus地址',
  approver2: '传感器编号',
  dateRange2: '地址长度',
  type2: '传感器选择',
};

@Form.create()
export default class AdvancedForm extends PureComponent {

  state = {
    zhongduan: [],
    sensorbinding:[],
    length:0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.zhongduanAxios();
    this.sensorBinding();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
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
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err,value) => {
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

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { length } =this.state;

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
                    <Select showSearch placeholder="请选择终端" optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.owner2}>
                  {getFieldDecorator('modbus', {
                    rules: [{ required: true, message: '请选择Modbus地址' }],
                  })(
                    <Select placeholder="请选Modbus地址">
                      {this.modbus()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.approver2}>
                  {getFieldDecorator('sensornumber', {
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input placeholder="请输入" onChange={this.sensornumber.bind()} />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.dateRange2}>
                  {getFieldDecorator('length',{initialValue:length})(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.type2}>
                  {getFieldDecorator('sensortype', {
                    rules: [{ required: true, message: '请选择绑定传感器类型' }],
                  })(
                    <Select placeholder="请选择绑定传感器类型">
                      {this.sensorType()}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Col xl={{ span: 6, offset: 20 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  绑定
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

