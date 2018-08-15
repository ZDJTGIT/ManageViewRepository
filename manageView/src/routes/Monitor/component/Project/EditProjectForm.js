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
    const { form, data, status, type } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal">
        <FormItem hasFeedback label="项目名:" {...formItemLayout}>
          {getFieldDecorator('projectName', {
            rules: [{ required: false, message: '请输入项目名' }],
            initialValue: data.projectName,
          })(
            <Input
              id="projectName1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目名"
              disabled
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目类型:" {...formItemLayout}>
          {getFieldDecorator('projectType', {
            rules: [{ required: false, message: '请选择项目类型' }],
            initialValue: data.projectType,
          })(
            <Select placeholder="请选择项目类型" id="projectType1">
              {type.map(v => {
                const value = parseInt(v.x, 10);
                return (
                  <Option key={v.x} value={value}>
                    {v.y}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback label="项目地址:" {...formItemLayout}>
          {getFieldDecorator('projectAddress', {
            rules: [{ required: false, message: '请输入项目地址' }],
            initialValue: data.projectAddress,
          })(
            <Input
              id="projectAddress1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目地址"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="天气地址:" {...formItemLayout}>
          {getFieldDecorator('weatherAddress', {
            rules: [{ required: false, message: '请输入天气地址' }],
            initialValue: data.weatherAddress,
          })(
            <Input
              id="weatherAddress1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="天气地址"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目经度:" {...formItemLayout}>
          {getFieldDecorator('projectLongitude', {
            rules: [{ required: false, message: '请输入项目经度' }],
            initialValue: data.projectLongitude,
          })(
            <Input
              id="projectLongitude1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目经度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目纬度:" {...formItemLayout}>
          {getFieldDecorator('projectLatitude', {
            rules: [{ required: false, message: '请输入项目纬度' }],
            initialValue: data.projectLatitude,
          })(
            <Input
              id="projectLatitude1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目纬度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目开始时间:" {...formItemLayout}>
          {getFieldDecorator('projectBegin', {
            rules: [{ required: false, message: '请选择项目开始时间' }],
            initialValue: moment(data.projectBeginTime, 'YYYY-MM-DD HH:mm:ss'),
          })(
            <DatePicker
              id="begin1"
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目结束时间:" {...formItemLayout}>
          {getFieldDecorator('projectEnd', {
            rules: [{ required: false, message: '请选择项目结束时间' }],
            initialValue: moment(data.projectEndTime, 'YYYY-MM-DD HH:mm:ss'),
          })(
            <DatePicker id="end1" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目状态:" {...formItemLayout}>
          {getFieldDecorator('projectStatus', {
            rules: [{ required: false, message: '请选择项目状态' }],
            initialValue: data.projectStatus,
          })(
            <Select placeholder="请选择项目类型" id="projectStatus1">
              {status.map(v => {
                const value = parseInt(v.x, 10);
                return (
                  <Option key={v.x} value={value}>
                    {v.y}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback label="项目描述:" {...formItemLayout}>
          {getFieldDecorator('projectDescription', {
            rules: [{ required: false, message: '请输入项目描述' }],
            initialValue: data.projectDescription,
          })(
            <Input
              id="projectDescription1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目描述"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目图片地址:" {...formItemLayout}>
          {getFieldDecorator('projectImageUrl', {
            rules: [{ required: false, message: '请输入项目图片地址' }],
            initialValue: data.projectImageUrl,
          })(
            <Input
              id="projectImageUrl1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目图片地址"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
