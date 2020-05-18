import React from 'react';
import styles from './index.less';
import WxMpNews from '@/pages/Wx/Material/components/WxMpNews';
import { connect } from 'dva';
import { message } from 'antd';

@connect(({ global, wxMpMaterial: { paging }, loading, ...rest }) => {
  return {
    uploadNewsLoading: loading.effects['wxMpMaterial/uploadNews'],
  };
}, dispatch => ({
  $uploadNews: (args = {}) => dispatch({ type: 'wxMpMaterial/uploadNews', ...args }),
}))
class index extends React.Component {
  state = {};

  render() {
    let { uploadNewsLoading } = this.props;
    return (<div className={styles.page}>
      <WxMpNews onDone={this.onDone} confirmLoading={uploadNewsLoading}/>
    </div>);
  }


  onDone = ({ newsItems }) => {
    let { $uploadNews, location: { query: { appid } } } = this.props;
    $uploadNews({
      payload: {
        newsItems: newsItems,
        appid: appid,
      },
      callback: () => message.success('新增成功'),
    });
  };
}

export default index;
