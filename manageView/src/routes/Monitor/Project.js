import React, { Component } from 'react';
import { Row, Col, Card, message, Button, Modal, Form } from 'antd';
import axios from 'axios';
import EditableTable from './component/Project/EditProjectTable.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AddProjectForm from './component/Project/AddProjectTable.js';
import styles from './Project.less';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showAddButton: 0,
      showAddProject: false,
    };
    this.setState = this.setState.bind(this);
    this.addProject = this.addProject.bind(this);
    this.addProjectOk = this.addProjectOk.bind(this);
    this.addProjectCancel = this.addProjectCancel.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    axios
      .get('http://10.88.89.148:8080/managerProject/queryAllProject')
      .then(result => {
        this.setState({ projects: result.data.data });
        this.setState({ showAddButton: 6 });
      })
      .catch(() => {
        message.error('获取初始数据失败');
      });
  }

  // 新增用户开始
  addProject() {
    this.setState({ showAddProject: true });
  }

  addProjectOk() {
    this.setState({ showAddProject: false });
  }

  addProjectCancel() {
    this.setState({ showAddProject: false });
  }
  // 新增用户结束

  render() {
    const { projects, showAddButton, showAddProject } = this.state;
    // 新增用户
    return (
      <PageHeaderLayout title="项目模块">
        <Card className={styles.salesCard} bordered={false} bodyStyle={{ padding: 24 }}>
          {/* 预留表格上功能块 */}
          <Row>
            <Col span={showAddButton} style={{ marginTop: '1vh' }}>
              <Button type="primary" icon="plus" onClick={this.addProject}>
                新增项目
              </Button>
            </Col>
          </Row>
          {/* 表格 */}
          <Row style={{ marginTop: '2vh' }}>
            <EditableTable data1={projects} refresh={this.componentWillMount} />
          </Row>
        </Card>
        <Modal
          title="新增项目"
          visible={showAddProject}
          onOk={this.addProjectOk}
          footer={null}
          onCancel={this.addProjectCancel}
        >
          <AddProjectFormImp
            refresh={this.componentWillMount}
            close={this.addProjectCancel}
            projects={projects}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

const AddProjectFormImp = Form.create()(AddProjectForm);
