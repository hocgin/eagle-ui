import React from 'react';
import styles from './index.less';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd';
import { connect } from 'dva';
import Utils from '@/utils/utils';

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $login: (args = {}) => dispatch({ type: 'account/login', ...args }),
}))
class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (<div className={styles.page}>
      <div>LOGO</div>
      <Form onSubmit={this.onSubmit} className={styles.loginForm}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入你的账号' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="账号"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住密码</Checkbox>)}
          <a className={styles.forgot} href="">
            忘记密码?
          </a>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            登录
          </Button>
          <a href="">注册账号</a>
        </Form.Item>
      </Form>
    </div>);
  }

  onSubmit = e => {
    e.preventDefault();
    let { $login, form } = this.props;
    form.validateFields((err, values) => {
      let { username, password } = values;
      if (err) {
        let text = Utils.getErrorMessage(err);
        message.error(text);
        return;
      }
      $login({
        payload: {
          username,
          password,
        },
      });

    });
  };
}

export default Form.create()(index);
