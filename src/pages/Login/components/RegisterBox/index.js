import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, Row } from 'antd';
import { Action } from '@/pages/Login';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import ValidUtils from '@/utils/ValidUtils';

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $signUp: (args = {}) => dispatch({ type: 'apps/signUp', ...args }),
  $sendSmsCode: (args = {}) => dispatch({ type: 'apps/sendSmsCode', ...args }),
}))
class index extends React.PureComponent {
  form = React.createRef();

  state = {};

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
          <Col span={7}><Button style={{ height: '100%', width: '100%' }} onClick={this.onClickSendSmsCode}>验证码</Button></Col>
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
    $sendSmsCode({ payload: { phone } });
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
