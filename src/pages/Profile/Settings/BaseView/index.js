import React from 'react';
import { Button, Form, Input } from 'antd';
import Avatar from './Avatar';
import styles from './index.less';
import { connect } from 'dva';

@connect(({ global, apps: { currentAccount, currentAccountAuthority = [] }, loading, ...rest }) => {
  let { nickname, avatar, email } = currentAccount;
  return {
    nickname: nickname,
    email: email,
    avatar: avatar,
  };
}, dispatch => ({
  $getCurrentAccountInfo: (args = {}) => dispatch({ type: 'account/getCurrentAccountInfo', ...args }),
}))
class index extends React.Component {
  basicForm = React.createRef();

  componentDidMount() {
    let { $getCurrentAccountInfo } = this.props;
    $getCurrentAccountInfo();
    // window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let { nickname, email, avatar } = this.props;
    return (
      <div className={styles.page}>
        <div>
          <Avatar size={70} icon="user" src={avatar}/>
        </div>
        <Form ref={this.basicForm} className={styles.form} layout="vertical"
              initialValues={{
                email: email,
                nickname: nickname,
              }}
              hideRequiredMark>
          <Form.Item label="E-mail"
                     rules={[{ type: 'email', message: '请输入邮箱号码' }]}
                     name="email">
            <Input/>
          </Form.Item>
          <Form.Item label="昵称"
                     rules={[{ type: 'nickname', message: '请输入昵称' }]}
                     name="nickname">
            <Input/>
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
