import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Table, message, Badge, Button, Icon, Select, Modal } from 'antd';
import { Pie } from 'components/Charts';
import axios from 'axios';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ProUser.less';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

export default class ProUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proHasUsers: [], // 饼状图统计项目客户数
      userHasPros: [], // 饼状图统计用户下项目数
      userNameOption: [], // 选择栏数据
      selectedUserHasPros: [], // 选中的用户拥有的项目
      showAddButton: 0, // 是否显示拓展栏
      currentUser: '', // 当前选中用户
      showAddProModal: false, // 是否显示添加项目对话框
      selectedProjects: [], // 添加项目选中的项目
      selectedUserHasNoPros: [], // 选中用户未拥有的项目
      selectedRowKeys1: [], // 选中的行的key
    };
    this.setState = this.setState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addProject = this.addProject.bind(this);
    this.addOk = this.addOk.bind(this);
    this.addCancel = this.addCancel.bind(this);
  }

  componentWillMount() {
    axios
      .get('http://10.88.89.148/manager/userAndPro')
      .then(result => {
        const { projectHasUser } = result.data.data;
        const { userHasProject } = result.data.data;
        const { userNameList } = result.data.data;
        const projectHasUserTemp = [];
        const userHasProsTemp = [];
        const userNameListTemp = [];
        for (const key in projectHasUser) {
          if (key != null) projectHasUserTemp.push({ x: key, y: projectHasUser[key] });
        }
        for (const key in userHasProject) {
          if (key != null) {
            userHasProsTemp.push({ x: key, y: userHasProject[key] });
          }
        }
        for (let i = 0; i < userNameList.length; i += 1) {
          userNameListTemp.push(
            <Option key={i.toString(userNameList.length)} value={userNameList[i]}>
              {userNameList[i]}
            </Option>
          );
        }
        this.setState({
          proHasUsers: projectHasUserTemp,
          userHasPros: userHasProsTemp,
          userNameOption: userNameListTemp,
        });
      })
      .catch(() => {
        message.error('获取初始数据异常');
      });
  }

  // 下拉开始
  handleChange(value) {
    const json = JSON.stringify({ userName: value });
    axios
      .post('http://10.88.89.148/manager/queryProjectByUserName', json, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      })
      .then(result => {
        const userHasPros = result.data.data;
        const userHasProsTemp = [];
        for (let i = 0; i < userHasPros.length; i += 1) {
          userHasProsTemp.push({
            key: i,
            projectName: userHasPros[i].projectName,
            projectAddress: userHasPros[i].projectAddress,
          });
        }
        this.setState({
          selectedUserHasPros: userHasProsTemp,
          showAddButton: 6,
          currentUser: value,
        });
      })
      .catch(() => {
        message.error('获取用户列表失败');
      });
    axios
      .post('http://10.88.89.148/manager/queryNoProjectByUserName', json, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      })
      .then(result => {
        const userNoHasPros = result.data.data;
        const temp = [];
        for (let i = 0; i < userNoHasPros.length; i += 1) {
          temp.push({
            key: i,
            projectName: userNoHasPros[i].projectName,
            projectAddress: userNoHasPros[i].projectAddress,
          });
        }
        this.setState({ selectedUserHasNoPros: temp });
      })
      .catch(() => {
        message.error('获取用户数据异常');
      });
  }
  // 下拉结束
  // 添加项目开始

  addProject() {
    this.setState({ showAddProModal: true });
  }

  addOk() {
    const { selectedProjects, currentUser } = this.state;
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
        .post('http://10.88.89.148/manager/addProjectsToUsert', json, {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        })
        .then(() => {
          message.success('添加项目成功');
          // 重置数据
          this.handleChange(currentUser);
          this.componentWillMount();
        })
        .catch(() => {
          message.error('给用户添加项目失败');
        });
      this.setState({ showAddProModal: false, selectedRowKeys1: [], selectedProjects: [] });
    }
  }

  addCancel() {
    this.setState({ showAddProModal: false, selectedRowKeys1: [], selectedProjects: [] });
  }

  // 添加项目结束
  render() {
    const {
      showAddProModal,
      showAddButton,
      selectedUserHasNoPros,
      proHasUsers,
      userHasPros,
      userNameOption,
      selectedUserHasPros,
      currentUser,
      selectedRowKeys1,
    } = this.state;
    const tabContent = [
      <span>
        <Icon type="user" />用户项目管理
      </span>,
      <span>
        <Icon type="pie-chart" />统计饼状图
      </span>,
    ];
    // 表格内容
    const columns = [
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
      { title: '项目地址', dataIndex: 'projectAddress', key: 'projectAddress' },
      {
        title: '项目状态',
        key: 'projectStatus',
        render: () => (
          <span>
            <Badge status="success" />已启动
          </span>
        ),
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
                        `http://10.88.89.148/manager/deleteProjectForUser?userName=${currentUser}&projectName=${
                          record.projectName
                        }`
                      )
                      .then(() => {
                        message.success('移除项目成功');
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

    const addColumns = [{ title: '项目名称', dataIndex: 'projectName', key: 'projectName' }];
    const rowSelection = {
      selectedRowKeys1,
      onChange: (selectedRowKeys, selectedRows) => {
        const temp = [];
        for (let i = 0; i < selectedRowKeys.length; i += 1) {
          temp.push(selectedRows[i].projectName);
        }
        this.setState({ selectedProjects: temp, selectedRowKeys1 });
      },
    };

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
                {userNameOption}
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
              />
            </TabPane>
            <TabPane tab={tabContent[1]} key="2">
              <Row>
                <Pie
                  hasLegend
                  subTitle="项目拥有用户数"
                  data={proHasUsers}
                  height={294}
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: proHasUsers.reduce((pre, now) => now.y + pre, 0),
                      }}
                    />
                  )}
                />

                <br />
                <hr />
                <br />

                <Pie
                  hasLegend
                  subTitle="用户下项目数"
                  data={userHasPros}
                  height={294}
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: userHasPros.reduce((pre, now) => now.y + pre, 0),
                      }}
                    />
                  )}
                />
              </Row>
            </TabPane>
          </Tabs>
        </Card>
        <Modal
          title="添加项目"
          visible={showAddProModal}
          onOk={this.addOk}
          onCancel={this.addCancel}
        >
          <Table
            rowSelection={rowSelection}
            columns={addColumns}
            dataSource={selectedUserHasNoPros}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
