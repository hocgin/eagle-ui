import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import VoiceCard from '@/components/VoiceCard';
import { connect } from 'dva';
import { Button, Card, Form } from 'antd';
import Upload from '@/components/Upload';
import UiUtils from '@/utils/UiUtils';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, wxMpMaterial: { paging }, loading, ...rest }) => {
  return {
    confirmLoading: loading.effects['wxMpMaterial/uploadVoice'],
  };
}, dispatch => ({
  $uploadVoice: (args = {}) => dispatch({ type: 'wxMpMaterial/uploadVoice', ...args }),
}))
class index extends React.Component {
  state = {
    appid: null,
    url: `https://daigou-test.oss-cn-beijing.aliyuncs.com/ef35038e29ef252eb0da6d90a88a18f5/Day5-实用价值.mp3`,
  };

  render() {
    let { confirmLoading } = this.props;
    let { url } = this.state;
    let loading = null;
    const button = (<div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div>选择音频</div>
    </div>);

    return (<PageHeaderWrapper className={styles.page}>
      <Card>
        <Form>
          <Form.Item {...formLayout} label="音频"
                     rules={[{ required: true, message: '请上传音频' }]}
                     name="title">
            <Upload name="file"
                    listType="picture-card"
                    showUploadList={false}
                    onChange={this.handleChange}>
              {url ? `点击重新选择` : button}
            </Upload>
            <VoiceCard width={200} height={100}/>
          </Form.Item>
          <Form.Item {...{ wrapperCol: { span: 5, push: 5 } }}>
            <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
                    onClick={this.onDone}>保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>);
  }

  handleChange = ({ file, fileList }) => {
    let result = file.response;
    if (result) {
      if (UiUtils.showErrorMessageIfExits(result)) {
        file.url = result.data;
        this.setState(() => {
          return { url: file.url };
        });
      }
    }
  };
}

export default index;
