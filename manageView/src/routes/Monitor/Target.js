import React, { Component } from 'react';
import { Card, Table, message, Row, Col, Button, Divider, Modal, Form } from 'antd';
import axios from 'axios';
import '../Config';
import ModifyForm from './component/Target/ModifyForm';
import AddFrom from './component/Target/AddForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { confirm } = Modal;

@Form.create()
export default class Target extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target: [], // 展示数据
      addLock: 0, // 新增按钮显示 0-不显示 大于0显示
      showEditMonitorType: false, // 显示编辑监测指标开关
      showAddMonitorType: false, // 显示添加监测指标开关
      editTarget: [], // 编辑的指标
      dataTableName: [], // 下拉表名数据
    };
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/monitortype/tableName`)
      .then(result => {
        this.setState({ target: result.data.data, addLock: 4 });
      })
      .catch(() => {
        message.error('获取检测指标表名失败');
      });
    axios
      .get(`http://${global.constants.onlineWeb}/monitortype/dataTableName`)
      .then(result => {
        this.setState({ dataTableName: result.data.data });
      })
      .catch(() => {
        message.error('获取所有data表名失败');
      });
  }

  addMonitorType = () => {
    this.setState({ showAddMonitorType: true });
  };

  addCancel = () => {
    this.setState({ showAddMonitorType: false });
    this.addForm.resetFields();
  };

  addOk = () => {
    const dom = this.addForm;
    dom.validateFields((err, values) => {
      axios
        .get(`http://${global.constants.onlineWeb}/monitortype/addMonitorType`, {
          params: {
            itemName: values.itemName,
            itemValue: values.itemValue,
            tableName: values.tableName,
          },
        })
        .then(result => {
          message.success(result.data.msg);
          this.setState({ showAddMonitorType: false });
          this.componentWillMount();
          dom.resetFields();
        })
        .catch(() => {
          message.error('添加监测指标失败');
        });
    });
  };

  modifyMonitorType = record => {
    this.setState({ showEditMonitorType: true, editTarget: record });
  };

  modifyOk = () => {
    const { editTarget } = this.state;
    this.setState({ showEditMonitorType: false });
    const dom = this.modifyForm;
    dom.validateFields((err, values) => {
      axios
        .get(`http://${global.constants.onlineWeb}/monitortype/modifyMonitorType`, {
          params: {
            monitorName: editTarget.monitorName,
            monitorTypeNumber: editTarget.monitorTypeNumber,
            tableName: values.tableName,
          },
        })
        .then(result => {
          message.success(result.data.msg);
          // message.success("修改监测指标成功");
          this.setState({ editTarget: [], showEditMonitorType: false });
          this.componentWillMount();
          this.modifyForm.resetFields();
        })
        .catch(() => {
          message.error('修改监测指标失败');
        });
    });
  };

  modifyCancel = () => {
    this.setState({ showEditMonitorType: false });
    this.modifyForm.resetFields();
  };

  deleteMonitorType = record => {
    confirm({
      title: '确认删除该项目？',
      content: record.userName,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        axios
          .delete(`http://${global.constants.onlineWeb}/monitortype/deleteMonitorType`, {
            params: {
              monitorTypeNumber: record.monitorTypeNumber,
            },
          })
          .then(result => {
            message.success(result.data.msg);
            this.componentWillMount();
          })
          .catch(() => {
            message.error('删除监测指标失败');
          });
      },
    });
  };

  render() {
    const {
      target,
      addLock,
      showEditMonitorType,
      editTarget,
      dataTableName,
      showAddMonitorType,
    } = this.state;
    const columns = [
      {
        title: '监测指标id',
        dataIndex: 'monitorTypeNumber',
        key: 'monitorTypeNumber',
      },
      {
        title: '监测指标',
        dataIndex: 'monitorName',
        key: 'monitorName',
      },
      {
        title: '相关表名',
        dataIndex: 'tableName',
        key: 'tableName',
        render: text => {
          if (text === null || text === '') {
            return <span>暂无数据库表！</span>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.deleteMonitorType(record);
              }}
            >
              删除
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.modifyMonitorType(record);
              }}
            >
              编辑
            </a>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="指标管理">
        <Card bordered={false} bodyStyle={{ padding: 24 }}>
          <Row>
            <Col span={addLock} style={{ marginTop: '1vh' }}>
              <Button
                type="primary"
                icon="plus"
                onClick={() => {
                  this.addMonitorType();
                }}
              >
                新增监测指标
              </Button>
            </Col>
          </Row>
          {/* 表格 */}
          <Row style={{ marginTop: '2vh' }}>
            <Table columns={columns} dataSource={target} bordered />
          </Row>
          <Modal
            visible={showEditMonitorType}
            onOk={() => {
              this.modifyOk();
            }}
            okText="修改"
            onCancel={() => {
              this.modifyCancel();
            }}
            title={`正在编辑：${editTarget.monitorName}`}
          >
            <ModifyForm
              editTarget={editTarget}
              dataTableName={dataTableName}
              ref={c => {
                this.modifyForm = c;
              }}
            />
          </Modal>
          <Modal
            visible={showAddMonitorType}
            okText="新增"
            title="新增监测指标"
            onCancel={() => {
              this.addCancel();
            }}
            onOk={() => {
              this.addOk();
            }}
          >
            <AddFrom
              ref={c => {
                this.addForm = c;
              }}
              dataTableName={dataTableName}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
