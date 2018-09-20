import React, { Component } from 'react';
import { Upload, Icon, Modal, message, Button, Row, Col, Input, Card } from 'antd';
import axios from 'axios';
import { isNull } from 'util';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import '../Config';

const { TextArea } = Input;
export default class UploadPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      description: new Map(),
      priority: new Map(),
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.removePicture = this.removePicture.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changePriority = this.changePriority.bind(this);
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleUpload = () => {
    const { fileList, description, priority } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      const { uid } = file;
      if (isNull(description.get(uid)) || typeof description.get(uid) === 'undefined') {
        description.set(uid, '尚未添加描述');
      }
      if (isNull(priority.get(uid)) || typeof priority.get(uid) === 'undefined') {
        priority.set(uid, -1);
      }
      formData.append('description', description.get(uid));
      formData.append('priority', priority.get(uid));
      formData.append('files', file.originFileObj);
    });

    axios({
      url: `http://${global.constants.onlineWeb}/app/uploadPictures`,
      method: 'post',
      processData: false,
      data: formData,
    })
      .then(() => {
        this.setState({
          fileList: [],
          description: new Map(),
          priority: new Map(),
        });
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      });
  };

  removePicture(file) {
    const { uid } = file;
    const { description, priority } = this.state;
    const temp1 = description;
    const temp2 = priority;
    temp1.delete(uid);
    temp2.delete(uid);
    this.setState({ description: temp1, priority: temp2 });
    return true;
  }

  changeDescription(e, v) {
    const { description } = this.state;
    const temp = description;
    temp.set(v.uid, e.target.value);
    this.setState({ description: temp });
  }

  changePriority(e, v) {
    const { priority } = this.state;
    const temp = priority;
    temp.set(v.uid, e.target.value);
    this.setState({ priority: temp });
  }

  render() {
    const { previewVisible, previewImage, fileList, description, priority } = this.state;

    return (
      <PageHeaderLayout
        title="手机轮播图上传"
        content="该作者前端技术有限，暂时只能实现上传，
        上传后无法进行修改，请再三确认后再上传！！！界面丑陋，请多包涵！"
      >
        <Card>
          <Row gutter={1}>
            <Col span={10}>
              <Upload
                action={`http://${global.constants.onlineWeb}/app/uploadPictures`}
                listType="picture"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                onRemove={this.removePicture}
                multiple
                accept="image/*"
                name="files"
                beforeUpload={file => {
                  this.setState(() => ({
                    fileList: [...fileList, file],
                  }));
                  return false;
                }}
              >
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </Upload>
            </Col>
            <Col span={12} style={{ marginTop: '32px' }} id="pictureIntroduce">
              {fileList.map(v => {
                return (
                  <div style={{ marginTop: '8px', height: '66px' }} id={v.uid}>
                    <TextArea
                      style={{ height: '66px', width: '45%', marginLeft: '5%' }}
                      placeholder="图片描述"
                      id={1 + v.uid}
                      value={description.get(v.uid)}
                      onChange={e => this.changeDescription(e, v)}
                    />
                    <Input
                      type="number"
                      placeholder="图片优先级"
                      style={{ width: '22%', height: 66, marginLeft: '2%' }}
                      id={2 + v.uid}
                      onChange={e => this.changePriority(e, v)}
                      value={priority.get(v.uid)}
                    />
                  </div>
                );
              })}
              <Col
                span={fileList.length === 0 ? 0 : 8}
                style={{ marginTop: '2vh', marginLeft: '60%' }}
              >
                <Button
                  className="upload-demo-start"
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fileList.length === 0}
                >
                  上传
                </Button>
              </Col>
            </Col>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={888}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
