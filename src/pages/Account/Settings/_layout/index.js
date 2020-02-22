import React from 'react';
import styles from './index.less';
import { Menu } from 'antd';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let { children } = this.props;
    return (
      <div className={styles.page}>
        <div className={styles.left}>
          <Menu
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline">
            <Menu.Item key="1">基本设置</Menu.Item>
          </Menu>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>基本信息</div>
          {children}
        </div>
      </div>
    );
  }
}

export default index;
