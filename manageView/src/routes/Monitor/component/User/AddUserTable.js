import React, { Component } from 'react';
import { Row, Col, message, Button, Icon, Form, Input } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
export default class AddUserForm extends Component {
  constructor(props) {
    super(props);
    this.checkUserName = this.checkUserName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.checkPhone = this.checkPhone.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.checkCompany = this.checkCompany.bind(this);
    this.checkRealName = this.checkRealName.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSubmit = e => {
    const { form } = this.props;
    const { props } = this;
    e.preventDefault();
    form.validateFields((err, values) => {
      const value = values;
      if (!err) {
        delete value.confirmPassword;
        axios
          .post('http://10.88.89.148:8080/managerUser/insertUser', value, {
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          })
          .then(() => {
            message.success('新增用户成功');
            setTimeout(() => {
              props.close();
              props.refresh();
              this.handleReset();
            }, 400);
          })
          .catch(() => {
            message.error('新增用户失败');
          });
      }
    });
  };

  // 检查账号
  checkUserName(rule, value, callback) {
    const { users } = this.props;
    if (value != null) {
      const regu1 = '^[ ]+$';
      const re1 = new RegExp(regu1);
      if (value === '' || re1.test(value)) {
        callback('字符串不能为空');
      } else {
        // 规则：中文中文，字母，数字，下划线，减号
        const regu2 = '^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,16}$';
        const re2 = new RegExp(regu2);
        if (!re2.test(value)) {
          callback('用户名限制在2到16位，包含（中文，字母，数字，下划线，减号）');
        } else if (re2.test(value)) {
          for (let i = 0; i < users.length; i += 1) {
            if (users[i].userName === value) {
              callback('用户已存在');
            } else if (i === users.length - 1) {
              if (users[i].userName === value) {
                callback('用户已存在');
              } else if (users[i].userName !== value) {
                callback();
              }
            }
          }
        }
      }
    } else if (value == null) {
      callback('字符串不能为空');
    }
  }

  // 检查密码
  checkPassword(rule, value, callback) {
    const { form } = this.props;
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      const regu2 = '^[a-zA-Z0-9_]{4,16}$';
      const reg2 = new RegExp(regu2);
      if (reg2.test(value)) {
        callback();
      } else {
        callback('密码限制在4-16位，包含（英文字母，数字和下划线）');
      }
    } else {
      callback('密码不能为空');
    }
    // 比对确认密码
    if (value && value !== form.getFieldValue('confirmPassword')) {
      form.validateFields(['confirmPassword'], { force: true });
    }
  }

  // 检查确认密码是否一致
  confirmPassword(rule, value, callback) {
    const { form } = this.props;
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      if (value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致');
      } else {
        callback();
      }
    } else {
      callback('确认密码不能为空');
    }
  }

  // 检查手机号码
  checkPhone(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      const regu2 = '^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$';
      const reg2 = new RegExp(regu2);
      if (reg2.test(value)) {
        callback();
      } else {
        callback('请输入正确的手机号码');
      }
    } else {
      callback('电话不能为空');
    }
  }

  // 检查邮箱
  checkEmail(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      const regu2 = '^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$';
      const reg2 = new RegExp(regu2);
      if (reg2.test(value)) {
        callback();
      } else {
        callback('请输入正确的邮箱地址');
      }
    } else {
      callback('邮箱不能为空');
    }
  }

  // 检查公司
  checkCompany(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('公司不能为空');
    }
  }

  // 检查负责人
  checkRealName(rule, value, callback) {
    const regu1 = '^[ ]+$';
    const reg1 = new RegExp(regu1);
    if (value != null && value !== '' && !reg1.test(value)) {
      callback();
    } else {
      callback('负责人不能为空');
    }
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <FormItem hasFeedback label="用户名:" {...formItemLayout}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }, { validator: this.checkUserName }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="密码:" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码', validator: this.checkPassword }],
          })(
            <Input
              type="password"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="密码"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="确认密码:" {...formItemLayout}>
          {getFieldDecorator('confirmPassword', {
            rules: [{ required: true, message: '请再次输入密码', validator: this.confirmPassword }],
          })(
            <Input
              type="password"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="确认密码"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="手机号码:" {...formItemLayout}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号码', validator: this.checkPhone }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="电话"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="邮箱:" {...formItemLayout}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入邮箱', validator: this.checkEmail }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="邮箱"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="公司:" {...formItemLayout}>
          {getFieldDecorator('company', {
            rules: [{ required: true, message: '请输入公司', validator: this.checkCompany }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="公司"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="姓名:" {...formItemLayout}>
          {getFieldDecorator('realName', {
            rules: [{ required: true, message: '请输入负责人姓名', validator: this.checkRealName }],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="负责人姓名"
            />
          )}
        </FormItem>
        <hr />
        <FormItem style={{ marginBottom: '0px' }}>
          <Row gutter={1}>
            <Col span={4} offset={13}>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
            <Col span={4}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}
