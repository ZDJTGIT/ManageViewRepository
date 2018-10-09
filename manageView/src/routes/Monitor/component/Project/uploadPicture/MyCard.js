import React, { Component } from 'react';
import { Card, Icon, Input } from 'antd';

const { Meta } = Card;
const { TextArea } = Input;

export default class MyCard extends Component {
  render() {
    const { img, uid, value } = this.props;
    const { props } = this;
    return (
      <Card
        style={{ width: 300 }}
        cover={<img alt="example" src={img} style={{ height: 150 }} />}
        actions={[
          <Icon
            type="close"
            onClick={() => {
              props.deleteCard(uid);
            }}
          />,
        ]}
      >
        <Meta title="图片描述：" />
        <TextArea
          style={{ marginTop: 5 }}
          onChange={e => {
            props.saveWords(uid, e);
          }}
          value={value}
        />
      </Card>
    );
  }
}
