import React from 'react';
import styles from './index.less';
import { Collapse } from 'antd';

class Index extends React.PureComponent {
  render() {
    let { children, ...rest } = this.props;
    return (<div className={styles.component}>
      <Collapse expandIconPosition="right"
                bordered={false}
                accordion {...rest} >
        {children}
      </Collapse>
    </div>);
  }
}

export default Index;
