import React, { PureComponent } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import { Form, Input, DatePicker, Select, Button, Card, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getNowFormatDate,serverhttp } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class UpFirstData extends PureComponent {
  state = {
    monitorTTN: [],
    tableNames: null,
  };

  componentWillMount() {
    this.monitorTypeTableName();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { tableNames } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const value = {
        /* eslint no-underscore-dangle: 0 */
        tableName: tableNames,
        smuCmsId: values.smuCmsId,
        smuCmsChannel: values.smuCmsChannel,
        sensorId: values.sensorId,
        beginTime: getNowFormatDate(values.beTime[0]._d),
        endTime: getNowFormatDate(values.beTime[1]._d),
      };
      this.updataFistDataAxios(value);
    });
  };

  monitorTypeTableName = () => {
    axios
      .get(`${serverhttp}monitortype/tableName`)
      .then(res => {
        this.setState({
          monitorTTN: res.data.data,
        });
      })
      .catch(error => {
        message.info(error.response.status);
        // console.log(error.config);
      });
  };

  updataFistDataAxios = value => {
    axios
      .get(`${serverhttp}data/updateFirstData`, {
        params: value,
      })
      .then(res => {
        if (res.data.data) {
          message.info(`修改成功！`);
        } else {
          message.info(`修改失败,请重新尝试！`);
        }
      })
      .catch(error => {
        message.info(`修改失败！错误状态码${error.response.status}`);
      });
  };

  handleConfirmMonitorTableName = (rule, value, callback) => {
    const { monitorTTN } = this.state;
    monitorTTN.forEach(data => {
      if (data.monitorTypeNumber === value) {
        this.setState({
          tableNames: data.tableName,
        });
        if (data.tableName === null) {
          callback('该检测指标还未开放，请联系研发人员！');
        }
      }
    });
    callback();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { monitorTTN } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="修改传感器表第一次数据"
        content="只修改zdjc数据库传感器第一次数据，慎重操作！"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="检测指标">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请选择检测指标！',
                  },
                  {
                    validator: this.handleConfirmMonitorTableName,
                  },
                ],
              })(
                <Select placeholder="请选择检测指标" style={{ width: '100%' }}>
                  {monitorTTN.map(data => {
                    const { monitorTypeNumber, tableName, monitorName } = data;
                    return (
                      <Option key={tableName} value={monitorTypeNumber}>
                        {monitorName}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="终端编号">
              {getFieldDecorator('smuCmsId', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(<Input placeholder="请输入终端编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="终端通道">
              {getFieldDecorator('smuCmsChannel', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(<Input placeholder="请输入终端通道" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="传感器ID">
              {getFieldDecorator('sensorId', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(<Input placeholder="请输入传感器ID" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="起始时间">
              {getFieldDecorator('beTime', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                修改
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
