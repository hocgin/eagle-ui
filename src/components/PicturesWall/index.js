import React from 'react';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Config from '@/config';
import LocalStorage from '@/utils/LocalStorage';
import UiUtils from '@/utils/UiUtils';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Index extends React.PureComponent {
  state = {
    previewVisible: false,
    previewImage: [],
    fileList: [],
  };

  render() {
    let {} = this.props;
    let { previewVisible, fileList, previewImage } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action={`${Config.host()}/api/file/upload`}
          headers={{
            Token: `Bearer ${LocalStorage.getToken()}`,
          }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img style={{ width: '100%' }} src={previewImage}/>
        </Modal>
      </div>
    );
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    fileList = fileList.map(file => {
      let result = file.response;
      if (result) {
        // Component will show file.url as link
        console.log('file.response', file);
        if (UiUtils.showErrorMessageIfExits(result)) {
          file.url = result.data;
        } else {
          file.status = 'error';
        }
      }
      return file;
    });
    this.setState({ fileList });
  };

  handleCancel = () => this.setState({ previewVisible: false });
}

export default Index;
