import React, { Component } from 'react';
import { Row, Col, Card, message, Button, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import EditableTable from './component/Project/EditProjectTable.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import AddProjectForm from './component/Project/AddProjectTable.js';
import styles from './Project.less';
import '../Config';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showAddButton: 0,
      showAddProject: false,
      loading: false,
      page: {},
      projectStatus: [],
      projectType: [],
      sorte: {},
      lockSearch: 0,
    };
    this.setState = this.setState.bind(this);
    this.addProject = this.addProject.bind(this);
    this.addProjectOk = this.addProjectOk.bind(this);
    this.addProjectCancel = this.addProjectCancel.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getCreateProjectData`)
      .then(result => {
        const getStatus = result.data.data.projectStatusData;
        const statetemp = [];
        for (const key in getStatus) {
          if (key != null) {
            statetemp.push({ x: key, y: getStatus[key] });
          }
        }
        const getType = result.data.data.projectTypeData;
        const typetemp = [];
        // const filterTypetemp = [];
        for (const key in getType) {
          if (key != null) {
            typetemp.push({ x: key, y: getType[key] });
          }
        }
        this.setState({
          projectStatus: statetemp,
          projectType: typetemp,
        });
      });
    const { page } = this.state;
    this.fetch({
      page: page.current,
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { page, lockSearch } = this.state;
    const { form } = this.props;
    const pager = { ...page };
    pager.current = pagination.current;
    this.setState({
      page: pager,
    });
    if (lockSearch === 0) {
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    } else {
      form.validateFields((error, values) => {
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
          projectId: values.searchProjectId,
          projectName: values.searchProjectName,
          projectAddress: values.searchProjectAddress,
          projectStatus: values.searchProjectStatus,
          projectType: values.searchProjectType,
        });
      });
    }
    this.setState({ sorte: sorter });
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

  // 搜索提交
  searchSubmit = () => {
    const { sorte, page } = this.state;
    const { form } = this.props;
    const pager = { ...page };
    pager.current = 1;
    this.setState({
      page: pager,
    });
    this.setState({ page: pager });
    form.validateFields((error, values) => {
      if (Object.keys(sorte).length !== 0) {
        this.fetch({
          page: pager.current,
          sortField: sorte.field,
          sortOrder: sorte.order,
          projectId: values.searchProjectId,
          projectName: values.searchProjectName,
          projectAddress: values.searchProjectAddress,
          projectStatus: values.searchProjectStatus,
          projectType: values.searchProjectType,
        });
      } else {
        this.fetch({
          page: pager.current,
          projectId: values.searchProjectId,
          projectName: values.searchProjectName,
          projectAddress: values.searchProjectAddress,
          projectStatus: values.searchProjectStatus,
          projectType: values.searchProjectType,
        });
      }
      this.setState({ lockSearch: 1 });
    });
  };

  // 重置搜索
  searchReset = () => {
    const { form } = this.props;
    this.setState({ lockSearch: 0 });
    form.resetFields();
    this.searchSubmit();
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
    const {
      projects,
      showAddButton,
      showAddProject,
      loading,
      page,
      projectStatus,
      projectType,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    // 新增用户
    return (
      <PageHeaderLayout title="项目模块">
        <Card className={styles.salesCard} bordered={false} bodyStyle={{ padding: 24 }}>
          <Form>
            <Row gutter={{ md: 2, lg: 12, xl: 24 }}>
              <Col md={8} sm={24}>
                <FormItem hasFeedback label="项目id" {...formItemLayout}>
                  {getFieldDecorator('searchProjectId', {
                    rules: [{ required: false }],
                  })(<Input placeholder="项目id" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem hasFeedback label="项目名称" {...formItemLayout}>
                  {getFieldDecorator('searchProjectName', {
                    rules: [{ required: false }],
                  })(<Input placeholder="项目名称" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem hasFeedback label="项目类型" {...formItemLayout}>
                  {getFieldDecorator('searchProjectType', {
                    rules: [{ required: false }],
                  })(
                    <Select placeholder="请选择项目类型" showSearch optionFilterProp="children">
                      {projectType.map(v => {
                        const value = parseInt(v.x, 10);
                        return (
                          <Option key={v.x} value={value}>
                            {v.y}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem hasFeedback label="项目地点" {...formItemLayout}>
                  {getFieldDecorator('searchProjectAddress', {
                    rules: [{ required: false }],
                  })(<Input placeholder="项目地点" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem
                  hasFeedback
                  label="项目状态"
                  {...formItemLayout}
                  optionFilterProp="children"
                >
                  {getFieldDecorator('searchProjectStatus', {
                    rules: [{ required: false }],
                  })(
                    <Select placeholder="请选择项目状态" showSearch>
                      {projectStatus.map(v => {
                        const value = parseInt(v.x, 10);
                        return (
                          <Option key={v.x} value={value}>
                            {v.y}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <span style={{ float: 'right' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.searchSubmit();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.searchReset();
                    }}
                  >
                    重置
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>

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
