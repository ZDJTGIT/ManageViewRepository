import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Form, Input, Select } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const { Option } = Select;
export default class AddSensorTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monitorPointOption: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentWillMount() {
    axios
      .get('http://123.207.39.209:8090/managerProject/getAddSensorData')
      .then(result => {
        const data1 = result.data.data;
        const temp = [];
        for (const key in data1) {
          if (key != null) {
            temp.push({ x: key, y: data1[key] });
          }
        }
        this.setState({ monitorPointOption: temp });
      })
      .catch(() => {
        message.error('获取下拉数据失败');
      });
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSubmit = e => {
    const { form, projectId, refresh } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      const value = values;
      value.projectId = projectId;
      if (!err) {
        axios
          .post('http://123.207.39.209:8090/managerProject/insertSensor', value, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
          .then(() => {
            message.success('新增传感器成功');
            setTimeout(() => {
              this.handleReset();
              refresh();
            }, 400);
          })
          .catch(() => {
            message.error('新增传感器失败');
          });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { monitorPointOption } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem hasFeedback label="测点名称:" {...formItemLayout}>
          {getFieldDecorator('monitorPoint', {
            rules: [{ required: true, message: '请输入测点名称' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="测点名称"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="监测类型:" {...formItemLayout}>
          {getFieldDecorator('monitorType', {
            rules: [{ required: true, message: '请选择监测类型' }],
          })(
            <Select>
              {monitorPointOption.map(v => {
                return (
                  <Option key={v.x} value={v.x}>
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
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="采集器编号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="采集器通道:" {...formItemLayout}>
          {getFieldDecorator('smuChannel', {
            rules: [{ required: true, message: '请输入采集器通道' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="采集器通道"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器编号:" {...formItemLayout}>
          {getFieldDecorator('sensorNumber', {
            rules: [{ required: true, message: '请输入传感器编号' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器编号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器类型:" {...formItemLayout}>
          {getFieldDecorator('sensorType', {
            rules: [{ required: true, message: '请输入传感器类型' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器类型"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器型号:" {...formItemLayout}>
          {getFieldDecorator('sensorModel', {
            rules: [{ required: true, message: '请输入传感器型号' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器型号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="经度:" {...formItemLayout}>
          {getFieldDecorator('sensorLongitude', {
            rules: [{ required: true, message: '请输入传感器经度' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="经度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="纬度:" {...formItemLayout}>
          {getFieldDecorator('sensorLatitude', {
            rules: [{ required: true, message: '请输入传感器纬度' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="纬度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器地点:" {...formItemLayout}>
          {getFieldDecorator('sensorPlace', {
            rules: [{ required: false }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器地点"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="传感器深度:" {...formItemLayout}>
          {getFieldDecorator('sensorDepth', {
            rules: [{ required: false }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="传感器深度"
            />
          )}
        </FormItem>
        <hr />
        <FormItem style={{ marginBottom: '0px' }}>
          <Row gutter={1}>
            <Col span={3} offset={15}>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
            <Col span={3}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}
