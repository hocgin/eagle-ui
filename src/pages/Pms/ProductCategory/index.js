import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  render() {
    let {} = this.props;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      品类
    </PageHeaderWrapper>);
  }
}

export default index;
