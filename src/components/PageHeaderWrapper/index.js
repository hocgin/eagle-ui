import React from 'react';
import styles from './index.less';
import * as classnames from 'classnames';
import PropTypes from 'prop-types';
import PageHeader from '@/components/PageHeader';
import MenuContext from '@/layouts/BasicLayout/MenuContext';

class Index extends React.PureComponent {
  render() {
    let { children, contentWidth, wrapperClassName, top, menuPaths, ...restProps } = this.props;
    return (<div className={classnames(styles.component, wrapperClassName)}>
      {top}
      <MenuContext.Consumer>{value => (<PageHeader key="pageHeader" {...value} {...restProps}/>)}</MenuContext.Consumer>
      {children ? (<div className={styles.content}>
        {children}
      </div>) : null}
    </div>);
  }

  static propTypes = {
    children: PropTypes.node,
    top: PropTypes.node,
    wrapperClassName: PropTypes.string,
    loading: PropTypes.bool,
    hiddenBreadcrumb: PropTypes.bool,
    // array<{key: string, tab: ReactNode}>
    tabList: PropTypes.array,
    // array<{url: string, title: string, icon: string}>
    menuPaths: PropTypes.array,
    logo: PropTypes.node,
    title: PropTypes.node,
    action: PropTypes.node,
    content: PropTypes.node,
    extraContent: PropTypes.node,
    tabBarExtraContent: PropTypes.node,
    tabDefaultActiveKey: PropTypes.string,
    tabActiveKey: PropTypes.string,
  };

  static defaultProps = {
    children: <></>,
    top: null,
    wrapperClassName: null,
    loading: false,
    hiddenBreadcrumb: false,
    tabList: [],
    menuPaths: [],
    tabBarExtraContent: null,
    logo: null,
    title: null,
    action: null,
    content: null,
    extraContent: null,
    tabDefaultActiveKey: null,
    tabActiveKey: null,
  };
}

export default Index;
