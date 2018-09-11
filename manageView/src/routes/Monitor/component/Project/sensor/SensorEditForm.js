import React, { Component } from 'react';
import { Form, Input, Icon, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
export default class SensorEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form, data, monitorPointOption } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal">
        <FormItem hasFeedback label="测点名称:" {...formItemLayout}>
          {getFieldDecorator('monitorPoint', {
            rules: [{ required: true, message: '请输入测点名称' }],
            initialValue: data.monitorPoint,
          })(
            <Input
              id="monitorPoint1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="测点名称"
              // disabled
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="检测类型:" {...formItemLayout}>
          {getFieldDecorator('monitorType', {
            rules: [{ required: true, message: '请选择检测类型' }],
            initialValue: data.monitorType,
          })(
            <Select placeholder="请选择项目类型" id="monitorType1">
              {monitorPointOption.map(v => {
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
        <FormItem hasFeedback label="采集器编号:" {...formItemLayout}>
          {getFieldDecorator('smuNumber', {
            rules: [{ required: true, message: '请输入采集器编号' }],
            initialValue: data.smuNumber,
          })(
            <Input
              id="smuNumber1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="采集器编号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="采集器通道:" {...formItemLayout}>
          {getFieldDecorator('smuChannel', {
            rules: [{ required: true, message: '请输入采集器通道' }],
            initialValue: data.smuChannel,
          })(
            <Input
              id="smuChannel1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="采集器通道"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器编号:" {...formItemLayout}>
          {getFieldDecorator('sensorNumber', {
            rules: [{ required: true, message: '请输入传感器编号' }],
            initialValue: data.sensorNumber,
          })(
            <Input
              id="sensorNumber1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器编号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器类型:" {...formItemLayout}>
          {getFieldDecorator('sensorType', {
            rules: [{ required: true, message: '请输入传感器类型' }],
            initialValue: data.sensorType,
          })(
            <Input
              id="sensorType1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器类型"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器型号:" {...formItemLayout}>
          {getFieldDecorator('sensorModel', {
            rules: [{ required: true, message: '请输入传感器型号' }],
            initialValue: data.sensorModel,
          })(
            <Input
              id="sensorModel1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器型号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器经度:" {...formItemLayout}>
          {getFieldDecorator('sensorLongitude', {
            rules: [{ required: true, message: '请输入传感器经度' }],
            initialValue: data.sensorLongitude,
          })(
            <Input
              id="sensorLongitude1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器经度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器纬度:" {...formItemLayout}>
          {getFieldDecorator('sensorLatitude', {
            rules: [{ required: true, message: '请输入传感器纬度' }],
            initialValue: data.sensorLatitude,
          })(
            <Input
              id="sensorLatitude1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器纬度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器地址:" {...formItemLayout}>
          {getFieldDecorator('sensorPlace', {
            rules: [{ required: false, message: '请输入传感器地址' }],
            initialValue: data.sensorPlace,
          })(
            <Input
              id="sensorPlace1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器地址"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器深度:" {...formItemLayout}>
          {getFieldDecorator('sensorDepth', {
            rules: [{ required: false, message: '请输入传感器深度' }],
            initialValue: data.sensorDepth,
          })(
            <Input
              id="sensorDepth1"
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器深度"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
