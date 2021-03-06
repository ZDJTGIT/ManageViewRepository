import React, { Component } from 'react';
import {
  Row,
  Col,
  message,
  Button,
  Icon,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Progress,
} from 'antd';
import axios from 'axios';
import '../../../Config';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
export default class AddProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectBeginTime: '', // 项目开始时间
      projectEndTime: '', // 项目结束时间
      projectName: '',
      projectAddress: '',
      projectDescription: '',
      projectLatitude: '',
      projectLongitude: '',
      projectStatus1: '',
      projectType1: '',
      weatherAddress: '',
      projectStatus: [], // 项目状态下拉
      projectType: [], // 项目类型下拉
      progressPercent: '0',
      showProgress: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.parseTime = this.parseTime.bind(this);
    this.progressCancel = this.progressCancel.bind(this);
    this.checkProject = this.checkProject.bind(this);
    this.checkProjectType = this.checkProjectType.bind(this);
    this.checkProjectAddress = this.checkProjectAddress.bind(this);
    this.checkWeatherAddress = this.checkWeatherAddress.bind(this);
    this.checkProjectLongitude = this.checkProjectLongitude.bind(this);
    this.checkProjectLatitude = this.checkProjectLatitude.bind(this);
    this.checkProjectTime = this.checkProjectTime.bind(this);
    this.checkProjectState = this.checkProjectState.bind(this);
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getCreateProjectData`)
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
    document.getElementById('subForm').reset();
    this.setState({ showProgress: false });
    this.setState({ progressPercent: '0' });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { props } = this;
    form.validateFields((err, values) => {
      const value = values;
      if (!err) {
        this.setState({ showProgress: true });
        this.setState({
          projectName: value.projectName,
          projectAddress: value.projectAddress,
          projectDescription: value.projectDescription,
          projectLatitude: value.projectLatitude,
          projectLongitude: value.projectLongitude,
          projectStatus1: value.projectStatus,
          projectType1: value.projectType,
          weatherAddress: value.weatherAddress,
        });
        setTimeout(() => {
          const formData = new FormData(document.getElementById('subForm'));
          axios
            .post(`http://${global.constants.onlineWeb}/managerProject/insertProject`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data;charset=UTF-8',
              },
              onUploadProgress: progressEvent => {
                const num = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.setState({ progressPercent: num });
              },
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
              this.setState({ showProgress: false });
              message.error('新增项目失败，请再试一次');
            });
        }, 200);
      }
    });
  };

  progressCancel() {
    this.setState({ showProgress: false });
  }

  parseTime(value, dateString) {
    this.setState({ projectBeginTime: dateString[0], projectEndTime: dateString[1] });
  }

  // 检查项目名
  checkProject(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('项目名不能为空');
    }
  }

  // 检查项目类型
  checkProjectType(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('项目类型不能为空');
    }
  }

  // 检查项目地址
  checkProjectAddress(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('项目地址不能为空');
    }
  }

  // 检查天气地址
  checkWeatherAddress(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('天气地址不能为空');
    }
  }

  // 检查项目经度
  checkProjectLongitude(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      const regu2 =
        '^(\\-|\\+)?(((\\d|[1-9]\\d|1[0-7]\\d|0{1,3})\\.\\d{6,10})|(\\d|[1-9]\\d|1[0-7]\\d|0{1,3})|180\\.0{6,10}|180)$';
      const reg2 = new RegExp(regu2);
      if (reg2.test(value)) {
        callback();
      } else {
        callback('请输入正确的经度。小数位在6-10');
      }
    } else {
      callback('项目经度不能为空');
    }
  }

  // 检查项目纬度
  checkProjectLatitude(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      const regu2 = '^(\\-|\\+)?([0-8]?\\d{1}\\.\\d{6,10}|90\\.0{6,10}|[0-8]?\\d{1}|90)$';
      const reg2 = new RegExp(regu2);
      if (reg2.test(value)) {
        callback();
      } else {
        callback('请输入正确的纬度。小数位在6-10');
      }
    } else {
      callback('项目纬度不能为空');
    }
  }

  // 检查项目时间
  checkProjectTime(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('项目时间不能为空');
    }
  }

  // 检查项目状态
  checkProjectState(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('项目状态不能为空');
    }
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const {
      projectStatus,
      projectType,
      projectBeginTime,
      projectEndTime,
      projectName,
      projectAddress,
      projectDescription,
      projectLatitude,
      projectLongitude,
      projectStatus1,
      projectType1,
      weatherAddress,
      progressPercent,
      showProgress,
    } = this.state;

    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit} encType="multipart/form-data">
        <FormItem hasFeedback label="项目名称:" {...formItemLayout}>
          {getFieldDecorator('projectName', {
            rules: [
              { required: true, message: '请输入项目名称' },
              { validator: this.checkProject },
            ],
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
            rules: [
              { required: true, message: '请选择项目类型' },
              { validator: this.checkProjectType },
            ],
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
            rules: [
              { required: true, message: '请输入项目地址' },
              { validator: this.checkProjectAddress },
            ],
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
            rules: [
              { required: true, message: '请输入天气地点' },
              { validator: this.checkWeatherAddress },
            ],
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
            rules: [
              { required: true, message: '请输入经度' },
              { validator: this.checkProjectLongitude },
            ],
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
            rules: [
              { required: true, message: '请输入纬度' },
              { validator: this.checkProjectLatitude },
            ],
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
            rules: [
              { required: true, message: '请选择项目开始、结束时间' },
              { validator: this.checkProjectTime },
            ],
          })(
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['项目开始时间', '项目结束时间']}
              onChange={this.parseTime}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="项目状态:" {...formItemLayout}>
          {getFieldDecorator('projectStatus', {
            rules: [
              { required: true, message: '请选择项目状态' },
              { validator: this.checkProjectState },
            ],
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
            rules: [],
          })(
            <TextArea
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="项目描述"
            />
          )}
        </FormItem>
        <FormItem label="项目图片:" {...formItemLayout}>
          <form id="subForm">
            <input type="file" name="点击这里上传文件" accept="image/*" />
            <input type="hidden" value={projectName} name="projectName" />
            <input type="hidden" value={projectType1} name="projectType" />
            <input type="hidden" value={projectAddress} name="projectAddress" />
            <input type="hidden" value={weatherAddress} name="weatherAddress" />
            <input type="hidden" value={projectLongitude} name="projectLongitude" />
            <input type="hidden" value={projectLatitude} name="projectLatitude" />
            <input type="hidden" value={projectBeginTime} name="projectBeginTime" />
            <input type="hidden" value={projectEndTime} name="projectEndTime" />
            <input type="hidden" value={projectStatus1} name="projectStatus" />
            <input type="hidden" value={projectDescription} name="projectDescription" />
          </form>
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
        <Modal
          closable={false}
          visible={showProgress}
          footer={null}
          onCancel={this.progressCancel}
          maskClosable={false}
          style={{ marginTop: '30vh' }}
        >
          <div style={{ textAlign: 'center' }}>
            <Progress type="circle" percent={progressPercent} />
            <br />
            <div>
              {progressPercent >= 100 ? '上传完成，等待后台中...请勿刷新' : '正在上传中...请勿刷新'}
            </div>
          </div>
        </Modal>
      </Form>
    );
  }
}
