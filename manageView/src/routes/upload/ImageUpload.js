import React, { Component } from 'react';
import { 
Upload,
Icon,
Modal,
Card,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImageUpload.less';

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <PageHeaderLayout
        title="资源上传"
        content="资源文件上传"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="图片上传" className={styles.card} bordered={false}>
          <div className="clearfix">
            <Upload
              action="http://localhost:8090/file/imageupload"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 4 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
