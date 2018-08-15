import React, { Component } from 'react';
import { Form, Input, Icon, DatePicker, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
export default class ModifyUserFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="horizontal">
        <FormItem hasFeedback label="用户名:" {...formItemLayout}>
          {getFieldDecorator('userName', {
            rules: [{ required: false, message: '请输入用户名' }],
            initialValue: data.userName,
          })(
            <Input
              id="userName1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
              disabled
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="手机号码:" {...formItemLayout}>
          {getFieldDecorator('phone', {
            rules: [{ required: false, message: '请输入手机号码' }],
            initialValue: data.phone,
          })(
            <Input
              id="phone1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="手机号码"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="邮箱:" {...formItemLayout}>
          {getFieldDecorator('email', {
            rules: [{ required: false, message: '请输入邮箱' }],
            initialValue: data.email,
          })(
            <Input
              id="email1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="邮箱"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="公司名:" {...formItemLayout}>
          {getFieldDecorator('company', {
            rules: [{ required: false, message: '请输入公司名' }],
            initialValue: data.company,
          })(
            <Input
              id="company1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="公司名"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="负责人:" {...formItemLayout}>
          {getFieldDecorator('realName', {
            rules: [{ required: false, message: '请输入负责人' }],
            initialValue: data.realName,
          })(
            <Input
              id="realName1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="负责人"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="创建时间:" {...formItemLayout}>
          {getFieldDecorator('time', {
            rules: [{ required: false, message: '请选择创建时间' }],
            initialValue: moment(data.createTime, 'YYYY-MM-DD HH:mm:ss'),
          })(
            <DatePicker
              id="time1"
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="用户状态:" {...formItemLayout}>
          {getFieldDecorator('status', {
            rules: [{ required: false, message: '请选择用户状态' }],
            initialValue: data.status,
          })(
            <Select id="status1">
              <Option key="1" value="正常">
                正常
              </Option>
              <Option key="2" value="冻结">
                冻结
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
