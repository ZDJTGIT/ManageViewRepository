import React, { Component } from 'react';
import {
  Table,
  InputNumber,
  Input,
  Form,
  Popconfirm,
  message,
  Divider,
  Modal,
  Tabs,
  Icon,
} from 'antd';
import axios from 'axios';
import SensorEditableTable from './sensor/SensorEditTable.js';
import AddSensorTable from './sensor/AddSensotTable.js';

const { TabPane } = Tabs;
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

const AddSensorTableImp = Form.create()(AddSensorTable);

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      showSensor: false,
      currentProjectName: '',
      currentProjectId: '',
      sensorData: [],
      editing: false,
    };
    const { refresh } = this.props;
    this.showSensorModal = this.showSensorModal.bind(this);
    this.showSensorModalCancel = this.showSensorModalCancel.bind(this);
    this.showSensorModal1 = this.showSensorModal1.bind(this);
    this.columns = [
      { title: '项目id', dataIndex: 'projectId', key: 'projectId' },
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName', editable: true },
      { title: '项目类型', dataIndex: 'projectType', key: 'projectType', editable: true },
      { title: '项目地址', dataIndex: 'projectAddress', key: 'projectAddress', editable: true },
      { title: '天气地点', dataIndex: 'weatherAddress', key: 'weatherAddress', editable: true },
      { title: '经度', dataIndex: 'projectLongitude', key: 'projectLongitude', editable: true },
      { title: '纬度', dataIndex: 'projectLatitude', key: 'projectLatitude', editable: true },
      { title: '开始时间', dataIndex: 'projectBeginTime', key: 'projectBeginTime', editable: true },
      { title: '结束时间', dataIndex: 'projectEndTime', key: 'projectEndTime', editable: true },
      { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', editable: true },
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
                        onClick={() => this.save(form, record.projectId)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确认取消编辑？"
                    onConfirm={() => this.cancel(record.projectId)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.projectId)}>编辑</a>
                // <a onClick={()=>{console.log(record)}}>Edit</a>
              )}
              <Divider type="vertical" />
              <a
                onClick={() => {
                  confirm({
                    title: '确认删除该项目？',
                    content: record.userName,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                      axios
                        .delete(
                          `http://123.207.39.209:8090/managerProject/deleteProjectByProjectId?projectId=${
                            record.projectId
                          }`
                        )
                        .then(() => {
                          message.success('删除项目成功!');
                          refresh();
                        })
                        .catch(() => {
                          message.error('删除项目失败!');
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
    return record.projectId === editingKey;
  };

  cancel = () => {
    this.setState({ editingKey: '', editing: false });
  };

  edit(projectId) {
    this.setState({ editingKey: projectId, editing: true });
  }

  save(form, projectId) {
    const { data1, refresh } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...data1];
      const index = newData.findIndex(item => projectId === item.projectId);
      if (index > -1) {
        const item = newData[index];
        const obj = row;
        obj.projectDescription = item.projectDescription;
        obj.projectId = projectId;
        console.log(obj);
        axios
          .post('http://123.207.39.209:8090/managerProject/modifyProject', obj, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
          .then(() => {
            message.success('修改项目成功!');
            this.setState({ editingKey: '', editing: false });
            refresh();
          })
          .catch(() => message.error('修改项目失败，请重试一次!'));
      } else {
        message.error('获取修改项目失败，请联系开发人员!');
      }
    });
  }

  showSensorModal(record) {
    axios
      .get('http://123.207.39.209:8090/managerProject/getSensorData', {
        params: { projectId: record.projectId },
      })
      .then(result => {
        this.setState({
          showSensor: true,
          currentProjectName: record.projectName,
          currentProjectId: record.projectId,
          sensorData: result.data.data,
        });
      });
  }

  showSensorModal1() {
    const { currentProjectId } = this.state;
    axios
      .get('http://123.207.39.209:8090/managerProject/getSensorData', {
        params: { projectId: currentProjectId },
      })
      .then(result => {
        this.setState({ sensorData: result.data.data });
      });
  }

  showSensorModalCancel() {
    this.setState({ showSensor: false });
  }

  render() {
    const { showSensor, sensorData } = this.state;
    const { data1 } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      const { editing } = this.state;
      if (!col.editable) {
        return {
          ...col,
          onCell: record => ({
            onClick: () =>
              col.dataIndex !== 'operation' && editing === false
                ? this.showSensorModal(record)
                : '',
          }),
        };
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          onClick: () =>
            col.dataIndex !== 'operation' && editing === false ? this.showSensorModal(record) : '',
        }),
      };
    });
    const tabContent = [
      <span>
        <Icon type="user" />传感器信息
      </span>,
      <span>
        <Icon type="pie-chart" />添加传感器
      </span>,
    ];

    const { currentProjectId, currentProjectName } = this.state;
    return (
      <div>
        <Table
          components={components}
          bordered
          dataSource={data1}
          columns={columns}
          rowClassName="editable-row"
        />
        <Modal
          destroyOnClose
          visible={showSensor}
          // onOk={this.addProjectOk}
          footer={null}
          onCancel={this.showSensorModalCancel}
          width={888}
        >
          <Tabs>
            <TabPane tab={tabContent[0]} key="1">
              <h3>{currentProjectName}</h3>
              <hr />
              <SensorEditableTable
                projectId={currentProjectId}
                sensorData={sensorData}
                refresh={this.showSensorModal1}
              />
            </TabPane>
            <TabPane tab={tabContent[1]} key="2">
              <AddSensorTableImp projectId={currentProjectId} refresh={this.showSensorModal1} />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}
