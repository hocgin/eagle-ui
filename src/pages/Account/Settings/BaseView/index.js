import React from 'react';
import {  Button, Form, Input } from 'antd';
import Avatar from './Avatar';
import styles from './index.less';
import { connect } from 'dva';

@connect(({ global, account: { currentAccount, currentAccountAuthority = [] }, loading, ...rest }) => {
  let { nickname, avatar, email } = currentAccount;
  return {
    nickname: nickname,
    email: email,
    avatar: avatar,
    menus: currentAccountAuthority,
  };
}, dispatch => ({}))
@Form.create()
class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let { nickname, email, avatar, form: { getFieldDecorator } } = this.props;
    console.log('nickname', nickname);
    return (
      <div className={styles.page}>
        <div>
          <Avatar size={70} icon="user" src={avatar}/>
        </div>
        <Form className={styles.form} layout="vertical" hideRequiredMark>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              initialValue: email,
              rules: [
                {
                  type: 'email',
                  message: '请输入邮箱号码',
                },
              ],
            })(<Input/>)}
          </Form.Item>
          <Form.Item label="昵称">
            {getFieldDecorator('nickname', {
              initialValue: nickname,
              rules: [
                {
                  type: 'nickname',
                  message: '请输入昵称',
                },
              ],
            })(<Input/>)}
          </Form.Item>
          <Button type="primary" onClick={this.onSubmit}>
            更新个人信息
          </Button>
        </Form>
      </div>
    );
  }
}

export default index;
