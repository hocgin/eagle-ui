import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { Action } from '@/pages/Login';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import ValidUtils from '@/utils/ValidUtils';
import { Global } from '@/utils/constant/global';

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $signUp: (args = {}) => dispatch({ type: 'apps/signUp', ...args }),
  $sendSmsCode: (args = {}) => dispatch({ type: 'apps/sendSmsCode', ...args }),
}))
class index extends React.PureComponent {
  form = React.createRef();

  state = {
    time: null,
  };

  render() {
    let { onChange } = this.props;
    return (<div className={styles.page}>
      <Form ref={this.form} onFinish={this.onFinish}>
        {this.renderRegisterUsePhone()}
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" className={styles.submit}>
            注册账号
          </Button>
        </Form.Item>
        <div className={styles.toolbar}>
          <span><></></span>
          <span><a onClick={onChange.bind(this, Action.LOGIN)}>登录</a></span>
        </div>
      </Form>
    </div>);
  }

  renderRegisterUsePhone = () => {
    let { time } = this.state;
    return <>
      <Form.Item name="phone" rules={[{ required: true, message: '请输入你的手机号' }]}>
        <Input style={{ width: '100%' }} size="large" placeholder="手机号"/>
      </Form.Item>
      <Form.Item>
        <Row gutter={8}>
          <Col span={17}>
            <Form.Item name="smsCode" rules={[{ required: true, message: '请输入验证码' }]} noStyle>
              <Input style={{ width: '100%' }} size="large" placeholder="验证码"/>
            </Form.Item>
          </Col>
          <Col span={7}><Button style={{ height: '100%', width: '100%' }}
                                onClick={this.onClickSendSmsCode}>{time ? `${time}秒` : '验证码'}</Button></Col>
        </Row>
      </Form.Item>
    </>;
  };

  onFinish = ({ phone, smsCode }) => {
    let { $signUp } = this.props;
    $signUp({ payload: { phone, smsCode } });
  };

  onClickSendSmsCode = () => {
    let { $sendSmsCode } = this.props;
    let { phone } = this.form.current.getFieldValue();
    ValidUtils.notNull(phone, '请输入手机号码');
    if (this.state.time != null) {
      return;
    }
    $sendSmsCode({
      payload: { phone }, callback: () => {
        message.success('发送成功');
        this.startTimer();
      },
    });
  };

  startTimer = (maxSeconds = Global.MAX_SMS_CODE_SECONDS) => {
    // 检查时间
    let checkTime = () => {
      if (this.state.time <= 0) {
        clearInterval(this.timer);
        this.setState({ time: null });
      } else {
        this.forceUpdate();
      }
    };

    // 启动
    let startInterval = () => {
      this.timer = setInterval(() => {
        this.setState({ time: --this.state.time }, checkTime);
      }, 1000);
    };

    if (this.state.time == null) {
      clearInterval(this.timer);
      this.setState({ time: maxSeconds }, startInterval);
    }
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
