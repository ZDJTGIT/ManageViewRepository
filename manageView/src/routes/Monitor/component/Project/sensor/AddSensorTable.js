import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Form, Input, Select } from 'antd';
import axios from 'axios';
import '../../../../Config';

const FormItem = Form.Item;
const { Option } = Select;
export default class AddSensorTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monitorPointOption: [],
      isGra: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.checkmonitorPoint = this.checkmonitorPoint.bind(this);
    this.checkmonitorType = this.checkmonitorType.bind(this);
    this.checkmonitorChannel = this.checkmonitorChannel.bind(this);
    this.checksmuNumber = this.checksmuNumber.bind(this);
    this.checksmuChannel = this.checksmuChannel.bind(this);
    this.checksensorNumber = this.checksensorNumber.bind(this);
    this.checksensorType = this.checksensorType.bind(this);
    this.checksensorModel = this.checksensorModel.bind(this);
    this.checksensorLongitude = this.checksensorLongitude.bind(this);
    this.checksensorLatitude = this.checksensorLatitude.bind(this);
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getAddSensorData`)
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
        if (value.monitorType === 'gra') {
          delete value.monitorType;
          value.sensorDepthStr = value.sensorDepth;
          delete value.sensorDepth;
          value.sensorNumberStr = value.sensorNumber;
          delete value.sensorNumber;
          setTimeout(() => {
            axios
              .post(`http://${global.constants.onlineWeb}/managerProject/insertGraSensor`, value, {
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                params: {
                  sensorDepthStr: value.sensorDepthStr,
                  sensorNumberStr: value.sensorNumberStr,
                },
              })
              .then(() => {
                message.success('新增传感器成功');
                setTimeout(() => {
                  // this.handleReset();
                  refresh();
                }, 400);
              })
              .catch(() => {
                message.error('新增传感器失败');
              });
          }, 288);
        } else {
          axios
            .post(`http://${global.constants.onlineWeb}/managerProject/insertSensor`, value, {
              headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            })
            .then(() => {
              message.success('新增传感器成功');
              setTimeout(() => {
                // this.handleReset();
                refresh();
              }, 400);
            })
            .catch(() => {
              message.error('新增传感器失败');
            });
        }
      }
    });
  };

  // 检查传感器深度
  checksensorDepth = (rule, value, callback) => {
    const { isGra } = this.state;
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (isGra) {
      if (value != null && value !== '' && !reg1.test(value)) {
        const regu2 = '^[0-9]+([.]{1}[0-9]+){0,1}(\\|([0-9]+([.]{1}[0-9]+){0,1}))*$';
        const reg2 = new RegExp(regu2);
        if (reg2.test(value)) {
          const { form } = this.props;
          if (
            form.getFieldValue('sensorNumber') != null &&
            typeof form.getFieldValue('sensorNumber') !== 'undefined'
          ) {
            const numberLength = form.getFieldValue('sensorNumber').split('|').length - 1;
            const length = value.split('|').length - 1;
            if (numberLength !== length) {
              callback('传感器编号应与传感器深度对应');
            } else {
              callback();
            }
          } else {
            callback('传感器编号应与传感器深度对应');
          }
        } else {
          callback('传感器深度只能为整数或者小数');
        }
      } else {
        callback('传感器深度不能为空');
      }
    } else {
      callback();
    }
  };

  // 检查测点名称
  checkmonitorPoint(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('测点名称不能为空');
    }
  }

  // 检查测点类型
  checkmonitorType(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('测点类型不能为空');
    }
  }

  // 检查测点通道
  checkmonitorChannel(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('测点通道不能为空');
    }
  }

  // 检查采集器编号
  checksmuNumber(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('采集器编号不能为空');
    }
  }

  // 检查采集器通道
  checksmuChannel(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('采集器通道不能为空');
    }
  }

  // 检查传感器编号
  checksensorNumber(rule, value, callback) {
    // const { isGra } = this.state;
    // const regu1 = '^[ ]+$';
    // const reg1 = new RegExp(regu1);
    // if (value != null && value !== '' && !reg1.test(value)) {
    //   // 非测斜检测
    //   if(!isGra){
    //     const regu2 = '^[0-9a-fA-F]{2}$';
    //     const reg2 = new RegExp(regu2);
    //     if (reg2.test(value)) {
    //       callback();
    //     } else {
    //       callback('传感器编号应为两位十六进制数');
    //     }
    //   }else{
    //     // 测斜检测
    //     const { form } = this.props;
    //     const regu2 = '^[0-9a-fA-F]{2}(\\|[0-9a-fA-F]{2})*$';
    //     const reg2 = new RegExp(regu2);
    //     if (reg2.test(value)) {
    //       if(form.getFieldValue('sensorDepth')!=null&& typeof(form.getFieldValue('sensorDepth'))!=='undefined'){
    //         const depthLength = form.getFieldValue('sensorDepth').split('|').length-1;
    //         const length = value.split('|').length-1;
    //         if(depthLength!==length){
    //           callback('传感器编号应与传感器深度对应');
    //         }else{
    //           callback();
    //         }
    //       }else{
    //         callback('传感器编号应与传感器深度对应');
    //       }
    //     } else {
    //       callback('测斜传感器编号应为两位十六进制数以|符号隔开');
    //     }
    //   }
    // } else {
    //   callback('传感器编号不能为空');
    // }
    callback();
  }

  // 检查传感器类型
  checksensorType(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('传感器类型不能为空');
    }
  }

  // 检查传感器型号
  checksensorModel(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('传感器型号不能为空');
    }
  }

  // 检查传感器经度
  checksensorLongitude(rule, value, callback) {
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
      callback('传感器经度不能为空');
    }
  }

  // 检查传感器纬度
  checksensorLatitude(rule, value, callback) {
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
      callback('传感器纬度不能为空');
    }
  }

  render() {
    const { form } = this.props;
    const { monitorPointOption, isGra } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem hasFeedback label="测点名称:" {...formItemLayout}>
          {getFieldDecorator('monitorPoint', {
            rules: [
              { required: true, message: '请输入测点名称' },
              { validator: this.checkmonitorPoint },
            ],
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
            rules: [
              { required: true, message: '请选择监测类型' },
              { validator: this.checkmonitorType },
            ],
          })(
            <Select
              onChange={value => {
                this.setState({ isGra: value === 'gra' });
              }}
            >
              <Option key="gra" value="gra">
                测斜
              </Option>
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
            rules: [
              { required: true, message: '请输入采集器编号' },
              { validator: this.checksmuNumber },
            ],
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
            rules: [
              { required: true, message: '请输入采集器通道' },
              { validator: this.checksmuChannel },
            ],
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
            rules: [
              { required: true, message: '请输入传感器编号' },
              { validator: this.checksensorNumber },
            ],
            validateTrigger: 'onSubmit',
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
            rules: [
              { required: true, message: '请输入传感器类型' },
              { validator: this.checksensorType },
            ],
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
            rules: [
              { required: true, message: '请输入传感器型号' },
              { validator: this.checksensorModel },
            ],
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
            rules: [
              { required: true, message: '请输入传感器经度' },
              { validator: this.checksensorLongitude },
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
          {getFieldDecorator('sensorLatitude', {
            rules: [
              { required: true, message: '请输入传感器纬度' },
              { validator: this.checksensorLatitude },
            ],
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
            rules: [],
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
            rules: [
              { required: isGra, message: '请输入传感器纬度' },
              { validator: this.checksensorDepth },
            ],
            validateTrigger: 'onSubmit',
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
