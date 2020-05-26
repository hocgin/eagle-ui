import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, Row } from 'antd';
import { Action } from '@/pages/Login2';
import PropTypes from 'prop-types';

const ForgotType = {
  UsePhone: 0,
  UseEmail: 1,
};

class index extends React.PureComponent {
  state = {
    forgotType: ForgotType.UsePhone,
    step: 0,
  };

  render() {
    let { onChange } = this.props;
    let { forgotType } = this.state;
    return (<div className={styles.page}>
      <Form>
        {forgotType === ForgotType.UsePhone && this.renderForgotBoxUsePhone()}
        {forgotType === ForgotType.UseEmail && this.renderForgotBoxUseEmail()}
        <div className={styles.toolbar}>
          <span>{forgotType === ForgotType.UsePhone
            ? <a onClick={this.onClickToggleForgotType.bind(this, ForgotType.UseEmail)}>通过注册邮箱找回</a>
            : <a onClick={this.onClickToggleForgotType.bind(this, ForgotType.UsePhone)}>通过注册手机号找回</a>}
          </span>
          <span><a onClick={onChange.bind(this, Action.LOGIN)}>密码登录</a></span>
        </div>
      </Form>
    </div>);
  }

  onClickToggleForgotType = (forgotType) => {
    this.setState({
      forgotType,
    });
  };

  renderForgotBoxUsePhone = () => {
    let { step } = this.state;
    const Step0 = () => {
      return <>
        <Form.Item name="phone"
                   rules={[{ required: true, message: '请输入你的手机号' }]}>
          <Input style={{ width: '100%' }} size="large" placeholder="手机号"/>
        </Form.Item>
        <Form.Item>
          <Row gutter={8}>
            <Col span={17}>
              <Form.Item name="smsCode" rules={[{ required: true, message: '请输入验证码' }]} noStyle>
                <Input style={{ width: '100%' }} size="large" placeholder="验证码"/>
              </Form.Item>
            </Col>
            <Col span={7}><Button style={{ height: '100%', width: '100%' }}>发送验证码</Button></Col>
          </Row>
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            下一步
          </Button>
        </Form.Item>
      </>;
    };
    const Step1 = () => {
      return <>
        <Form.Item name="password"
                   rules={[{ required: true, message: '请输入重置密码' }]}>
          <Input.Password style={{ width: '100%' }} size="large" placeholder="设置8位以上数字、字母组合的密码"/>
        </Form.Item>
        <Form.Item name="confirm"
                   rules={[{ required: true, message: '请输入重置密码' }]}>
          <Input.Password style={{ width: '100%' }} size="large" placeholder="确认密码"/>
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            进入系统
          </Button>
        </Form.Item>
      </>;
    };

    return <>
      {[Step0, Step1][step]()}
    </>;
  };

  renderForgotBoxUseEmail = () => {
    return <>
      <Form.Item name="email"
                 rules={[{ required: true, message: '请输入邮箱' }]}>
        <Input style={{ width: '100%' }} size="large" placeholder="邮箱"/>
      </Form.Item>
      <Form.Item noStyle>
        <Button type="primary" htmlType="submit" className={styles.submit}>
          发送验证邮件
        </Button>
      </Form.Item>
    </>;
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
