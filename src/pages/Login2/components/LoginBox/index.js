import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import { Action } from '@/pages/Login2';

const LoginType = {
  UsePassword: 0,
  UseSmsCode: 1,
};

class index extends React.PureComponent {
  state = {
    loginType: LoginType.UsePassword,
  };

  render() {
    let { onChange } = this.props;
    let { loginType } = this.state;
    return (<div className={styles.page}>
      <Form onFinish={this.onFinish}>
        {loginType === LoginType.UsePassword && this.renderLoginUsePassword()}
        {loginType === LoginType.UseSmsCode && this.renderLoginUsePhone()}
        <div className={styles.primaryBar}>
          <div className={styles.social}>
            {/*<a href=""><WechatOutlined style={{ color: '#6AD278' }}/></a>*/}
            {/*<a href=""><QqOutlined style={{ color: '#3FC7FA' }}/></a>*/}
          </div>
          <a className={styles.forgot} onClick={onChange.bind(this, Action.FORGOT)}>忘记密码?</a>
        </div>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            登录
          </Button>
        </Form.Item>
        <div className={styles.toolbar}>
          <span>{loginType === LoginType.UsePassword
            ? <a onClick={this.onClickToggleLoginType.bind(this, LoginType.UseSmsCode)}>手机验证码登录</a>
            : <a onClick={this.onClickToggleLoginType.bind(this, LoginType.UsePassword)}>密码登录</a>}
          </span>
          <span><a onClick={onChange.bind(this, Action.REGISTER)}>注册账号</a></span>
        </div>
      </Form>
    </div>);
  }

  onClickToggleLoginType = (loginType) => {
    this.setState({
      loginType,
    });
  };

  renderLoginUsePhone = () => {
    return <>
      <Form.Item name="phone"
                 rules={[{ required: true, message: '请输入你的手机号' }]}>
        <Input style={{ width: '100%' }} size="large" placeholder="手机号"/>
      </Form.Item>
      <Form.Item noStyle>
        <Row gutter={8}>
          <Col span={17}>
            <Form.Item name="smsCode" rules={[{ required: true, message: '请输入验证码' }]} noStyle>
              <Input style={{ width: '100%' }} size="large" placeholder="验证码"/>
            </Form.Item>
          </Col>
          <Col span={7}><Button style={{height: '100%', width: '100%'}}>发送验证码</Button></Col>
        </Row>
      </Form.Item>
    </>;
  };

  renderLoginUsePassword = () => {
    return <>
      <Form.Item name="username"
                 rules={[{ required: true, message: '请输入你的账号' }]}>
        <Input style={{ width: '100%' }}
               size="large"
               placeholder="账号"/>
      </Form.Item>
      <Form.Item name="password"
                 rules={[{ required: true, message: '请输入你的密码' }]} noStyle>
        <Input.Password style={{ width: '100%' }}
                        type="password"
                        size="large"
                        placeholder="密码"/>
      </Form.Item>
    </>;
  };

  onFinish = (values) => {
    console.log('onFinish', values);
  };

  static propTypes = {
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: (action) => {
    },
  };
}

export default index;
