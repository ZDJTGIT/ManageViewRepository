import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Upload, Icon, Modal, message, Button, Row, Col, Input, Card, Slider } from 'antd';
import axios from 'axios';
import { isNull } from 'util';
import uuidv1 from 'uuid';
import MyCard from './MyCard';
import '../Config';

const { TextArea } = Input;
export default class UploadPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false, // 上传文件预览开关（暂弃）
      previewImage: '', // 上传文件预览图片（暂弃）
      fileList: [], // 上传文件列表
      description: new Map(), // 图片描述map
      priority: new Map(), // 图片优先级map（暂弃）
      scale: 1.0, // 图片默认倍率
      canvas: [], // 当前生成的剪辑后图片
      showUpload: false, // 显示上传按钮
      hasResultPicture: false, // 图片预览判断有无图片剪辑
      resultPictures: [], // 图片剪辑后结果集
    };
  }

  // 编辑器保存图片
  onClickSave = () => {
    const { fileList } = this.state;
    if (fileList.length > 0) {
      if (this.editor) {
        // 生成实际图片截取的大小
        const canvas1 = this.editor.getImage().toDataURL('image/jpg');
        //   console.log(this.editor.getImageScaledToCanvas());
        //   // 生成指定框生成的大小
        //   const canvasScaled1 = this.editor.getImageScaledToCanvas().toDataURL("image/png");

        this.setState({ canvas: canvas1 });
        this.setState({ hasResultPicture: true });
      }
    }
  };

  setEditorRef = editor => {
    this.editor = editor;
  };

  // 删除展片
  deleteCard = value => {
    const { description, resultPictures } = this.state;
    const resul = resultPictures;
    for (let i = 0; i < resul.length; i += 1) {
      if (resul[i].uid === value) {
        resul.splice(i, 1);
      }
    }
    const desc = description;
    desc.delete(value);
    this.setState({ description: desc, resultPictures: resul });
  };

  // 保存输入的文字描述
  saveWords = (uid, e) => {
    const { description } = this.state;
    const temp = description;
    temp.set(uid, e.target.value);
    this.setState({ description: temp });
  };

  // 手动保存图片（设置结果集，重置生成的剪辑图片，设置图片剪辑）
  clickSave = () => {
    const { resultPictures, canvas } = this.state;
    this.setState({
      resultPictures: [...resultPictures, { pic: canvas, uid: uuidv1.v1() }],
      canvas: [],
      hasResultPicture: false,
      fileList: [],
    });
    setTimeout(() => {}, 1000);
  };

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

  dataURLtoBlob = data => {
    const tmp = data.split(',');
    tmp[1] = tmp[1].replace('//s/g', '');
    const binary = atob(tmp[1]);
    const array = [];
    for (let i = 0; i < binary.length; i += 1) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
  };

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      description,
      priority,
      canvas,
      scale,
      showUpload,
      hasResultPicture,
      resultPictures,
    } = this.state;

    return (
      <div>
        <Row>
          <Col span={14}>
            <AvatarEditor
              ref={this.setEditorRef}
              image={fileList.length > 0 || fileList === [] ? fileList[0].originFileObj : null}
              width={480}
              height={270}
              border={50}
              borderRadius={0}
              color={[0, 0, 0, 0.6]} // RGBA
              scale={scale}
              onMouseUp={() => {
                this.onClickSave();
              }}
              rotate={0}
            />
            <Slider
              min={0.1}
              step={0.1}
              max={2.0}
              defaultValue={1.0}
              style={{ width: 580 }}
              onChange={value => {
                this.setState({ scale: value });
              }}
            />
            <br />

            {/* <img src={canvas} alt="xxx" /> */}
          </Col>
          <Col span={10}>
            <Upload
              action={`http://${global.constants.onlineWeb}/app/uploadPictures`}
              listType="text"
              fileList={fileList}
              // onPreview={this.handlePreview}
              onChange={this.handleChange}
              onRemove={this.removePicture}
              accept="image/*"
              name="files"
              beforeUpload={file => {
                this.setState(() => ({
                  fileList: [...fileList, file],
                }));
                return false;
              }}
            >
              <Button disabled={fileList.length > 0} type="primary">
                <Icon type="upload" /> 选择图片
              </Button>
            </Upload>
            <h3 style={{ marginTop: 10 }}>
              <Icon type="book" />图片预览
            </h3>
            <hr />
            {hasResultPicture ? <img src={canvas} alt="xxx" width={416} visible="false" /> : null}
            {hasResultPicture ? <br /> : null}
            {hasResultPicture ? (
              <Button
                onClick={() => {
                  this.clickSave();
                }}
                type="primary"
                style={{ marginTop: 10, marginLeft: 180 }}
              >
                保存
              </Button>
            ) : null}
          </Col>

          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={888}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Row>
        <Row gutter={1}>
          {resultPictures.map(v => {
            return (
              <Col span={6} style={{ marginBottom: 20 }}>
                <MyCard
                  img={v.pic}
                  uid={v.uid}
                  deleteCard={this.deleteCard}
                  saveWords={this.saveWords}
                  value={description.get(v.uid)}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
