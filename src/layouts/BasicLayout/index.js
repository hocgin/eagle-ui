import { Avatar, Badge, Breadcrumb, Dropdown, Icon, Input, Layout, Menu } from 'antd';
import React from 'react';
import styles from './index.less';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';
import { connect } from 'dva';
import MenuUtils from './menus';
import Menus from './components/Menus';

const { Search } = Input;
const { SubMenu } = Menu;
const { Header, Sider, Content, Footer } = Layout;

// Conversion router to menu.
function formatter(tree, data) {
  return MenuUtils.getMenu(tree, data);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

@connect(({ global, account: { currentAccount, currentAccountAuthority = [] }, loading, ...rest }) => {
  let { nickname, avatar } = currentAccount;
  return {
    nickname: nickname,
    avatar: avatar,
    menus: currentAccountAuthority,
  };
}, dispatch => ({
  $getCurrentAccountInfo: (args = {}) => dispatch({ type: 'account/getCurrentAccountInfo', ...args }),
  $getCurrentAccountAuthority: (args = {}) => dispatch({ type: 'account/getCurrentAccountAuthority', ...args }),
}))
class BasicLayout extends React.Component {

  state = {
    collapsed: false,
    menuData: [],
    openMenus: [],
    selectedKeys: [],
  };

  constructor(...args) {
    super(...args);
  }

  componentDidMount() {
    let { $getCurrentAccountInfo, $getCurrentAccountAuthority } = this.props;
    $getCurrentAccountInfo();
    $getCurrentAccountAuthority();
  }

  render() {
    let { collapsed, openMenus } = this.state;
    let {
      children, nickname, avatar,
      menus, location: { pathname },
    } = this.props;
    const userDropdownMenus = (<Menu>
      <Menu.Item>个人资料</Menu.Item>
      <Menu.Item>修改密码</Menu.Item>
      <Menu.Item>退出登录</Menu.Item>
    </Menu>);
    let menu = this.matchParamsPath(pathname);
    let defaultOpenKeys = menu ? [menu.code] : null;

    return (<>
      {menus.length > 0 && <Layout className={styles.component}>
        {/*左侧*/}
        <Sider className={styles.sider}
               width={250}
               trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logo}/>
          <Menus data={this.getMenuData()}
                 {...this.props}
                 defaultOpenKeys={defaultOpenKeys}
                 className={styles.menus} onClick={this.onClickItem}/>
        </Sider>
        {/*右侧*/}
        <Layout>
          <Header className={styles.header}>
            <Icon className={styles.trigger}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.onToggle}
            />
            <div style={{ flex: 1 }}>
            </div>
            <div className={styles.toolbar}>
              <div>
                <Search
                  placeholder="搜索.."
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}/>
              </div>
              <div className={styles.btn}>
                <Badge count={1}>
                  <Icon type="message" style={{ fontSize: 18 }}/>
                </Badge>
              </div>
              <div className={classnames(styles.btn, styles.username)}>
                <Dropdown overlay={userDropdownMenus}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <Avatar shape="circle" icon="user" src={avatar}/> {nickname}
                  </a>
                </Dropdown>
              </div>
              <div className={styles.btn}>
                <Icon type="setting" style={{ fontSize: 18 }}/>
              </div>
            </div>
          </Header>
          <Content className={styles.content}>
            {/*路径*/}
            <Breadcrumb className={styles.breadcrumb}>
              {(openMenus || []).map(({ url, title, icon }) => (
                <Breadcrumb.Item href={url}>
                  {icon && <Icon type={`${icon}`}/>}
                  <span>{title}</span>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            {/*内容*/}
            {children}
          </Content>
          <Footer>Hi.</Footer>
        </Layout>
      </Layout>}
    </>);
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
   * @return {
   *   '/': {},
   *   '/index': {},
   *}
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

  /**
   * 点击菜单
   */
  onClickItem = ({ item, key, keyPath, domEvent }) => {
    let { menus } = this.props;
    let openMenus = MenuUtils.getItems(menus, keyPath.reverse());
    console.log('打开菜单路径', item, key, keyPath, openMenus);
    this.setState({
      openMenus,
    });
  };
}

export default BasicLayout;
