import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import VoiceCard from '@/components/VoiceCard';
import { connect } from 'dva';
import { Button, Card, Form, message } from 'antd';
import Upload from '@/components/Upload';
import UiUtils from '@/utils/UiUtils';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined';
import ValidUtils from '@/utils/ValidUtils';

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
  createForm = React.createRef();
  state = {
    url: null,
  };

  render() {
    let { confirmLoading } = this.props;
    let { url } = this.state;
    let loading = null;
    const button = (<Button>
      {loading ? <LoadingOutlined/> : <UploadOutlined/>}
      {url ? `重新选择` : `选择音频`}
    </Button>);

    return (<PageHeaderWrapper className={styles.page}>
      <Card>
        <Form ref={this.createForm}>
          <Form.Item {...formLayout} label="音频">
            <Upload name="file"
                    showUploadList={false}
                    onChange={this.handleChange}>
              {button}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 13, offset: 7 }}>
            <VoiceCard width={200} height={100} style={{ marginTop: 10 }} src={url}/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 7 }}>
            <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
                    onClick={this.onDone}>保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>);
  }

  onDone = () => {
    let { $uploadVoice, location: { query: { appid } } } = this.props;
    let { url } = this.state;
    if (ValidUtils.notNull(appid, '请选择公众号')
      && ValidUtils.notNull(url, '请选择音频')) {
      $uploadVoice({
        payload: {
          appid,
          url: url,
        },
        callback: () => {
          message.success('上传成功');
        },
      });
    }
  };

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
