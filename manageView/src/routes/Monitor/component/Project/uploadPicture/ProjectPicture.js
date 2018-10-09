import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Upload, Icon, Modal, message, Button, Row, Col, Slider, Select } from 'antd';
import axios from 'axios';
import { isNull } from 'util';
import uuidv1 from 'uuid';
import MyCard from './MyCard';
import '../../../../Config';

const { Option } = Select;

export default class UploadPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [], // 上传文件列表
      description: new Map(), // 图片描述map
      scale: 1.0, // 图片默认倍率
      canvas: [], // 当前生成的剪辑后图片
      hasResultPicture: false, // 图片预览判断有无图片剪辑
      resultPictures: [], // 图片剪辑后结果集
      showEditModal: false, // 显示编辑图片框
      imageType: [], // 选择图片类型
      selectedImageType: null, // 选中的图片类型
      showUploading: false, // 显示正在上传
    };
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getImageType`)
      .then(result => {
        const imageType = result.data.data;
        const temp = [];
        for (const key in imageType) {
          if (key != null) {
            temp.push({ x: imageType[key].scId, y: imageType[key].itemName });
          }
        }
        this.setState({ imageType: temp });
      })
      .catch(() => {
        message.error('获取图片类型失败');
      });
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
        // const canvas1 = this.editor.getImageScaledToCanvas().toDataURL("image/png");

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

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleUpload = () => {
    this.setState({ showUploading: true });
    const { description, resultPictures, selectedImageType } = this.state;
    const { projectId } = this.props;
    const formData = new FormData();
    resultPictures.forEach(file => {
      const { uid, pic } = file;
      if (isNull(description.get(uid)) || typeof description.get(uid) === 'undefined') {
        description.set(uid, '尚未添加描述');
      }
      formData.append('descriptions', description.get(uid));
      formData.append('files', this.dataURLtoBlob(pic));
    });
    formData.append('imageType', selectedImageType);
    formData.append('projectId', projectId);
    axios({
      url: `http://${global.constants.onlineWeb}/managerProject/uploadPicture`,
      method: 'post',
      processData: false,
      data: formData,
    })
      .then(() => {
        this.setState({
          resultPictures: [],
          description: new Map(),
        });
        message.success('upload successfully.');
        this.setState({ showUploading: false });
      })
      .catch(() => {
        message.error('upload failed.');
        this.setState({ showUploading: false });
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
      fileList,
      description,
      canvas,
      scale,
      hasResultPicture,
      resultPictures,
      showEditModal,
      imageType,
      selectedImageType,
      showUploading,
    } = this.state;
    return (
      <div>
        <Modal
          visible={showEditModal}
          width={1200}
          onOk={() => {
            this.clickSave();
            this.setState({ showEditModal: false });
          }}
          onCancel={() => {
            this.setState({
              showEditModal: false,
              fileList: [],
              canvas: [],
              hasResultPicture: false,
            });
          }}
          destroyOnClose
        >
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
                onImageReady={() => {
                  this.onClickSave();
                }}
                onMouseUp={() => {
                  this.onClickSave();
                }}
                rotate={0}
              />
              <Slider
                min={0.1}
                step={0.1}
                max={2.0}
                defaultValue={scale}
                style={{ width: 580 }}
                onChange={value => {
                  this.setState({ scale: value });
                }}
              />
              <br />
              {/* <img src={canvas} alt="xxx" /> */}
            </Col>
            <Col span={6}>
              <h3 style={{ marginTop: 10 }}>
                <Icon type="book" />图片预览
              </h3>
              <hr />
              {hasResultPicture ? <img src={canvas} alt="xxx" width={416} visible="false" /> : null}
            </Col>
          </Row>
        </Modal>
        <Row>
          <Col span={4}>
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
              <Button
                disabled={fileList.length > 0}
                type="primary"
                onClick={() => {
                  this.setState({ showEditModal: true });
                }}
              >
                <Icon type="upload" /> 选择图片
              </Button>
            </Upload>
          </Col>
          <Col>
            <Select
              placeholder="请选择图片类型"
              showSearch
              optionFilterProp="children"
              style={{ width: 200 }}
              onChange={value => {
                this.setState({ selectedImageType: value });
              }}
            >
              {imageType.map(v => {
                return (
                  <Option key={v.x} value={v.x}>
                    {v.y}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row>
          {resultPictures.map(v => {
            return (
              <Col span={7} offset={0.8} style={{ marginBottom: 10, marginTop: 10 }}>
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
        {resultPictures.length > 0 && selectedImageType !== null ? <hr /> : null}
        {resultPictures.length > 0 && selectedImageType !== null ? (
          <Button style={{ marginLeft: 520 }} type="primary" onClick={this.handleUpload}>
            上传
          </Button>
        ) : null}
        <Modal visible={showUploading} footer={null}>
          正在上传，请勿刷新!
        </Modal>
      </div>
    );
  }
}
