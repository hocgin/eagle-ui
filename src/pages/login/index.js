import React from 'react';
import styles from './index.less';
import { UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { connect } from 'dva';

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $login: (args = {}) => dispatch({ type: 'apps/login', ...args }),
}))
class index extends React.Component {
  loginForm = React.createRef();

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    // window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <div className={styles.page}>
        <div>LOGO</div>
        <Form onFinish={this.onSubmit} ref={this.loginForm} className={styles.loginForm}>
          <Form.Item name="username"
                     rules={[{ required: true, message: '请输入你的账号' }]}>
            <Input style={{ width: '100%' }}
                   prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                   placeholder="账号"/>
          </Form.Item>
          <Form.Item name="password"
                     rules={[{ required: true, message: '请输入你的密码' }]}>
            <Input style={{ width: '100%' }}
                   prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                   placeholder="密码"/>
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <a className={styles.forgot} href="">
              忘记密码?
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submit}>
              登录
            </Button>
            <a href="">注册账号</a>
          </Form.Item>
        </Form>
      </div>
    );
  }

  onSubmit = values => {
    let { $login } = this.props;
    $login({
      payload: {
        ...values,
      },
    });
  };
}

export default index;
