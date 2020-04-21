import React from 'react';
import styles from './index.less';
import { Breadcrumb } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import * as classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'umi';

class Index extends React.PureComponent {
  render() {
    let { menuPaths } = this.props;
    return (<Breadcrumb className={classnames(styles.component)}>
      {(menuPaths || []).map(({ path, title, icon }) => (<Breadcrumb.Item key={`${title}`} href={path}>
        <Link to={path}>
          {icon && <LegacyIcon type={`${icon}`}/>}
          <span> {title}</span>
        </Link>
      </Breadcrumb.Item>))}
    </Breadcrumb>);
  }

  static propTypes = {
    // array<{url: string, title: string, icon: string}>
    menuPaths: PropTypes.array,
  };

  static defaultProps = {
    menuPaths: [],
  };
}

export default Index;
