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

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
    const { refresh } = this.props;
    this.columns = [
      { title: '用户名称', dataIndex: 'userName', key: 'userId' },
      { title: '电话', dataIndex: 'phone', key: 'phone', editable: true },
      { title: '邮箱', dataIndex: 'email', key: 'email', editable: true },
      { title: '所属公司', dataIndex: 'company', key: 'company', editable: true },
      { title: '负责人', dataIndex: 'realName', key: 'realName', editable: true },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime', editable: true },
      { title: '状态', dataIndex: 'status', key: 'status', editable: true },
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
                      <a onClick={() => this.save(form, record.userId)} style={{ marginRight: 8 }}>
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="确认取消编辑？" onConfirm={() => this.cancel(record.userId)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.userId)}>编辑</a>
                // <a onClick={()=>{console.log(record)}}>Edit</a>
              )}
              <Divider type="vertical" />
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
                          `http://10.88.89.148:8080/managerUser/deleteUserByUserId?userId=${
                            record.userId
                          }`
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
            </div>
          );
        },
      },
    ];
  }

  isEditing = record => {
    const { editingKey } = this.state;
    return record.userId === editingKey;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  edit(userId) {
    this.setState({ editingKey: userId });
  }

  save(form, userId) {
    const { data1, refresh } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...data1];
      const index = newData.findIndex(item => userId === item.userId);
      if (index > -1) {
        const item = newData[index];
        const obj = row;
        obj.userId = item.userId;
        obj.password = item.password;
        obj.userName = item.userName;
        axios
          .post('http://10.88.89.148:8080/managerUser/modifyUser', obj, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
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
    const { data1 } = this.props;
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
        dataSource={data1}
        columns={columns}
        rowClassName="editable-row"
      />
    );
  }
}
