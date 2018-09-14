import React, { Component } from 'react';
import { Form, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class ModifyForm extends Component {
  render() {
    const { form, editTarget, dataTableName } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form>
        <FormItem hasFeedback label="相关表名" {...formItemLayout}>
          {getFieldDecorator('tableName', {
            rules: [{ required: false, message: '请选择项目类型' }],
            initialValue: editTarget.tableName,
          })(
            <Select placeholder="请选择项目类型" id="projectType1" showSearch>
              <Option key={-1} value={null}>
                no dataTable!
              </Option>
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
