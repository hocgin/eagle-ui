import React from 'react';
import styles from './index.less';
import { Skeleton, Tabs } from 'antd';
import PropTypes from 'prop-types';
import BreadcrumbView from '@/components/BreadcrumbView';
import * as classnames from 'classnames';


class Index extends React.PureComponent {
  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  render() {
    let {
      loading, hiddenBreadcrumb, logo, title, action, content, extraContent,
      tabList,
      tabBarExtraContent,
      tabDefaultActiveKey,
      tabActiveKey,
      className,
      menuPaths,
      ...restProps
    } = this.props;

    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    return (
      <div className={classnames(styles.component, className)} {...restProps}>
        <div>
          <Skeleton title={false}
                    loading={loading}
                    active
                    paragraph={{ rows: 3 }}
                    avatar={{ size: 'large', shape: 'circle' }}>
            {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />}
            <div className={styles.detail}>
              {logo && <div className={styles.logo}>{logo}</div>}
              <div className={styles.main}>
                <div className={styles.row}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                  {action && <div className={styles.action}>{action}</div>}
                </div>
                <div className={styles.row}>
                  {content && <div className={styles.content}>{content}</div>}
                  {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                </div>
              </div>
            </div>
            {tabList && tabList.length ? (<Tabs
              className={styles.tabs}
              {...activeKeyProps}
              onChange={this.onChange}
              tabBarExtraContent={tabBarExtraContent}>
              {tabList.map((item) => (<Tabs.TabPane tab={item.tab} key={item.key}/>))}
            </Tabs>) : null}
          </Skeleton>
        </div>
      </div>
    );
  }

  static propTypes = {
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
