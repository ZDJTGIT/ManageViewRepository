import React, { Component } from 'react';
import { Table, message, Divider, Modal, Badge, Form } from 'antd';
import axios from 'axios';
import EditUserForm from './EditUserForm.js';
import '../../../Config';

const { confirm } = Modal;
// 可编辑表格
export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '', editingUser: '' };
    const { refresh } = this.props;
    this.columns = [
      { title: '用户名称', dataIndex: 'userName', key: 'userId' },
      { title: '电话', dataIndex: 'phone', key: 'phone', editable: true },
      { title: '邮箱', dataIndex: 'email', key: 'email', editable: true },
      { title: '所属公司', dataIndex: 'company', key: 'company', editable: true },
      { title: '负责人', dataIndex: 'realName', key: 'realName', editable: true },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', editable: true },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        editable: true,
        render(record) {
          const frozen = (
            <span>
              <Badge status="default" />冻结
            </span>
          );
          const common = (
            <span>
              <Badge status="success" />正常
            </span>
          );
          if (record === '正常') {
            return common;
          } else {
            return frozen;
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
                    title: '确认删除该用户？',
                    content: record.userName,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                      axios
                        .delete(
                          `http://${
                            global.constants.onlineWeb
                          }/managerUser/deleteUserByUserId?userId=${record.userId}`
                        )
                        .then(() => {
                          message.success('删除用户成功!');
                          refresh();
                        })
                        .catch(() => {
                          message.error('删除用户失败!');
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
  }

  modify = record => {
    this.setState({ editingKey: record.userId, editingUser: record });
  };

  modifyOk = e => {
    const { editingUser } = this.state;
    const { props } = this;
    e.preventDefault();
    const dom = this.edit;
    dom.validateFields((err, values) => {
      const t = values.time;
      if (!err) {
        const value = values;
        value.createTime = t.format('YYYY-MM-DD HH:mm:ss');
        value.userId = editingUser.userId;
        axios
          .post(`http://${global.constants.onlineWeb}/managerUser/modifyUser`, value, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
          .then(() => {
            message.success('修改用户成功');
            this.setState({ editingKey: '', editingUser: '' });
            props.refresh();
          })
          .catch(() => {
            message.error('修改用户失败');
          });
      }
    });
  };

  render() {
    const { data1 } = this.props;
    const { editingKey, editingUser } = this.state;
    const { columns } = this;
    return (
      <div>
        <Table bordered dataSource={data1} columns={columns} scroll={{ x: 1200 }} />
        <Modal
          title={`正在编辑：${editingUser.userName}`}
          visible={editingKey !== ''}
          onCancel={() => {
            this.setState({ editingKey: '', editingUser: '' });
            this.edit.resetFields();
          }}
          onOk={this.modifyOk}
        >
          <EditUserFromImp
            ref={r => {
              this.edit = r;
            }}
            data={editingUser}
          />
        </Modal>
      </div>
    );
  }
}
const EditUserFromImp = Form.create()(EditUserForm);
