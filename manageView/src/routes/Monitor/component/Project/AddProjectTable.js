import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
export default class AddProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectBeginTime: [], // 项目开始时间
      projectEndTime: [], // 项目结束时间
      projectStatus: [], // 项目状态下拉
      projectType: [], // 项目类型下拉
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.parseTime = this.parseTime.bind(this);
  }

  componentWillMount() {
    axios
      .get('http://123.207.39.209:8090/managerProject/getCreateProjectData')
      .then(result => {
        const getStatus = result.data.data.projectStatusData;
        const statetemp = [];
        for (const key in getStatus) {
          if (key != null) {
            statetemp.push({ x: key, y: getStatus[key] });
          }
        }
        const getType = result.data.data.projectTypeData;
        const typetemp = [];
        for (const key in getType) {
          if (key != null) {
            typetemp.push({ x: key, y: getType[key] });
          }
        }

        this.setState({ projectStatus: statetemp, projectType: typetemp });
      })
      .catch(() => {
        message.error('获取下拉列表数据失败');
      });
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSubmit = e => {
    const { form } = this.props;
    const { props } = this;
    const { projectBeginTime, projectEndTime } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      const value = values;
      if (!err) {
        delete value.projectTime;
        value.projectBeginTime = projectBeginTime;
        value.projectEndTime = projectEndTime;
        axios
          .post('http://123.207.39.209:8090/managerProject/insertProject', value, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
          .then(() => {
            message.success('新增项目成功');
            setTimeout(() => {
              props.close();
              props.refresh();
              this.handleReset();
            }, 400);
          })
          .catch(() => {
            message.error('新增项目失败，请再试一次');
          });
      }
    });
  };

  parseTime(value, dateString) {
    this.setState({ projectBeginTime: dateString[0], projectEndTime: dateString[1] });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const { projectStatus, projectType } = this.state;
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem hasFeedback label="项目名称:" {...formItemLayout}>
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目名称' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目名称"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目类型:" {...formItemLayout}>
          {getFieldDecorator('projectType', {
            rules: [{ required: true, message: '请选择项目类型' }],
          })(
            <Select>
              {projectType.map(v => {
                return (
                  <Option key={v.x} value={v.x}>
                    {v.y}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback label="项目地址:" {...formItemLayout}>
          {getFieldDecorator('projectAddress', {
            rules: [{ required: true, message: '请输入项目地址' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目地址"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="天气地点:" {...formItemLayout}>
          {getFieldDecorator('weatherAddress', {
            rules: [{ required: true, message: '请输入天气地点' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="天气地点"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="经度:" {...formItemLayout}>
          {getFieldDecorator('projectLongitude', {
            rules: [{ required: true, message: '请输入经度' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="经度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="纬度:" {...formItemLayout}>
          {getFieldDecorator('projectLatitude', {
            rules: [{ required: true, message: '请输入纬度' }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="纬度"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目时间:" {...formItemLayout}>
          {getFieldDecorator('projectTime', {
            rules: [{ required: true, message: '请选择项目开始、结束时间' }],
          })(
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['项目开始时间', '项目结束时间']}
              onChange={this.parseTime}
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目状态:" {...formItemLayout}>
          {getFieldDecorator('projectStatus', {
            rules: [{ required: true, message: '请选择项目状态' }],
          })(
            <Select>
              {projectStatus.map(v => {
                return (
                  <Option value={v.x} key={v.x}>
                    {v.y}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback label="项目描述:" {...formItemLayout}>
          {getFieldDecorator('projectDescription', {
            rules: [{ required: true, message: '请输入项目描述' }],
          })(
            <TextArea
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目描述"
            />
          )}
        </FormItem>
        <hr />
        <FormItem style={{ marginBottom: '0px' }}>
          <Row gutter={1}>
            <Col span={4} offset={13}>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
            <Col span={4}>
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
