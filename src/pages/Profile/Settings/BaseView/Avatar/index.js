import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Upload } from 'antd';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let { children, src } = this.props;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        onChange={this.handleChange}>
        <Avatar size={100} icon={<UserOutlined/>} src={src}/>
      </Upload>
    );
  }
}

export default index;
