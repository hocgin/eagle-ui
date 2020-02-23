import React from 'react';
import styles from './index.less';
import { PageHeader } from 'antd';

class Index extends React.PureComponent {
  render() {
    let { children } = this.props;
    return (
      <div className={styles.component}>
        {/*<PageHeader title={"标题"}/>*/}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

export default Index;
