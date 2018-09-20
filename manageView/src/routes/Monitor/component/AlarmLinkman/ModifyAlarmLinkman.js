import React, { Component } from 'react';
import { Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class ModifyAlarmLinkman extends Component {
  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form>
        <FormItem hasFeedback label="用户名" {...formItemLayout}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
            initialValue: data.userName,
          })(<Input id="modiUserName" type="text" placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem hasFeedback label="电话" {...formItemLayout}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入电话号码' }],
            initialValue: data.phone,
          })(<Input id="modiPhone" type="text" placeholder="请输入电话号码" />)}
        </FormItem>
        <FormItem hasFeedback label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱' }],
            initialValue: data.email,
          })(<Input id="modiEmail" type="text" placeholder="请输入邮箱" />)}
        </FormItem>
        <FormItem hasFeedback label="状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            rules: [{ required: true, message: '请选择告警人状态' }],
            initialValue: data.status,
          })(
            <Select placeholder="请选择告警人状态" id="addStatus" showSearch>
              <Option key="frogen" value={1}>
                启用
              </Option>
              <Option key="frogen" value={0}>
                禁用
              </Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
