import React, { Component } from 'react';
import { connect } from 'dva';
import { Input,Card,Form,Select,Icon,Row,Col,Button,message, Cascader,Alert,Radio,DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ subwaySector }) => ({
  subwaySector,
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
        dispatch({
          type: 'subwaySector/addSector',
          payload: values,
          callback:v=>{
            if(v&&v.code===100){
              form.resetFields();
              message.success("新增区间成功");
              dispatch({
                type: 'subwaySector/getSectors',
              });
            }else{
              message.error("新增区间失败，(* ￣︿￣)，请在稍后再试~")
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
              message="Tip：新建区间提示"
              description="区间名称请避免相同！"
              type="warning"
              showIcon
              closable
              style={{marginTop:'1%',marginBottom:'1%',textAlign:'center'}}
            />
          </Col>
          <Col span={24}>
            <FormItem label="项目名称:" {...formItemLayout}>
              {getFieldDecorator('projectId', {
                rules: [
                  { required: true, message: '请选择项目' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                >
                  <Option key="fake" value="1">假项目</Option>
                </Select>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间名称:" {...formItemLayout}>
              {getFieldDecorator('sectorName', {
                rules: [
                  { required: true, message: '请输入区间名' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入区间名"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间地址:" {...formItemLayout}>
              {getFieldDecorator('sectorAddress', {
                rules: [
                  { required: true, message: '请输入区间地址' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入区间地址"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间经度:" {...formItemLayout}>
              {getFieldDecorator('sectorLongitude', {
                rules: [
                  { required: true, message: '请输入区间经度' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入区间地址"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间纬度:" {...formItemLayout}>
              {getFieldDecorator('sectorLatitude', {
                rules: [
                  { required: true, message: '请输入区间纬度' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <Input placeholder="请输入区间纬度"/>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间时间:" {...formItemLayout}>
              {getFieldDecorator('sectorTime', {
                rules: [
                  { required: true, message: '请选择区间时间' },
                ],
              })(
                <RangePicker
                  style={{width:'100%'}}
                  showTime={{
                    hideDisabledOptions: true,
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间状态:" {...formItemLayout}>
              {getFieldDecorator('sectorStatus', {
                rules: [
                  { required: true, message: '请输入区间状态' },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>未开始</Radio>
                  <Radio value={2}>进行中</Radio>
                  <Radio value={3}>已结束</Radio>
                </RadioGroup>
              )}
            </FormItem>   
          </Col>
          <Col span={24}>
            <FormItem label="区间描述:" {...formItemLayout}>
              {getFieldDecorator('sectorDescription', {
                rules: [
                  { required: true, message: '请输入区间描述' },
                  { validator: this.checkmonitorPoint },
                ],
              })(
                <TextArea style={{resize:'none'}} rows={4} placeholder="请输入区间描述"/>
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