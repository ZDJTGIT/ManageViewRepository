import React, { Component } from 'react';
import { Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class AddForm extends Component {
  render() {
    const { form, dataTableName } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form>
        <FormItem hasFeedback label="检测指标" {...formItemLayout}>
          {getFieldDecorator('itemName', {
            rules: [{ required: true, message: '请输入监测指标' }],
          })(<Input id="addItemName" type="text" placeholder="检测指标" />)}
        </FormItem>
        <FormItem hasFeedback label="itemValue" {...formItemLayout}>
          {getFieldDecorator('itemValue', {
            rules: [{ required: true, message: 'please input itemValue' }],
          })(<Input id="addItemValue" type="text" placeholder="itemValue" />)}
        </FormItem>
        <FormItem hasFeedback label="tableName" {...formItemLayout}>
          {getFieldDecorator('tableName', {
            rules: [{ required: false, message: 'please select tableName' }],
          })(
            <Select placeholder="请选择数据表名" id="addTableName" showSearch>
              {dataTableName.map(v => {
                return (
                  <Option key={v} value={v}>
                    {v}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
