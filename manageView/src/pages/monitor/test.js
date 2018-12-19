import React, { Component } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;

@Form.create()
@connect(({ test }) => ({
  test
}))
export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      re: 0,
    }
  }

  render() {
    const{test,dispatch} = this.props;
    const { re } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" style={{ marginTop: '3%' }}>
        <FormItem hasFeedback label="账&emsp;号:">
          {getFieldDecorator('account', {
            rules: [
              { required: true, message: '请输入账号' },
              { validator: this.checkmonitorPoint },
            ],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="账号"
            />
          )}
        </FormItem>
        <FormItem hasFeedback label="密&emsp;码:">
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码' },
              { validator: this.checkmonitorPoint },
            ],
          })(
            <Input
              type="text"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="密码"
            />
          )}
        </FormItem>
        <Button onClick={() => { this.test() }}>测试</Button>
        <Row>
          <Col span={re}>登陆成功了，别试了</Col>
        </Row>
      </Form>
    );
  }

  componentWillMount(){
    // const{test,dispatch} = this.props;
    // dispatch({
    //   type: 'test/fetch',
    //   payload:{kx:111},
    //   callBack:()=>{
    //     alert(111)
    // }
    // });
  }
}