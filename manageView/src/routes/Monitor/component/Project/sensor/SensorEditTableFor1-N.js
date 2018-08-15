import React, { Component } from 'react';
import { Table, message, Divider, Modal, Form } from 'antd';
import axios from 'axios';
import SensorEditForm1 from './SensorEditForm1-N.js';
import '../../../../Config';

const { confirm } = Modal;

export default class SensorEditableTableFor1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      editingSensor: [],
    };
  }

  modifyOk = e => {
    e.preventDefault();
    const { refresh } = this.props;
    const { editingSensor } = this.state;
    const dom = this.edit;
    dom.validateFields((err, values) => {
      const value = values;
      value.sensorId = editingSensor.sensorId;
      axios
        .post(`http://${global.constants.onlineWeb}/managerProject/modifyGraSensor`, value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('修改项目成功');
          this.setState({ editingKey: '', editingSensor: '' });
          refresh();
        })
        .catch(() => {
          message.error('修改项目失败');
        });
    });
  };

  render() {
    const { editingKey, editingSensor } = this.state;
    const { sensorData, refresh } = this.props;
    const columns = [
      { title: '测点名称', dataIndex: 'monitorPoint', key: 'sensorId', fixed: 'center' },
      { title: '采集器编号', dataIndex: 'smuNumber', key: 'smuNumber' },
      { title: '采集器通道', dataIndex: 'smuChannel', key: 'smuChannel' },
      { title: '传感器ID', dataIndex: 'sensorNumber', key: 'sensorNumber' },
      { title: '传感器型号', dataIndex: 'sensorModel', key: 'sensorModel' },
      { title: '传感器地点', dataIndex: 'sensorPlace', key: 'sensorPlace' },
      { title: '传感器深度', dataIndex: 'sensorDepth', key: 'sensorDepth' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  confirm({
                    title: '确认删除该传感器？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                      axios
                        .delete(
                          `http://${
                            global.constants.onlineWeb
                          }/managerProject/deleteGraSensorBySonsor?sensorId=${record.sensorId}`
                        )
                        .then(() => {
                          message.success('删除传感器成功!');
                          refresh();
                        })
                        .catch(() => {
                          message.error('删除传感器失败!');
                        });
                    },
                  });
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.setState({ editingKey: record.sensorId, editingSensor: record });
                }}
              >
                编辑
              </a>
            </div>
          );
        },
      },
    ];
    const column = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });

    return (
      <span>
        <Table
          bordered
          dataSource={sensorData}
          columns={column}
          rowClassName="editable-row"
          scroll={{ x: 900 }}
        />
        <Modal
          width={700}
          title={`正在编辑：${editingSensor.monitorPoint}`}
          visible={editingKey !== ''}
          onCancel={() => {
            this.setState({ editingKey: '', editingSensor: [] });
            this.edit.resetFields();
          }}
          onOk={this.modifyOk}
        >
          <SensorEditFormImp
            data={editingSensor}
            ref={c => {
              this.edit = c;
            }}
          />
        </Modal>
      </span>
    );
  }
}

const SensorEditFormImp = Form.create()(SensorEditForm1);
