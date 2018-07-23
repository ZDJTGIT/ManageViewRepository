import React, { Component } from 'react';
import { Row, Col, Card, Divider, message, Table, Button, Modal, Form } from 'antd';
import axios from 'axios';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddUserForm from './component/AddUserTable.js';
import styles from './User.less';

const { confirm } = Modal;
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
      .get('http://10.88.89.148/managerUser/queryAllUser')
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
    const data = [];
    const { users, showAddButton, showAddUser } = this.state;
    for (let i = 0; i < 100; i += 1) {
      data.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    // 表格
    const userColumns = [
      { title: '用户名称', dataIndex: 'userName', key: 'userId' },
      { title: '电话', dataIndex: 'phone', key: 'phone' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '所属公司', dataIndex: 'company', key: 'company' },
      { title: '负责人', dataIndex: 'realName', key: 'realName' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <div>
            <a>修改</a>
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
                    // alert(record.userId);
                    axios
                      .delete(
                        `http://10.88.89.148/managerUser/deleteUserByUserId?userId=${record.userId}`
                      )
                      .then(() => {
                        message.success('删除用户成功!');
                        this.componentWillMount();
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
        ),
      },
    ];
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
            <Table columns={userColumns} dataSource={users} bordered />
            {/* <EditableTable data={data}/> */}
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

// 可编辑表格
// const EditableContext = React.createContext();

// const EditableRow = ({ form, index, ...props }) => (
//   <EditableContext.Provider value={form}>
//     <tr {...props} />
//   </EditableContext.Provider>
// );

// const EditableFormRow = Form.create()(EditableRow);

// class EditableCell extends React.Component {
//   getInput = () => {
//     if (this.props.inputType === 'number') {
//       return <InputNumber />;
//     }
//     return <Input />;
//   };

//   render() {
//     const {
//       editing,
//       dataIndex,
//       title,
//       inputType,
//       record,
//       index,
//       ...restProps
//     } = this.props;
//     return (
//       <EditableContext.Consumer>
//         {(form) => {
//           const { getFieldDecorator } = form;
//           return (
//             <td {...restProps}>
//               {editing ? (
//                 <FormItem style={{ margin: 0 }}>
//                   {getFieldDecorator(dataIndex, {
//                     rules: [{
//                       required: true,
//                       message: `Please Input ${title}!`,
//                     }],
//                     initialValue: record[dataIndex],
//                   })(this.getInput())}
//                 </FormItem>
//               ) : restProps.children}
//             </td>
//           );
//         }}
//       </EditableContext.Consumer>
//     );
//   }
// }

// class EditableTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { data, editingKey: '' };
//     this.columns = [
//       {
//         title: 'name',
//         dataIndex: 'name',
//         width: '25%',
//         editable: true,
//       },
//       {
//         title: 'age',
//         dataIndex: 'age',
//         width: '15%',
//         editable: true,
//       },
//       {
//         title: 'address',
//         dataIndex: 'address',
//         width: '40%',
//         editable: true,
//       },
//       {
//         title: 'operation',
//         dataIndex: 'operation',
//         render: (text, record) => {
//           const editable = this.isEditing(record);
//           return (
//             <div>
//               {editable ? (
//                 <span>
//                   <EditableContext.Consumer>
//                     {form => (
//                       <a
//                         href="javascript:;"
//                         onClick={() => this.save(form, record.key)}
//                         style={{ marginRight: 8 }}
//                       >
//                         Save
//                       </a>
//                     )}
//                   </EditableContext.Consumer>
//                   <Popconfirm
//                     title="Sure to cancel?"
//                     onConfirm={() => this.cancel(record.key)}
//                   >
//                     <a>Cancel</a>
//                   </Popconfirm>
//                 </span>
//               ) : (
//                 <a onClick={() => this.edit(record.key)}>Edit</a>
//               )}
//             </div>
//           );
//         },
//       },
//     ];
//   }

//   isEditing = (record) => {
//     return record.key === this.state.editingKey;
//   };

//   edit(key) {
//     this.setState({ editingKey: key });
//   }

//   save(form, key) {
//     form.validateFields((error, row) => {
//       if (error) {
//         return;
//       }
//       const newData = [...this.state.data];
//       const index = newData.findIndex(item => key === item.key);
//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         });
//         this.setState({ data: newData, editingKey: '' });
//       } else {
//         newData.push(row);
//         this.setState({ data: newData, editingKey: '' });
//       }
//     });
//   }

//   cancel = () => {
//     this.setState({ editingKey: '' });
//   };

//   render() {
//     const components = {
//       body: {
//         row: EditableFormRow,
//         cell: EditableCell,
//       },
//     };

//     const columns = this.columns.map((col) => {
//       if (!col.editable) {
//         return col;
//       }
//       return {
//         ...col,
//         onCell: record => ({
//           record,
//           inputType: col.dataIndex === 'age' ? 'number' : 'text',
//           dataIndex: col.dataIndex,
//           title: col.title,
//           editing: this.isEditing(record),
//         }),
//       };
//     });

//     return (
//       <Table
//         components={components}
//         bordered
//         dataSource={this.state.data}
//         columns={columns}
//         rowClassName="editable-row"
//       />
//     );
//   }
// }
