import { Avatar, Badge, Breadcrumb, Dropdown, Icon, Input, Layout, Menu } from 'antd';
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { connect } from 'dva';

const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;

@connect(({ global, account: { currentAccount }, loading }) => {
  let { nickname, avatar } = currentAccount;
  return {
    nickname: nickname,
    avatar: avatar,
  };
}, dispatch => ({
  $getCurrentAccountInfo: (args = {}) => dispatch({ type: 'account/getCurrentAccountInfo', ...args }),
}))
class Index extends React.Component {

  state = {
    collapsed: false,
  };

  componentDidMount() {
    let { $getCurrentAccountInfo } = this.props;
    $getCurrentAccountInfo();
  }

  render() {
    let { collapsed } = this.state;
    let { children, nickname, avatar } = this.props;
    const userDropdownMenus = (<Menu>
      <Menu.Item>退出登录</Menu.Item>
    </Menu>);


    return (
      <Layout className={styles.component}>
        {/*左侧*/}
        <Sider className={styles.sider}
               trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logo}/>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user"/>
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera"/>
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload"/>
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        {/*右侧*/}
        <Layout>
          <Header className={styles.header}>
            <Icon className={styles.trigger}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
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
              <Breadcrumb.Item href="">
                <Icon type="home"/>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <Icon type="user"/>
                <span>Application List</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Application</Breadcrumb.Item>
            </Breadcrumb>
            {/*内容*/}
            {children}
          </Content>
          <Footer>Hi.</Footer>
        </Layout>
      </Layout>
    );
  }

  toggle = () => {
    this.setState(({ collapsed }) => {
      return ({
        collapsed: !collapsed,
      });
    });
  };
}

export default Index;
