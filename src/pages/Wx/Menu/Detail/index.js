import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WxMpPage from '@/pages/Wx/Menu/components/WxMpPage';
import { connect } from 'dva';
import { message } from 'antd';

@connect(({ global, wxMpMenu: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    id: (detail || {}).id,
    getOneLoading: loading.effects['wxMpMenu/getOne'],
    confirmLoading: loading.effects['wxMpMenu/update'],
  };
}, dispatch => ({
  $updateOne: (args = {}) => dispatch({ type: 'wxMpMenu/update', ...args }),
}))
class index extends React.Component {

  render() {
    let { confirmLoading, detail, getOneLoading } = this.props;
    if (getOneLoading) {
      return null;
    }

    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <WxMpPage onDone={this.onDone} confirmLoading={confirmLoading}
                button={[...(detail.button || [])]}
                base={{
                  ...(detail.matchRule || {}),
                  appid: detail.appid,
                  enabled: detail.enabled === 1,
                  menuType: detail.menuType,
                  title: detail.title,
                }}/>
    </PageHeaderWrapper>);
  }

  onDone = (values) => {
    let { id, $updateOne } = this.props;
    $updateOne({
      payload: {
        ...values,
        id,
        enabled: values.enabled ? 1 : 0,
      },
      callback: () => {
        message.success('更新成功');
      },
    });
  };
}

export default index;
