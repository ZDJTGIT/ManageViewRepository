import React, { Component } from 'react';
import { Table, Form, message, Divider, Modal, Tabs, Icon, Badge } from 'antd';
import axios from 'axios';
import SensorEditableTable from './sensor/SensorEditTable.js';
import AddSensorTable from './sensor/AddSensorTable.js';
import EditableForm from './EditProjectForm.js';
import SensorEditTableFor1 from './sensor/SensorEditTableFor1-N.js';
import '../../../Config';

const { TabPane } = Tabs;
const { confirm } = Modal;

const AddSensorTableImp = Form.create()(AddSensorTable);

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSensor: false,
      currentProjectName: '',
      currentProjectId: '',
      sensorData: [],
      graSensorData: [],
      editingKey: '',
      editingProject: '',
      projectStatus: [],
      projectType: [],
      // filterStatus: [],
      // filterType: [],
    };

    this.showSensorModal = this.showSensorModal.bind(this);
    this.showSensorModalCancel = this.showSensorModalCancel.bind(this);
    this.showSensorModal1 = this.showSensorModal1.bind(this);
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getCreateProjectData`)
      .then(result => {
        const getStatus = result.data.data.projectStatusData;
        const statetemp = [];
        // const filterStatetemp = [];
        for (const key in getStatus) {
          if (key != null) {
            statetemp.push({ x: key, y: getStatus[key] });
            // filterStatetemp.push({ text: getStatus[key], value: key });
          }
        }
        const getType = result.data.data.projectTypeData;
        const typetemp = [];
        // const filterTypetemp = [];
        for (const key in getType) {
          if (key != null) {
            typetemp.push({ x: key, y: getType[key] });
            // filterTypetemp.push({ text: getType[key], value: key });
          }
        }
        this.setState({
          projectStatus: statetemp,
          projectType: typetemp,
          // filterStatus: filterStatetemp,
          // filterType: filterTypetemp,
        });
      })
      .catch(() => {
        message.error('获取下拉列表数据失败');
      });
  }

  modify = record => {
    this.setState({ editingKey: record.projectId, editingProject: record });
  };

  modifyOk = e => {
    e.preventDefault();
    const { editingProject } = this.state;
    const { props } = this;
    const dom = this.edit;
    dom.validateFields((err, values) => {
      const value = values;
      const t1 = values.projectBegin;
      const t2 = values.projectEnd;
      value.projectId = editingProject.projectId;
      value.projectBeginTime = t1.format('YYYY-MM-DD HH:mm:ss');
      value.projectEndTime = t2.format('YYYY-MM-DD HH:mm:ss');
      axios
        .post(`http://${global.constants.onlineWeb}/managerProject/modifyProject`, value, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('修改项目成功');
          this.setState({ editingKey: '', editingProject: '' });
          props.refresh();
        })
        .catch(() => {
          message.error('修改项目失败');
        });
    });
  };

  showSensorModal(record) {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getSensorData`, {
        params: { projectId: record.projectId },
      })
      .then(result => {
        this.setState({
          currentProjectName: record.projectName,
          currentProjectId: record.projectId,
          sensorData: result.data.data.sensorData1,
          graSensorData: result.data.data.sensorData2,
          showSensor: true,
        });
      })
      .catch(() => {
        message.error('获取传感器数据失败');
      });
  }

  // 修改传感器信息后重新拉取传感器信息
  showSensorModal1() {
    const { currentProjectId } = this.state;
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getSensorData`, {
        params: { projectId: currentProjectId },
      })
      .then(result => {
        this.setState({
          sensorData: result.data.data.sensorData1,
          graSensorData: result.data.data.sensorData2,
        });
      })
      .catch(() => {
        message.error('获取传感器数据失败');
      });
  }

  showSensorModalCancel() {
    this.setState({ showSensor: false });
  }

  render() {
    const { refresh } = this.props;
    const { projectStatus, projectType } = this.state;
    const columns = [
      { title: '项目id', dataIndex: 'projectId', key: 'projectId', fixed: 'left', sorter: true },
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        key: 'projectType',
        render(record) {
          let re = '暂无类型';
          for (let i = 0; i < projectType.length; i += 1) {
            if (projectType[i].x === record.toString()) {
              re = <span>{projectType[i].y}</span>;
            }
          }
          return <span>{re}</span>;
        },
        // filters: filterType,
      },
      { title: '项目地址', dataIndex: 'projectAddress', key: 'projectAddress' },
      { title: '天气地点', dataIndex: 'weatherAddress', key: 'weatherAddress' },
      { title: '经度', dataIndex: 'projectLongitude', key: 'projectLongitude' },
      { title: '纬度', dataIndex: 'projectLatitude', key: 'projectLatitude' },
      { title: '开始时间', dataIndex: 'projectBeginTime', key: 'projectBeginTime', sorter: true },
      { title: '结束时间', dataIndex: 'projectEndTime', key: 'projectEndTime' },
      {
        title: '项目状态',
        dataIndex: 'projectStatus',
        key: 'projectStatus',
        // filters: filterStatus,
        render(record) {
          const notStart = (
            <span>
              <Badge status="default" />未启动
            </span>
          );
          const started = (
            <span>
              <Badge status="success" />已启动
            </span>
          );
          const stopped = (
            <span>
              <Badge status="error" />已暂停
            </span>
          );
          const end = (
            <span>
              <Badge status="warning" />已结束
            </span>
          );
          if (record === 22) {
            return notStart;
          } else if (record === 23) {
            return started;
          } else if (record === 24) {
            return stopped;
          } else {
            return end;
          }
        },
      },
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
                    title: '确认删除该项目？',
                    content: record.userName,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                      axios
                        .delete(
                          `http://${
                            global.constants.onlineWeb
                          }/managerProject/deleteProjectByProjectId?projectId=${record.projectId}`
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
              <Divider type="vertical" />
              <a onClick={() => this.modify(record)}>编辑</a>
            </div>
          );
        },
      },
    ];
    const { showSensor, sensorData, graSensorData } = this.state;
    const { data1, page, loading, change } = this.props;

    const column = columns.map(col => {
      if (!col.editable) {
        return {
          ...col,
          onCell: record => ({
            onClick: () => (col.dataIndex !== 'operation' ? this.showSensorModal(record) : ''),
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
          editing: false,
          onClick: () => (col.dataIndex !== 'operation' ? this.showSensorModal(record) : ''),
        }),
      };
    });
    const tabContent = [
      <span>
        <Icon type="global" />基本传感器信息
      </span>,
      <span>
        <Icon type="plus-circle-o" />添加传感器
      </span>,
      <span>
        <Icon type="global" />测斜传感器信息
      </span>,
    ];

    const { currentProjectId, currentProjectName, editingKey, editingProject } = this.state;
    return (
      <div>
        <Table
          bordered
          dataSource={data1}
          pagination={page}
          columns={column}
          rowClassName="editable-row"
          scroll={{ x: 1600 }}
          loading={loading}
          onChange={change}
        />
        <Modal
          destroyOnClose
          visible={showSensor}
          // onOk={this.addProjectOk}
          footer={null}
          onCancel={this.showSensorModalCancel}
          width={1024}
        >
          <Tabs>
            <TabPane tab={tabContent[0]} key="1">
              <h3>{currentProjectName}</h3>
              <SensorEditableTable
                projectId={currentProjectId}
                sensorData={sensorData}
                refresh={this.showSensorModal1}
              />
            </TabPane>
            <TabPane tab={tabContent[2]} key="3">
              <h3>{currentProjectName}</h3>
              <SensorEditTableFor1 sensorData={graSensorData} refresh={this.showSensorModal1} />
            </TabPane>
            <TabPane tab={tabContent[1]} key="2">
              <AddSensorTableImp projectId={currentProjectId} refresh={this.showSensorModal1} />
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          width={700}
          title={`正在编辑：${editingProject.projectName}`}
          visible={editingKey !== ''}
          onCancel={() => {
            this.setState({ editingKey: '', editingProject: '' });
            this.edit.resetFields();
          }}
          onOk={this.modifyOk}
        >
          <EditProjectFormImp
            data={editingProject}
            ref={c => {
              this.edit = c;
            }}
            status={projectStatus}
            type={projectType}
          />
        </Modal>
      </div>
    );
  }
}
const EditProjectFormImp = Form.create()(EditableForm);
