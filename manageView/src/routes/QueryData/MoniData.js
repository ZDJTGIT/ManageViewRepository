import React, { PureComponent } from 'react';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  // message,
  DatePicker,
} from 'antd';
import MyTable from 'components/MoniTable';
import { Link } from 'dva/router';
import Exception from 'components/Exception';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getNowFormatDate,serverhttp } from '../../utils/utils';

import styles from './MoniData.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
export default class MoniData extends PureComponent {
  state = {
    data: [],
    monitorTTN: [],
    queryDataCondition: {},
    loadings: false,
    expandForm: false,
    responseStatus: 200,
    pagination: {
      showSizeChanger: true,
      defaultCurrent: 1,
      defaultPageSize: 5,
      pageSize: 5,
      current: 1,
      total: 0,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
    },
  };

  componentWillMount() {
    // const { pagination } = this.state;
    this.monitorTypeTableName();
    // this.tableAxios(1,pagination.defaultPageSize);
  }

  monitorTypeTableName = () => {
    axios
      .get(`${serverhttp}monitortype/tableName`)
      .then(res => {
        this.setState({
          monitorTTN: res.data.data,
        });
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            responseStatus: error.response.status,
          });
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else {
          this.setState({
            responseStatus: 500,
          });
        }
        // console.log(error.config);
      });
  };

  tableAxios = (fieldsValue, offsets, limits) => {
    const { queryDataCondition } = this.state;

    let conditioins = {};
    if (fieldsValue.beTime === undefined) {
      conditioins = {
        beginTime: null,
        endTime: null,
        tableName: queryDataCondition.tableName,
        smuCmsId: fieldsValue.smuCmsId,
        smuCmsChannel: fieldsValue.smuCmsChannel,
        sensorId: fieldsValue.sensorId,
        offset: offsets,
        limit: limits,
      };
    } else {
      conditioins = {
        /* eslint no-underscore-dangle: 0 */
        beginTime: getNowFormatDate(fieldsValue.beTime[0]._d),
        endTime: getNowFormatDate(fieldsValue.beTime[1]._d),
        tableName: queryDataCondition.tableName,
        smuCmsId: fieldsValue.smuCmsId,
        smuCmsChannel: fieldsValue.smuCmsChannel,
        sensorId: fieldsValue.sensorId,
        offset: offsets,
        limit: limits,
      };
    }
    this.setState({
      queryDataCondition: conditioins,
      loadings: true,
    });
    axios
      .get(`${serverhttp}data/queryData`, {
        params: conditioins,
      })
      .then(res => {
        this.setState({
          data: res.data.data.rows,
          pagination: {
            total: res.data.data.total,
            pageSize: limits,
            current: offsets,
          },
          loadings: false,
        });
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            responseStatus: error.response.status,
          });
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else {
          this.setState({
            responseStatus: 500,
          });
        }
        // console.log(error.config);
      });
  };

  tableAxiosChange = (fieldsValue, offsets, limits) => {
    this.setState({
      loadings: true,
    });
    axios
      .get(`${serverhttp}data/queryData`, {
        params: {
          beginTime: fieldsValue.beginTime,
          endTime: fieldsValue.endTime,
          limit: limits,
          offset: offsets,
          sensorId: fieldsValue.sensorId,
          smuCmsChannel: fieldsValue.smuCmsChannel,
          smuCmsId: fieldsValue.smuCmsId,
          tableName: fieldsValue.tableName,
        },
      })
      .then(res => {
        this.setState({
          data: res.data.data.rows,
          pagination: {
            total: res.data.data.total,
            pageSize: limits,
            current: offsets,
          },
          loadings: false,
        });
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            responseStatus: error.response.status,
          });
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
        } else {
          this.setState({
            responseStatus: 500,
          });
        }
        // console.log(error.config);
      });
  };

  myonChangeTable = pagination => {
    const { queryDataCondition } = this.state;
    this.tableAxiosChange(queryDataCondition, pagination.current, pagination.pageSize);
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.tableAxios(fieldsValue, pagination.current, pagination.pageSize);
      // message.info('如果加载过慢，建议选择起始时间！');
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      data: [],
      pagination: {
        showSizeChanger: true,
        defaultCurrent: 1,
        defaultPageSize: 5,
        pageSize: 5,
        current: 1,
        total: 0,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
      },
    });
  };

  handleConfirmMonitorTableName = (rule, value, callback) => {
    const { monitorTTN } = this.state;
    monitorTTN.forEach(data => {
      if (data.monitorTypeNumber === value) {
        this.setState({
          queryDataCondition: {
            tableName: data.tableName,
          },
        });
        if (data.tableName === null) {
          callback('该检测指标还未开放，请联系研发人员！');
        }
      }
    });
    callback();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { monitorTTN } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="检测指标">
              {getFieldDecorator('monitorType', {
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
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="终端编号">
              {getFieldDecorator('smuCmsId', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(<Input placeholder="请输入终端编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItemLayout} label="起始时间">
              {getFieldDecorator('beTime')(
                <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { monitorTTN } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="检测指标">
              {getFieldDecorator('monitorType', {
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
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="终端编号">
              {getFieldDecorator('smuCmsId', {
                rules: [{ required: true, message: '请输入终端编号！' }],
              })(<Input placeholder="请输入终端编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="终端通道">
              {getFieldDecorator('smuCmsChannel')(<Input placeholder="请输入终端通道" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="传感器ID">
              {getFieldDecorator('sensorId')(<Input placeholder="请输入传感器ID" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem {...formItemLayout} label="起始时间">
              {getFieldDecorator('beTime')(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderError() {
    const { responseStatus } = this.state;
    return (
      <Exception
        type={responseStatus}
        style={{ minHeight: 500, height: '80%' }}
        linkElement={Link}
      />
    );
  }

  renderMainComponent() {
    const columns = [
      {
        title: '传感器编号',
        dataIndex: 'sensorId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '终端编号',
        dataIndex: 'smuCmsId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: '终端通道',
        dataIndex: 'smuCmsChannel',
        align: 'center',
        // fixed: 'left',
        width: 150,
      },
      {
        title: '当前传入数据时间',
        dataIndex: 'currentTimes',
        align: 'center',
        width: 200,
      },
      {
        title: '当前传入数据',
        dataIndex: 'currentData',
        align: 'center',
        width: 130,
      },
      {
        title: '第一次测试时间',
        dataIndex: 'firstTime',
        align: 'center',
        width: 190,
      },
      {
        title: '第一次测试数据',
        dataIndex: 'firstData',
        align: 'center',
        width: 130,
      },
      {
        title: '当前传入温度',
        dataIndex: 'currentTemperature',
        align: 'center',
        width: 130,
      },
      {
        title: '单次变化量',
        dataIndex: 'currentLaserChange',
        align: 'center',
        width: 130,
      },
      {
        title: '总变化量',
        dataIndex: 'totalLaserChange',
        align: 'center',
        width: 130,
      },
      {
        title: '变化速率',
        dataIndex: 'speedChange',
        align: 'center',
        width: 130,
      },
      {
        title: '自动/手动',
        dataIndex: 'createType',
        align: 'center',
        width: 100,
        // fixed: 'right',
      },
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
        // width: 100,
      },
    ];
    const { data, pagination, loadings } = this.state;
    return (
      <PageHeaderLayout title="数据查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <MyTable
              loading={loadings}
              columns={columns}
              dataSource={data}
              pagination={pagination}
              onChange={this.myonChangeTable}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }

  renderStatus = () => {
    const { responseStatus } = this.state;
    if (responseStatus === 500) {
      return this.renderError();
    } else if (responseStatus === 404) {
      return this.renderError();
    } else {
      return this.renderMainComponent();
    }
  };

  render() {
    return <div>{this.renderStatus()}</div>;
  }
}
