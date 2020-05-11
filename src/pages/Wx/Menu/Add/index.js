import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WxMpPage from '@/pages/Wx/Menu/components/WxMpPage';
import { connect } from 'dva';
import { message } from 'antd';

@connect(({ global, wxMpMenu: { allWxMenuType }, loading, ...rest }) => {
  return {
    confirmLoading: loading.effects['wxMpMenu/insert'],
  };
}, dispatch => ({
  $insertOne: (args = {}) => dispatch({ type: 'wxMpMenu/insert', ...args }),
}))
class index extends React.Component {

  render() {
    let { confirmLoading, location: { query: { appid = '' } } } = this.props;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <WxMpPage onDone={this.onDone} confirmLoading={confirmLoading} base={{
        appid: `${appid}`,
      }}/>
    </PageHeaderWrapper>);
  }

  onDone = (values) => {
    let { $insertOne, location: { query: { appid } } } = this.props;
    $insertOne({
      payload: {
        ...values,
        appid: appid,
        enabled: values.enabled ? 1 : 0,
      },
      callback: () => {
        message.success('新增成功');
      },
    });
  };
}

export default index;
