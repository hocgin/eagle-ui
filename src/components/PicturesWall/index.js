import React from 'react';
import { Modal, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Config from '@/config';
import LocalStorage from '@/utils/LocalStorage';
import UiUtils from '@/utils/UiUtils';
import PropTypes from 'prop-types';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Index extends React.Component {
  state = {
    previewVisible: false,
    previewImage: [],
    fileList: [],
  };

  render() {
    let { maxLength, defaultFileList } = this.props;
    let { previewVisible, fileList, previewImage } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined/>
        <div>上传</div>
      </div>
    );
    return (
      <div>
        <Upload action={`${Config.host()}/api/file/upload`}
                headers={{
                  Token: `Bearer ${LocalStorage.getToken()}`,
                }}
                defaultFileList={defaultFileList}
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
        >
          {fileList.length >= maxLength ? null : uploadButton}
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
    let { onChange } = this.props;
    fileList = fileList.map(file => {
      let result = file.response;
      if (result) {
        // Component will show file.url as link
        if (UiUtils.showErrorMessageIfExits(result)) {
          file.url = result.data;
        } else {
          file.status = 'error';
        }
      }
      return file;
    });
    console.log('fileList', fileList);
    this.setState({ fileList });
    onChange(fileList.filter(({ url }) => url).map(({ url, name }) => ({ url, name })));
  };

  handleCancel = () => this.setState({ previewVisible: false });


  static propTypes = {
    maxLength: PropTypes.number,
    onChange: PropTypes.func,
    defaultFileList: PropTypes.array,
  };

  static defaultProps = {
    maxLength: 1000,
    defaultFileList: [],
    onChange: (values = []) => {
    },
  };
}

export default Index;
