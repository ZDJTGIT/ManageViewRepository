import React, { Component } from 'react';
import { Upload, Button, Icon, Row, Col, Modal, message, Select } from 'antd';
import { isNull } from 'util';
import axios from 'axios';
import MyCard from './MyCard';
import '../../../../Config';

const { Option } = Select;

export default class AndroidUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [], // 文件列表
      description: new Map(), // 图片描述
      showUploading: false, // 显示上传提示弹窗
      imageType: [], // 图片类型
      selectedImageType: '', // 当前选中类型
    };
  }

  componentWillMount() {
    axios
      .get(`http://${global.constants.onlineWeb}/managerProject/getAndroidImageType`)
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
      .catch(() => {});
  }

  getObjectURL = file => {
    let url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL !== undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL !== undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  };

  // 保存输入的文字描述
  saveWords = (uid, e) => {
    const { description } = this.state;
    const temp = description;
    temp.set(uid, e.target.value);
    this.setState({ description: temp });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  changepic = file => {
    // console.log(obj.files[0]);//这里可以获取上传文件的name
    const newsrc = this.getObjectURL(file);
    return newsrc;
  };

  // 删除展片
  deleteCard = value => {
    const { description, fileList } = this.state;
    const list = fileList;
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].uid === value) {
        list.splice(i, 1);
      }
    }
    const desc = description;
    desc.delete(value);
    this.setState({ description: desc, fileList: list });
  };

  handleUpload = () => {
    this.setState({ showUploading: true });
    const { fileList, description, selectedImageType } = this.state;
    const { projectId } = this.props;
    const formData = new FormData();
    fileList.forEach(v => {
      const { uid } = v;
      if (isNull(description.get(uid)) || typeof description.get(uid) === 'undefined') {
        description.set(uid, '尚未添加描述');
      }
      formData.append('descriptions', description.get(uid));
      formData.append('files', v.originFileObj);
    });
    formData.append('projectId', projectId);
    formData.append('imageType', selectedImageType);
    axios({
      url: `http://${global.constants.onlineWeb}/managerProject/uploadAndroidPicture`,
      method: 'post',
      processData: false,
      data: formData,
    })
      .then(result => {
        message.success(result.data.msg);
        this.setState({ showUploading: false, fileList: [], description: new Map() });
      })
      .catch(() => {
        message.error('上传失败,请联系研发人员！');
        this.setState({ showUploading: false });
      });
  };

  render() {
    const { fileList, description, showUploading, imageType, selectedImageType } = this.state;
    return (
      <div>
        <Row>
          <Col span={4}>
            <Select
              placeholder="安卓图片类型"
              showSearch
              optionFilterProp="children"
              style={{ width: 140, marginBottom: '10px' }}
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
            <Upload
              // action={`http://${global.constants.onlineWeb}/app/uploadPictures`}
              listType="null"
              fileList={fileList}
              // onPreview={this.handlePreview}
              multiple
              onChange={this.handleChange}
              accept="image/*"
              name="files"
              beforeUpload={(file, fileList1) => {
                this.setState(() => ({
                  fileList: [...fileList, fileList1],
                }));
                return false;
              }}
            >
              <Button type="primary">
                <Icon type="upload" /> 选择图片
              </Button>
            </Upload>
          </Col>
          <Col span={20}>
            <Row>
              {fileList.map(file => {
                const src = this.changepic(file.originFileObj);
                return (
                  <Col span={8} style={{ marginBottom: 10, marginTop: 10 }}>
                    <MyCard
                      uid={file.uid}
                      img={src}
                      value={description.get(file.uid)}
                      saveWords={this.saveWords}
                      deleteCard={this.deleteCard}
                    />
                    {/* <MyCard img={v.pic} uid={v.uid} deleteCard={this.deleteCard} saveWords={this.saveWords} value={description.get(v.uid)} /> */}
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Modal visible={showUploading} footer={null}>
            正在上传，请勿刷新!
          </Modal>
        </Row>
        {fileList.length > 0 && selectedImageType !== '' ? <hr /> : null}
        {fileList.length > 0 && selectedImageType !== '' ? (
          <Button style={{ marginLeft: 520 }} type="primary" onClick={this.handleUpload}>
            上传
          </Button>
        ) : null}
      </div>
    );
  }
}
