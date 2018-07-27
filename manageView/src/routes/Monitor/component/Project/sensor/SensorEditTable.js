import React, { Component } from 'react';
import { Table, InputNumber, Input, Form, Popconfirm, message, Divider, Modal } from 'antd';
import axios from 'axios';

const { confirm } = Modal;
// 可编辑表格
const EditableContext = React.createContext();
const FormItem = Form.Item;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const EditableCell = Form.create()(props => {
  const getInput = () => {
    const { inputType } = props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  const { editing, dataIndex, title, inputType, record, index, ...restProps } = props;
  return (
    <EditableContext.Consumer>
      {form => {
        const { getFieldDecorator } = form;
        return (
          <td {...restProps}>
            {editing ? (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(getInput())}
              </FormItem>
            ) : (
              restProps.children
            )}
          </td>
        );
      }}
    </EditableContext.Consumer>
  );
});

export default class SensorEditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
    };
    const { refresh } = this.props;
    this.columns = [
      { title: '测点名称', dataIndex: 'monitorPoint', key: 'sensorId', editable: true },
      { title: '检测指标', dataIndex: 'monitorType', key: 'monitorType', editable: true },
      { title: '采集器编号', dataIndex: 'smuNumber', key: 'smuNumber', editable: true },
      { title: '采集器通道', dataIndex: 'smuChannel', key: 'smuChannel', editable: true },
      { title: '传感器ID', dataIndex: 'sensorNumber', key: 'sensorNumber', editable: true },
      { title: '传感器型号', dataIndex: 'sensorModel', key: 'sensorModel', editable: true },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.save(form, record.sensorId)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确认取消编辑？" onConfirm={() => this.cancel(record.sensorId)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.sensorId)}>编辑</a>
                // <a onClick={()=>{console.log(record)}}>Edit</a>
              )}
              <Divider type="vertical" />
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
                          `http://123.207.39.209:8090/managerProject/deleteSensorBySonsor?sensorId=${
                            record.sensorId
                          }`
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
            </div>
          );
        },
      },
    ];
  }

  isEditing = record => {
    const { editingKey } = this.state;
    return record.sensorId === editingKey;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  edit(sensorId) {
    this.setState({ editingKey: sensorId });
  }

  save(form, sensorId) {
    const { sensorData, refresh } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...sensorData];
      const index = newData.findIndex(item => sensorId === item.sensorId);
      if (index > -1) {
        const item = newData[index];
        const obj = row;
        obj.sensorId = item.sensorId;
        obj.projectId = item.projectId;
        obj.sensorType = item.sensorType;
        obj.sensorLongitude = item.sensorLongitude;
        obj.sensorLatitude = item.sensorLatitude;
        obj.sensorPlace = item.sensorPlace;
        obj.sensorDepth = item.sensorDepth;
        const monitorTypeValue = obj.monitorType;
        obj.monitorType = '';
        console.log(row);
        axios
          .post(
            `http://123.207.39.209:8090/managerProject/modifySensor?monitorTypeValue=${monitorTypeValue}`,
            obj,
            {
              headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            }
          )
          .then(() => {
            message.success('修改用户成功!');
            this.setState({ editingKey: '' });
            refresh();
          })
          .catch(() => message.error('修改用户失败，请重试一次'));
      } else {
        message.error('获取修改用户失败，请联系开发人员!');
      }
    });
  }

  render() {
    const { sensorData } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
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
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={sensorData}
        columns={columns}
        rowClassName="editable-row"
      />
    );
  }
}
