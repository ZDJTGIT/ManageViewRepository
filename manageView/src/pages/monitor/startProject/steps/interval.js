import React,{Component} from 'react';
import { Form,Row,Col,Input,Icon,Select,DatePicker } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;

@Form.create()
export default class IntervalInfo extends Component{
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    const { form,data } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
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
      <Form layout="horizontal" style={{marginTop:'3%'}}>
      <Row>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区&nbsp;间&nbsp;名:" {...formItemLayout}>
            {getFieldDecorator('intervalName', {
              rules: [
                { required: true, message: '请输入区间名' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalName,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间名"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间类型:" {...formItemLayout}>
            {getFieldDecorator('intervalType', {
              rules: [
                { required: true, message: '请选择区间类型' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalType,
            })(
              <Select
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间类型"
              >
                <Option value="1">yy区间</Option>
              </Select>
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间地址:" {...formItemLayout}>
            {getFieldDecorator('intervalAddress', {
              rules: [
                { required: true, message: '请输入区间地址' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalAddress,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间地址"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间经度:" {...formItemLayout}>
            {getFieldDecorator('intervalLogitude', {
              rules: [
                { required: true, message: '请输入区间经度' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalLogitude,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间经度"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间纬度:" {...formItemLayout}>
            {getFieldDecorator('intervalLatitude', {
              rules: [
                { required: true, message: '请输入区间纬度' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalLatitude,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间纬度"
              />
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间时间:" {...formItemLayout}>
            {getFieldDecorator('intervalTime', {
              rules: [
                { required: true, message: '请选择区间起止时间' },
                // { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalTime,
            })(
              <RangePicker showTime={{ format:'HH:mm:ss'}} format="YYYY-MM-DD" style={{width:'100%'}}/>
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间状态:" {...formItemLayout}>
            {getFieldDecorator('intervalStatus', {
              rules: [
                { required: true, message: '请选择区间状态' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalStatus,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间状态"
              />
            )}
          </FormItem>
        </Col>
        <Col xs={24}  sm={12} md={12} lg={8}>
          <FormItem label="区间描述:" {...formItemLayout}>
            {getFieldDecorator('intervalDescription', {
              rules: [
                { required: true, message: '请输入区间描述' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.intervalDescription,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="区间描述"
              />
            )}
          </FormItem>   
        </Col>
      </Row>
    </Form>
    );
  }
}