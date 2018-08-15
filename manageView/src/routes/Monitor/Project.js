import React, { Component } from 'react';
import { Row, Col, Card, message, Button, Modal, Form } from 'antd';
import axios from 'axios';
import EditableTable from './component/Project/EditProjectTable.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AddProjectForm from './component/Project/AddProjectTable.js';
import styles from './Project.less';
import '../Config';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showAddButton: 0,
      showAddProject: false,
      loading: false,
      page: {},
    };
    this.setState = this.setState.bind(this);
    this.addProject = this.addProject.bind(this);
    this.addProjectOk = this.addProjectOk.bind(this);
    this.addProjectCancel = this.addProjectCancel.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { page } = this.state;
    const pager = { ...page };
    pager.current = pagination.current;
    this.setState({
      page: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/queryAllProject`, {
        params: { results: 10, ...params },
      })
      .then(result => {
        const { page } = this.state;
        page.total = result.data.data.total;
        this.setState({
          loading: false,
          projects: result.data.data.data,
          page,
          showAddButton: 6,
        });
      })
      .catch(() => {
        message.error('获取初始数据失败');
      });
  };

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
    const { projects, showAddButton, showAddProject, loading, page } = this.state;
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
            <EditableTable
              loading={loading}
              page={page}
              data1={projects}
              refresh={this.componentWillMount}
              change={this.handleTableChange}
            />
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
