import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { Action } from '@/pages/Login';
import PropTypes from 'prop-types';
import ValidUtils from '@/utils/ValidUtils';
import { connect } from 'dva';

const ForgotType = {
  UseSmsCode: 0,
  UseEmail: 1,
};

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $sendSmsCode: (args = {}) => dispatch({ type: 'apps/sendSmsCode', ...args }),
  $changePasswordUseSmsCode: (args = {}) => dispatch({ type: 'apps/changePasswordUseSmsCode', ...args }),
}))
class index extends React.PureComponent {
  form = React.createRef();

  state = {
    forgotType: ForgotType.UseSmsCode,
    step: 0,
    formValue: {},
  };

  render() {
    let { onChange } = this.props;
    let { forgotType } = this.state;
    return (<div className={styles.page}>
      <Form ref={this.form}>
        {forgotType === ForgotType.UseSmsCode && this.renderForgotBoxUseSmsCode()}
        {forgotType === ForgotType.UseEmail && this.renderForgotBoxUseEmail()}
        <div className={styles.toolbar}>
          <span>{forgotType === ForgotType.UseSmsCode
            ? <a onClick={this.onClickToggleForgotType.bind(this, ForgotType.UseEmail)}>通过注册邮箱找回</a>
            : <a onClick={this.onClickToggleForgotType.bind(this, ForgotType.UseSmsCode)}>通过注册手机号找回</a>}
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

  renderForgotBoxUseSmsCode = () => {
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
            <Col span={7}>
              <Button style={{ height: '100%', width: '100%' }} onClick={this.onClickSendSmsCode}>验证码</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit} onClick={this.onNextOrDone}>
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
        <Form.Item name="confirmPassword"
                   rules={[{ required: true, message: '请输入重置密码' }]}>
          <Input.Password style={{ width: '100%' }} size="large" placeholder="确认密码"/>
        </Form.Item>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit} onClick={this.onNextOrDone}>
            进入系统
          </Button>
        </Form.Item>
      </>;
    };

    return <>
      {[Step0, Step1][step]()}
    </>;
  };

  onClickSendSmsCode = () => {
    let { $sendSmsCode } = this.props;
    let { phone } = this.form.current.getFieldValue();
    ValidUtils.notNull(phone, '请输入手机号码');
    $sendSmsCode({ payload: { phone } });
  };

  onNextOrDone = () => {
    let { $changePasswordUseSmsCode } = this.props;
    let { step } = this.state;
    let form = this.form.current;
    form.validateFields()
      .then((values) => {
        const formValue = {
          ...this.state.formValue,
          ...values,
        };
        this.setState({ formValue }, () => {
          if (step + 1 < 2) {
            this.setState({
              step: step + 1,
            });
            return;
          }
          $changePasswordUseSmsCode({payload: { ...formValue }});
        });
      });
  };

  onFinish = ({ username, password, phone, smsCode }) => {
    let { $login } = this.props;
    let { forgotType } = this.state;
    if (forgotType === ForgotType.UseSmsCode) {

    } else if (forgotType === ForgotType.UseEmail) {

    }
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
