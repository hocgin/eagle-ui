import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import classnames from 'classnames';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { HeartFilled, LockOutlined, UserOutlined } from '@ant-design/icons';
import WechatOutlined from '@ant-design/icons/lib/icons/WechatOutlined';
import QqOutlined from '@ant-design/icons/lib/icons/QqOutlined';

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $login: (args = {}) => dispatch({ type: 'apps/login', ...args }),
}))
class index extends React.Component {
  loginForm = React.createRef();

  render() {
    return (<div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.mask}/>
        <div className={styles.desc}>
          <p>“美感是和听觉、视觉不可分离地结合在一起的，离开听觉、视觉，是不能设想的。当一个人因为厌倦的缘故而失去观赏美的东西的愿望的时候，欣赏那种美的要求也不能不消失。”</p>
          <span>—— 俄罗斯 · 车尔尼雪夫斯基</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.box}>
          <div className={styles.header}>
            <div className={styles.logo}>EAGLE<span className={styles.space}>X</span><HeartFilled className={classnames(styles.heartbeat, styles.heart)}/></div>
            <span className={styles.title}>登录 EAGLE.</span>
          </div>
          <Divider />
          <Form className={styles.form}>
            <Form.Item name="username"
                       rules={[{ required: true, message: '请输入你的账号' }]}>
              <Input style={{ width: '100%' }}
                     prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                     placeholder="账号"/>
            </Form.Item>
            <Form.Item name="password"
                       rules={[{ required: true, message: '请输入你的密码' }]} noStyle>
              <Input style={{ width: '100%' }}
                     type="password"
                     prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                     placeholder="密码"/>
            </Form.Item>
            <div className={styles.primaryBar}>
              <div className={styles.social}>
                <a href=""><WechatOutlined style={{color: '#6AD278'}}/></a>
                <a href=""><QqOutlined style={{color: '#3FC7FA'}}/></a>
              </div>
              <a className={styles.forgot} href="">忘记密码?</a>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submit}>
                登录
              </Button>
            </Form.Item>
            <div className={styles.toolbar}>
              <a href="">手机验证码登录</a>
              <a href="">注册账号</a>
            </div>
          </Form>

        </div>
      </div>
    </div>);
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
