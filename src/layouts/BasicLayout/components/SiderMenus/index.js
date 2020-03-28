import React from 'react';
import styles from './index.less';
import Link from 'umi/link';
import classnames from 'classnames';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Menu } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Utils from '@/utils/Utils';

const { SubMenu } = Menu;

/**
 * 图片或ICON作为图标
 * @param icon
 * @return {*}
 */
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon}/>;
  }
  if (typeof icon === 'string') {
    return <LegacyIcon type={icon}/>;
  }
  return icon;
};

/**
 * 以数组形式提取树的路径
 * @param menus
 * @return {[]}
 */
const getFlatMenuKeys = (menus) => {
  let keys = [];
  (menus || []).forEach(item => {
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
    keys.push(item.path);
  });
  return keys;
};

/**
 * 路径匹配
 * @param flatMenuKeys
 * @param path
 * @return {*}
 */
const getMenuMatches = (flatMenuKeys, path) => flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));


/**
 * 获得该路径的上阶菜单
 * @param pathname
 * @param data
 * @return {['key', 'key']}
 */
export const getDefaultCollapsedSubMenus = (pathname, data = []) => {
  let targetLink = [];
  const getLinks = (link, data) => {
    (data || []).forEach(item => {
      let newLink = [...link, {
        ...item,
        hasChildren: (item.children.length > 0),
      }];
      if (pathToRegexp(item.path).test(pathname)) {
        targetLink = newLink;
        return;
      }
      if (item.children) {
        getLinks(newLink, item.children);
      }
    });
  };

  getLinks([], data);

  return (targetLink || []);
};

class SiderMenus extends React.PureComponent {
  state = {
    openKeys: [],
  };

  constructor(props) {
    super(props);
    // 以数组形式提取树的路径
    let { data } = props;
    this.flatMenuKeys = getFlatMenuKeys(data);
    let { location: { pathname } } = props;
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(pathname, data).map(item => item.path).filter(item => item),
    };
  }

  /**
   * 根据路径获取当前菜单的key
   * @param pathname
   * @return {any[]}
   */
  getSelectedMenuKeys = pathname =>
    Utils.urlToList(pathname).map(item => getMenuMatches(this.flatMenuKeys, item).pop());

  render() {
    let {
      data = [],
      className,
      onClick,
      location: { pathname },
    } = this.props;
    let { openKeys } = this.state;
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (<Menu className={classnames(styles.component, className)}
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  onClick={onClick}
                  onOpenChange={this.onOpenChange}
                  theme="dark" mode="inline">
      {this.renderMenus(data)}
    </Menu>);
  }

  /**
   * 菜单展开
   * @param openKeys
   */
  onOpenChange = (openKeys) => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  /**
   * 菜单是否为主菜单
   * @param key
   * @return {*}
   */
  isMainMenu = key => {
    const { data } = this.props;
    return data.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  /**
   * @link {../../../menus.js}
   * @param items
   * @return {*}
   */
  renderMenus = (items = []) => {
    return (items || []).map((item) => {
      const { code, hideChildrenInMenu = false, icon, title, children = [], path } = item;
      const isMenuGroup = children.length > 0;
      if (!hideChildrenInMenu && isMenuGroup) {
        return (<SubMenu key={`${path}`} title={<span>{getIcon(icon)}<span>{title}</span></span>}>
          {this.renderMenus(children)}
        </SubMenu>);
      } else {
        return (<Menu.Item key={`${path}`}>
          {this.getMenuItemPath(item)}
        </Menu.Item>);
      }
    });
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * @param item
   * @return {*}
   */
  getMenuItemPath = (item) => {
    let { icon, path, title } = item;
    const iconEl = getIcon(icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(path)) {
      return (
        <a href={path} target={target}>
          {iconEl}
          <span>{title}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link
        to={path}
        target={target}
        replace={path === location.pathname}>
        {iconEl}
        <span>{title}</span>
      </Link>
    );
  };
}

export default SiderMenus;
