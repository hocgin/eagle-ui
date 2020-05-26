import React from 'react';
import styles from './index.less';
import { Button, Col, Form, Input, Row } from 'antd';
import { Action } from '@/pages/Login2';
import PropTypes from 'prop-types';

class index extends React.PureComponent {
  state = {};

  render() {
    let { onChange } = this.props;
    return (<div className={styles.page}>
      <Form>
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
          <Col span={7}><Button style={{ height: '100%', width: '100%' }}>发送验证码</Button></Col>
        </Row>
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
