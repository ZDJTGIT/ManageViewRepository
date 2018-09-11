import React, { Component } from 'react';
import { Table, message, Divider, Modal, Form } from 'antd';
import axios from 'axios';
import SensorEditForm from './SensorEditForm.js';
import '../../../../Config';

const { confirm } = Modal;

export default class SensorEditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      editingSensor: [],
      monitorPointOption: [],
    };
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

  modifyOk = e => {
    e.preventDefault();
    const { refresh } = this.props;
    const { editingSensor } = this.state;
    const dom = this.edit;
    dom.validateFields((err, values) => {
      const value = values;
      value.sensorId = editingSensor.sensorId;
      axios
        .post(`http://${global.constants.onlineWeb}/managerProject/modifySensor`, value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('修改项目成功');
          this.setState({ editingKey: '', editingSensor: '' });
          refresh();
          this.edit.resetFields();
        })
        .catch(() => {
          message.error('修改项目失败');
        });
    });
  };

  render() {
    const { editingKey, editingSensor, monitorPointOption } = this.state;
    const { sensorData, refresh } = this.props;
    const columns = [
      { title: '测点名称', dataIndex: 'monitorPoint', key: 'sensorId', fixed: 'left' },
      {
        title: '检测指标',
        dataIndex: 'monitorType',
        key: 'monitorType',
        render(record) {
          let re = '暂无指标';
          for (let i = 0; i < monitorPointOption.length; i += 1) {
            if (monitorPointOption[i].x === record.toString()) {
              re = <span>{monitorPointOption[i].y}</span>;
            }
          }
          return <span>{re}</span>;
        },
      },
      { title: '采集器编号', dataIndex: 'smuNumber', key: 'smuNumber' },
      { title: '采集器通道', dataIndex: 'smuChannel', key: 'smuChannel' },
      { title: '传感器ID', dataIndex: 'sensorNumber', key: 'sensorNumber' },
      { title: '传感器型号', dataIndex: 'sensorModel', key: 'sensorModel' },
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
                          }/managerProject/deleteSensorBySonsor?sensorId=${record.sensorId}`
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
          scroll={{ x: 750 }}
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
            monitorPointOption={monitorPointOption}
          />
        </Modal>
      </span>
    );
  }
}

const SensorEditFormImp = Form.create()(SensorEditForm);
