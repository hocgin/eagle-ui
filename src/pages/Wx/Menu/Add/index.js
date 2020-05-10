import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import WxMpPage from '@/pages/Wx/Menu/components/WxMpPage';

class index extends React.Component {


  render() {
    let {} = this.props;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <WxMpPage/>
    </PageHeaderWrapper>);
  }
}

export default index;
