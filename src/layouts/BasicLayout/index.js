import { Icon as LegacyIcon } from '@ant-design/compatible';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input, Layout, Menu } from 'antd';
import React from 'react';
import styles from './index.less';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import { connect } from 'dva';
import MenuUtils from './menus';
import SiderMenus from './components/SiderMenus';
import { getDefaultCollapsedSubMenus } from '@/layouts/BasicLayout/components/SiderMenus';
import NoticeIcon from '@/components/NoticeIcon';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import EmptyNotify from '@/assets/EmptyNotify.svg';
import Context from './MenuContext';
import Goto from '@/utils/Goto';

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;

// Conversion router to menu.
function formatter(tree, data) {
  return MenuUtils.getMenu(tree, data);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const formatMessage = ({ notifyId, actor: { avatar }, content, title, createdAt }) => {
  return {
    id: notifyId,
    avatar: avatar,
    description: content,
    title: title,
    datetime: DateFormatter.timestampAs(createdAt),
  };
};

@connect(({ apps: { notifySummary, currentAccount, currentAccountAuthority = [] }, loading, ...rest }) => {
  let { nickname, avatar } = currentAccount;
  return {
    nickname: nickname,
    avatar: avatar,
    notifySummary: notifySummary,
    menus: currentAccountAuthority,
  };
}, dispatch => ({
  $getCurrentAccountInfo: (args = {}) => dispatch({ type: 'apps/getCurrentAccountInfo', ...args }),
  $getCurrentAccountAuthority: (args = {}) => dispatch({ type: 'apps/getCurrentAccountAuthority', ...args }),
  $getNotifySummary: (args = {}) => dispatch({ type: 'apps/getNotifySummary', ...args }),
}))
class BasicLayout extends React.Component {

  state = {
    collapsed: false,
    menuData: [],
  };

  constructor(...args) {
    super(...args);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.fastMatchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.fastGetDefaultCollapsedSubMenus = memoizeOne(getDefaultCollapsedSubMenus, isEqual);
  }

  componentDidMount() {
    let { $getCurrentAccountInfo, $getCurrentAccountAuthority, $getNotifySummary } = this.props;
    $getCurrentAccountInfo({
      callback: () => {
        $getCurrentAccountAuthority();
        $getNotifySummary();
      },
    });
  }

  render() {
    let { collapsed } = this.state;
    let {
      children, nickname, avatar,
      notifySummary,
      menus, location: { pathname },
    } = this.props;
    if (menus.length <= 0) {
      return (<></>);
    }

    const userDropdownMenus = (<Menu>
      <Menu.Item onClick={Goto.profileSettings}>个人资料</Menu.Item>
      <Menu.Item onClick={Goto.profileNotifications}>通知中心</Menu.Item>
      <Menu.Item>修改密码</Menu.Item>
      <Menu.Item>退出登录</Menu.Item>
    </Menu>);
    let menuData = this.getMenuData();
    let menu = this.fastMatchParamsPath(pathname);
    let defaultOpenKeys = menu ? [menu.code] : null;
    let openMenus = this.fastGetDefaultCollapsedSubMenus(pathname, menuData);

    let layout = <Layout className={styles.component}>
      {/*左侧*/}
      <Sider className={styles.sider}
             width={250}
             trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo}/>
        <SiderMenus {...this.props}
                    data={menuData}
                    defaultOpenKeys={defaultOpenKeys}
                    className={styles.menus}/>
      </Sider>
      {/*右侧*/}
      <Layout>
        <Header className={styles.header}>
          <LegacyIcon className={styles.trigger}
                      type={collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.onToggle}/>
          <div style={{ flex: 1 }}>
          </div>
          <div className={styles.toolbar}>
            <div>
              <Search
                placeholder="搜索.."
                style={{ width: 230, marginRight: 40 }}/>
            </div>
            <NoticeIcon className={classnames(styles.btn, styles.notice)}
                        popupAlign={{ offset: [0, -16] }}
                        count={notifySummary.unready}>
              <NoticeIcon.Tab title="私信"
                              list={(notifySummary.privateLetter || []).map(({ content, ...rest }) => formatMessage({ title: content, ...rest }))}
                              name="privateLetter"
                              emptyText="暂无私信"
                              emptyImage={EmptyNotify}/>
              <NoticeIcon.Tab title="通知"
                              list={(notifySummary.subscription || []).map(({ content, ...rest }) => formatMessage({ title: content, ...rest }))}
                              name="subscription"
                              emptyText="暂无通知"
                              emptyImage={EmptyNotify}/>
              <NoticeIcon.Tab title="公告"
                              list={(notifySummary.announcement || []).map(({ content, ...rest }) => formatMessage({ title: content, ...rest }))}
                              name="announcement"
                              emptyText="暂无公告"
                              emptyImage={EmptyNotify}/>
            </NoticeIcon>
            <div className={classnames(styles.btn, styles.username)}>
              <Dropdown overlay={userDropdownMenus}>
                <a onClick={e => e.preventDefault()}>
                  <Avatar shape="circle" icon={<UserOutlined/>} src={avatar}/> {nickname}
                </a>
              </Dropdown>
            </div>
            <div className={styles.btn}>
              <SettingOutlined style={{ fontSize: 18 }}/>
            </div>
          </div>
        </Header>
        <Content className={styles.content}>
          {/*内容*/}
          {children}
        </Content>
        <Footer>Hi.</Footer>
      </Layout>
    </Layout>;
    return <>
      <DocumentTitle title={this.getPageTitle(pathname)}>
        <ContainerQuery query={query}>
          {params => (<Context.Provider value={{ menuPaths: openMenus }}>
            <div className={classnames(params, styles.contentWrapper)}>{layout}</div>
          </Context.Provider>)}
        </ContainerQuery>
      </DocumentTitle>
    </>;
  }

  /**
   * 获取树型菜单项
   * @return {*}
   */
  getMenuData() {
    const {
      menus,
      route: { routes },
    } = this.props;
    return memoizeOneFormatter(menus, routes);
  }


  /**
   * 通过路径找到菜单对象
   * @param pathname
   * @return {*}
   */
  matchParamsPath(pathname) {
    let breadcrumbNameMap = this.getBreadcrumbNameMap();
    const pathKey = Object.keys(breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname),
    );
    return breadcrumbNameMap[pathKey];
  }

  /**
   * 将菜单扁平化
   * @return {{
   *   '/': {},
   *   '/index': {},
   *}}
   */
  getBreadcrumbNameMap() {
    let menuData = this.getMenuData();
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      (data || []).forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        routerMap[`${menuItem.path}`] = menuItem;
      });
    };
    mergeMenuAndRouter(menuData);
    return routerMap;
  }

  getPageTitle = pathname => {
    return `Eagle 后台`;
  };

  /**
   * 切换菜单展开和缩起
   */
  onToggle = () => {
    this.setState(({ collapsed }) => {
      return ({
        collapsed: !collapsed,
      });
    });
  };

}

export default BasicLayout;
