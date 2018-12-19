import React,{Component} from 'react';
import {Form,Row,Col,Icon,Input,Select,DatePicker} from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Form.create()
export default class AlarmLinkMan extends Component{
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
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
    return (
      <Form layout="horizontal" style={{marginTop:'3%'}}>
      <Row>
        <Col xs={24}  sm={12} md={12} lg={12}>
          <FormItem label="用&nbsp;户&nbsp;名:" {...formItemLayout}>
            {getFieldDecorator('userName', {
              rules: [
                { required: true, message: '请输入用户名' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.userName,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="项目名"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={12}>
          <FormItem label="联系电话:" {...formItemLayout}>
            {getFieldDecorator('projectLogitude', {
              rules: [
                { required: true, message: '请输入联系电话' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.projectLogitude,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="联系电话"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={12}>
          <FormItem label="邮&emsp;&emsp;箱:" {...formItemLayout}>
            {getFieldDecorator('projectAddress', {
              rules: [
                { required: true, message: '请输入邮箱' },
                { validator: this.projectAddress },
              ],
              initialValue: data.projectAddress,
            })(
              <Input
                type="text"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="邮箱"
              />
            )}
          </FormItem>   
        </Col>
        <Col xs={24}  sm={12} md={12} lg={12}>
          <FormItem label="状&emsp;&emsp;态:" {...formItemLayout}>
            {getFieldDecorator('projectType', {
              rules: [
                { required: true, message: '请选择联系人状态' },
                { validator: this.checkmonitorPoint },
              ],
              initialValue: data.projectType,
            })(
              <Select
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="状态"
              >
                <Option value="1">启用</Option>
                <Option value="2">禁用</Option>
              </Select>
            )}
          </FormItem>   
        </Col>
      </Row>
    </Form>
    );
  }
}