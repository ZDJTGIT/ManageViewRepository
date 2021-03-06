import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Tabs,
  Table,
  message,
  Badge,
  Button,
  Icon,
  Select,
  Modal,
  Form,
  Divider,
} from 'antd';
import axios from 'axios';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddAlarmLinkMan from './component/AlarmLinkman/AddAlarmLinkman';
import ModifyAlarmLinkman from './component/AlarmLinkman/ModifyAlarmLinkman';
import styles from './ProUser.less';
import '../Config';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

@Form.create()
export default class ProUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameOption: [], // 选择用户栏数据
      projectOption: [], // 选择项目名栏数据
      selectedUserHasPros: [], // 选中的用户拥有的项目
      selectedProjectHasUsers: [], // 选中的项目下用户
      showAddButton: 0, // 是否显示用户处拓展栏
      showAddUserButton: 0, // 是否显示项目处添加用户拓展栏
      currentUser: '', // 当前选中用户
      currentProject: '', // 当前选中项目id
      showAddProModal: false, // 是否显示添加项目对话框
      showAddUserModal: false, // 是否显示添加用户对话框
      selectedProjects: [], // 添加项目选中的项目
      selectedUsers: [], // 添加用户选中的用户
      selectedUserHasNoPros: [], // 选中用户未拥有的项目
      selectedProjectHasNoUsers: [], // 选中的项目未拥有的用户
      selectedRowKeys1: [], // 选中的项目行的key
      selectedRowKeys2: [], // 选中的用户行的key
      userType: true, // 用户类型 true为普通用户（切换到告警），false为告警用户（切换到普通）
      selectedProjectHasAlarmLinkman: [], // 选中项目所含告警联系人
      selectedAlarmLinkman: [], // 选中的告警人
      showModifyAlarmLinkman: false, // 显示修改告警人对话框
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.projectHandleChange = this.projectHandleChange.bind(this);
    this.addProject = this.addProject.bind(this);
    this.addUser = this.addUser.bind(this);
    this.addOk = this.addOk.bind(this);
    this.addCancel = this.addCancel.bind(this);
    this.addUserOk = this.addUserOk.bind(this);
    this.addUserCancel = this.addUserCancel.bind(this);
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/manager/userAndPro`)
      .then(result => {
        const userList1 = result.data.data.userList;
        const projectList1 = result.data.data.projectList;
        const userTemp = [];
        const projectTemp = [];
        for (const key in userList1) {
          if (key != null) {
            userTemp.push({ x: userList1[key].userId, y: userList1[key].userName });
          }
        }
        for (const key in projectList1) {
          if (key != null) {
            projectTemp.push({ x: projectList1[key].projectId, y: projectList1[key].projectName });
          }
        }
        this.setState({
          userNameOption: userTemp,
          projectOption: projectTemp,
        });
      })
      .catch(() => {
        message.error('获取初始数据异常');
      });
  }

  modiAlarmCancel = () => {
    this.setState({ showModifyAlarmLinkman: false, selectedAlarmLinkman: [] });
    this.modifyAlarmForm.resetFields();
  };

  modiAlarmOk = () => {
    const { selectedAlarmLinkman, currentProject } = this.state;
    // let projectNameStr = "";
    // for(let i=0;i<projectOption.length;i+=1){
    //   if(projectOption[i].x===currentProject){
    //     projectNameStr = projectOption[i].y;
    //     break;
    //   }
    // }
    this.modifyAlarmForm.validateFields((error, values) => {
      axios
        .post(`http://${global.constants.onlineWeb}/manager/modifyAlarmLinkman`, {
          // projectId:currentProject,
          // projectName:projectNameStr,
          alarmLinkmanId: selectedAlarmLinkman.alarmLinkmanId,
          userName: values.userName,
          phone: values.phone,
          email: values.email,
          status: values.status,
        })
        .then(result => {
          message.success(result.data.msg);
          this.setState({ showModifyAlarmLinkman: false, selectedAlarmLinkman: [] });
          this.projectHandleChange(currentProject);
          this.modifyAlarmForm.resetFields();
        })
        .catch(() => {
          message.error('修改告警人失败！');
        });
    });
  };

  modAlarm = record => {
    this.setState({ showModifyAlarmLinkman: true, selectedAlarmLinkman: record });
  };

  delAlarm = record => {
    const { currentProject } = this.state;
    confirm({
      title: '确认删除该项目？',
      content: record.userName,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        axios
          .delete(`http://${global.constants.onlineWeb}/manager/deleteAlarmLinkman`, {
            params: {
              alarmLinkmanId: record.alarmLinkmanId,
            },
          })
          .then(result => {
            message.success(result.data.msg);
            this.projectHandleChange(currentProject);
          })
          .catch(() => {
            message.error('删除告警人失败');
          });
      },
    });
  };

  // 添加告警人
  AddAlarmLinkManOk = () => {
    const { currentProject, projectOption } = this.state;
    let projectNameStr = '';
    for (let i = 0; i < projectOption.length; i += 1) {
      if (projectOption[i].x === currentProject) {
        projectNameStr = projectOption[i].y;
        break;
      }
    }
    this.addAlarmForm.validateFields((error, values) => {
      setTimeout(() => {
        axios
          .post(`http://${global.constants.onlineWeb}/manager/addAlarmLinkman`, {
            projectId: currentProject,
            projectName: projectNameStr,
            userName: values.userName,
            phone: values.phone,
            email: values.email,
            status: values.status,
          })
          .then(result => {
            message.success(result.data.msg);
            this.setState({ showAddUserModal: false });
            this.projectHandleChange(currentProject);
            this.addAlarmForm.resetFields();
          })
          .catch(() => {
            message.error('新增告警联系人失败');
          });
      }, 200);
    });
  };

  // 下拉开始
  handleChange(value) {
    axios
      .get(`http://${global.constants.onlineWeb}/manager/queryProjectByUserId?userId=${value}`)
      .then(result => {
        const userHasPros = result.data.data;
        this.setState({
          selectedUserHasPros: userHasPros,
          showAddButton: 6,
          currentUser: value,
        });
      })
      .catch(() => {
        message.error('获取用户列表失败');
      });
    axios
      .get(`http://${global.constants.onlineWeb}/manager/queryNoProjectByUserId?userId=${value}`)
      .then(result => {
        // const userNoHasProjects = result.data.data;
        // const temp = [];
        // for (let i = 0; i < userNoHasProjects.length; i += 1) {
        //   temp.push({
        //     key: i,
        //     projectName: userNoHasProjects[i].projectName,
        //   });
        // }
        this.setState({ selectedUserHasNoPros: result.data.data });
      })
      .catch(() => {
        message.error('获取用户项目数据异常');
      });
  }

  projectHandleChange(value) {
    axios
      .get(`http://${global.constants.onlineWeb}/manager/queryUserByProjectId?projectId=${value}`)
      .then(result => {
        const projectHasUsers = result.data.data.users;
        this.setState({
          selectedProjectHasUsers: projectHasUsers,
          selectedProjectHasAlarmLinkman: result.data.data.alarmLinkman,
          showAddUserButton: 6,
          currentProject: value,
        });
      })
      .catch(() => {
        message.error('获取项目列表失败');
      });
    axios
      .get(`http://${global.constants.onlineWeb}/manager/queryNoUserByProjectId?projectId=${value}`)
      .then(result => {
        const projectNoHasUsers = result.data.data;
        const temp = [];
        for (let i = 0; i < projectNoHasUsers.length; i += 1) {
          temp.push({
            key: i,
            userName: projectNoHasUsers[i].userName,
            company: projectNoHasUsers[i].company,
            userId: projectNoHasUsers[i].userId,
          });
        }
        this.setState({ selectedProjectHasNoUsers: temp });
      })
      .catch(() => {
        message.error('获取项目用户数据异常');
      });
  }
  // 下拉结束
  // 添加项目开始

  addProject() {
    this.setState({ showAddProModal: true });
  }

  addUser() {
    this.setState({ showAddUserModal: true });
  }

  addOk() {
    const { selectedProjects, currentUser, currentProject } = this.state;
    if (selectedProjects.length < 1) {
      confirm({
        title: '信息确认',
        content: '当前未选择任何项目',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
      });
    } else {
      const temp = [];
      temp.push(currentUser);
      for (let i = 0; i < selectedProjects.length; i += 1) {
        temp.push(selectedProjects[i]);
      }
      const json = JSON.stringify(temp);
      axios
        .post(`http://${global.constants.onlineWeb}/manager/addProjectsToUsert`, json, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('添加项目成功');
          // 重置数据
          this.handleChange(currentUser);
          this.projectHandleChange(currentProject);
          this.componentWillMount();
        })
        .catch(() => {
          message.error('给用户添加项目失败');
        });
      this.setState({ showAddProModal: false, selectedRowKeys1: [], selectedProjects: [] });
    }
  }

  addUserOk() {
    const { selectedUsers, currentProject, currentUser } = this.state;
    if (selectedUsers.length < 1) {
      confirm({
        title: '信息确认',
        content: '当前未选择任何用户',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
      });
    } else {
      const temp = [];
      temp.push(currentProject);
      for (let i = 0; i < selectedUsers.length; i += 1) {
        temp.push(selectedUsers[i]);
      }
      const json = JSON.stringify(temp);
      axios
        .post(`http://${global.constants.onlineWeb}/manager/addUserToProject`, json, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('添加成功');
          this.projectHandleChange(currentProject);
          this.handleChange(currentUser);
          this.componentWillMount();
        })
        .catch(() => {
          message.error('为项目添加管理用户失败');
        });
      this.setState({ showAddUserModal: false, selectedRowKeys2: [], selectedUsers: [] });
    }
  }

  addCancel() {
    this.setState({ showAddProModal: false, selectedRowKeys1: [], selectedProjects: [] });
  }

  addUserCancel() {
    this.setState({ showAddUserModal: false });
  }

  // 添加项目结束
  render() {
    const {
      showAddProModal,
      showAddUserModal,
      showAddButton,
      showAddUserButton,
      selectedUserHasNoPros,
      selectedProjectHasNoUsers,
      userNameOption,
      selectedUserHasPros,
      selectedProjectHasUsers,
      projectOption,
      currentUser,
      currentProject,
      selectedRowKeys1,
      selectedRowKeys2,
      userType,
      selectedProjectHasAlarmLinkman,
      showModifyAlarmLinkman,
      selectedAlarmLinkman,
    } = this.state;
    const tabContent = [
      <span>
        <Icon type="user" />用户管理项目
      </span>,
      <span>
        <Icon type="solution" />项目管理人员
      </span>,
    ];
    // 表格内容
    const columns = [
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
      { title: '项目地址', dataIndex: 'projectAddress', key: 'projectAddress' },
      {
        title: '项目状态',
        key: 'projectStatus',
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
          if (record.projectStatus === 22) {
            return notStart;
          } else if (record.projectStatus === 23) {
            return started;
          } else if (record.projectStatus === 24) {
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
        render: (text, record) => (
          <span className="table-operation">
            <a
              onClick={() => {
                confirm({
                  title: '确认将该项目从用户下移除？',
                  content: record.projectName,
                  // 移除用户下项目
                  onOk: () => {
                    axios
                      .delete(
                        `http://${
                          global.constants.onlineWeb
                        }/manager/deleteProjectForUser?userId=${currentUser}&projectId=${
                          record.projectId
                        }`
                      )
                      .then(() => {
                        message.success('移除项目成功');
                        this.handleChange(currentUser);
                        this.projectHandleChange(currentProject);
                        this.componentWillMount();
                      });
                  },
                  okText: '确认',
                  okType: 'danger',
                  cancelText: '取消',
                });
              }}
            >
              移除
            </a>
          </span>
        ),
      },
    ];
    const projectColumns = [
      { title: '用户名', dataIndex: 'userName', key: 'userId' },
      { title: '公司', dataIndex: 'company', key: 'company' },
      {
        title: '用户状态',
        key: 'status',
        render(record) {
          const ok = (
            <span>
              <Badge status="success" />正常
            </span>
          );
          const ice = (
            <span>
              <Badge status="default" />冻结
            </span>
          );
          return record.status === '正常' ? ok : ice;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span className="table-operation">
            <a
              onClick={() => {
                confirm({
                  title: '确认移除该用户对项目的管理权限？',
                  content: record.userName,
                  // 移除项目下用户
                  onOk: () => {
                    axios
                      .delete(
                        `http://${
                          global.constants.onlineWeb
                        }/manager/deleteUserForProject?projectId=${currentProject}&userId=${
                          record.userId
                        }`
                      )
                      .then(() => {
                        message.success('移除用户成功');
                        this.projectHandleChange(currentProject);
                        this.handleChange(currentUser);
                        this.componentWillMount();
                      });
                  },
                  okText: '确认',
                  okType: 'danger',
                  cancelText: '取消',
                });
              }}
            >
              移除
            </a>
          </span>
        ),
      },
    ];
    // 添加项目

    const addColumns = [
      { title: '项目ID', dataIndex: 'projectId', key: 'projectID' },
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    ];

    const addUserColumns = [
      { title: '用户名', dataIndex: 'userName', key: 'userId' },
      { title: '公司', dataIndex: 'company', key: 'company' },
    ];

    const rowSelection = {
      selectedRowKeys: selectedRowKeys1,
      onChange: (selectedRowKeys, selectedRows) => {
        const temp = [];
        for (let i = 0; i < selectedRowKeys.length; i += 1) {
          temp.push(selectedRows[i].projectId);
        }
        this.setState({ selectedRowKeys1: selectedRowKeys, selectedProjects: temp });
      },
    };

    const rowSelectionForPro = {
      selectedRowKeys: selectedRowKeys2,
      onChange: (selectedRowKeys, selectedRows) => {
        const temp = [];
        for (let i = 0; i < selectedRowKeys.length; i += 1) {
          temp.push(selectedRows[i].userId);
        }
        this.setState({ selectedRowKeys2: selectedRowKeys, selectedUsers: temp });
      },
    };

    const alramColums = [
      { title: '告警人ID', dataIndex: 'alarmLinkmanId', key: 'alarmLinkmanId' },
      { title: '用户名', dataIndex: 'userName', key: 'alarmUserName' },
      { title: '电话', dataIndex: 'phone', key: 'alarmPhone' },
      { title: '邮箱', dataIndex: 'email', key: 'alarmEmail' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'alarmStatus',
        render: text => {
          if (text === 1) {
            return (
              <span>
                <Badge status="success" />启用
              </span>
            );
          } else {
            return (
              <span>
                <Badge status="error" />禁用
              </span>
            );
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'alarmOption',
        key: 'alarmOption',
        render: (text, record) => (
          <span>
            <a onClick={() => this.delAlarm(record)}>删除</a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.modAlarm(record);
              }}
            >
              编辑
            </a>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="项目用户关系模块">
        <Card className={styles.salesCard} bordered={false} bodyStyle={{ padding: 24 }}>
          <Tabs>
            <TabPane tab={tabContent[0]} key="1">
              <Select
                showSearch
                style={{ width: 240 }}
                placeholder="请选择一个用户"
                optionFilterProp="children"
                onChange={this.handleChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {userNameOption.map(v => {
                  return (
                    <Option key={v.x} value={v.x}>
                      {v.y}
                    </Option>
                  );
                })}
              </Select>
              <Row>
                <Col span={showAddButton} style={{ marginTop: '2vh' }}>
                  <div>
                    <Button type="primary" icon="plus" onClick={this.addProject}>
                      添加项目
                    </Button>
                  </div>
                </Col>
              </Row>
              <Table
                columns={columns}
                bordered
                dataSource={selectedUserHasPros}
                style={{ marginTop: '2vh' }}
                scroll={{ x: 700 }}
              />
            </TabPane>
            <TabPane tab={tabContent[1]} key="2">
              <Select
                showSearch
                style={{ width: 400 }}
                placeholder="请选择一个项目"
                optionFilterProp="children"
                onChange={this.projectHandleChange}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectOption.map(v => {
                  return (
                    <Option key={v.x} value={v.x}>
                      {v.y}
                    </Option>
                  );
                })}
              </Select>
              <Button
                type="danger"
                ghost
                icon="swap"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  this.setState({ userType: !userType });
                }}
              >
                切换为{userType ? '告警用户' : '普通用户'}
              </Button>
              <Row>
                <Col span={showAddUserButton} style={{ marginTop: '2vh' }}>
                  <div>
                    <Button type="primary" icon="plus" onClick={this.addUser}>
                      添加{userType ? '普通' : '告警'}用户
                    </Button>
                  </div>
                </Col>
              </Row>
              <Table
                columns={userType ? projectColumns : alramColums}
                bordered
                dataSource={userType ? selectedProjectHasUsers : selectedProjectHasAlarmLinkman}
                style={{ marginTop: '2vh' }}
                scroll={{ x: 800 }}
              />
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          title="添加已有项目到目前用户"
          visible={showAddProModal}
          onOk={this.addOk}
          onCancel={this.addCancel}
          width={800}
        >
          <Table
            rowSelection={rowSelection}
            columns={addColumns}
            dataSource={selectedUserHasNoPros}
            scroll={{ x: 500 }}
          />
        </Modal>
        <Modal
          title="为已有项目添加管理用户"
          visible={showAddUserModal && userType}
          onOk={this.addUserOk}
          onCancel={this.addUserCancel}
          width={800}
        >
          <Table
            rowSelection={rowSelectionForPro}
            columns={addUserColumns}
            dataSource={selectedProjectHasNoUsers}
            scroll={{ x: 340 }}
          />
        </Modal>
        <Modal
          visible={showAddUserModal && !userType}
          onCancel={this.addUserCancel}
          title="新增告警联系人"
          onOk={this.AddAlarmLinkManOk}
        >
          <AddAlarmLinkMan
            ref={c => {
              this.addAlarmForm = c;
            }}
          />
        </Modal>
        <Modal
          visible={showModifyAlarmLinkman}
          onCancel={this.modiAlarmCancel}
          title={`正在编辑${selectedAlarmLinkman.userName}`}
          onOk={this.modiAlarmOk}
        >
          <ModifyAlarmLinkman
            data={selectedAlarmLinkman}
            ref={c => {
              this.modifyAlarmForm = c;
            }}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
