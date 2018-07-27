import React, { Component } from 'react';
import { Row, Col, Card, message, Button, Modal, Form } from 'antd';
import axios from 'axios';
import EditableTable from './component/User/EditUserTable.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AddUserForm from './component/User/AddUserTable.js';
import styles from './User.less';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      showAddButton: 0,
      showAddUser: false,
    };
    this.setState = this.setState.bind(this);
    this.addUser = this.addUser.bind(this);
    this.addUserOk = this.addUserOk.bind(this);
    this.addUserCancel = this.addUserCancel.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    axios
      .get('http://10.88.89.148:8080/managerUser/queryAllUser')
      .then(result => {
        this.setState({ users: result.data.data });
        this.setState({ showAddButton: 6 });
      })
      .catch(() => {
        message.error('获取初始数据失败');
      });
  }

  // 新增用户开始
  addUser() {
    this.setState({ showAddUser: true });
  }

  addUserOk() {
    this.setState({ showAddUser: false });
  }

  addUserCancel() {
    this.setState({ showAddUser: false });
  }
  // 新增用户结束

  render() {
    const { users, showAddButton, showAddUser } = this.state;
    // 新增用户
    return (
      <PageHeaderLayout title="用户模块">
        <Card className={styles.salesCard} bordered={false} bodyStyle={{ padding: 24 }}>
          {/* 预留表格上功能块 */}
          <Row>
            <Col span={showAddButton} style={{ marginTop: '1vh' }}>
              <Button type="primary" icon="plus" onClick={this.addUser}>
                新增用户
              </Button>
            </Col>
          </Row>
          {/* 表格 */}
          <Row style={{ marginTop: '2vh' }}>
            <EditableTable data1={users} refresh={this.componentWillMount} />
          </Row>
        </Card>
        <Modal
          title="新增用户"
          visible={showAddUser}
          onOk={this.addUserOk}
          footer={null}
          onCancel={this.addUserCancel}
        >
          <AddUserFormImp
            refresh={this.componentWillMount}
            close={this.addUserCancel}
            users={users}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

const AddUserFormImp = Form.create()(AddUserForm);
