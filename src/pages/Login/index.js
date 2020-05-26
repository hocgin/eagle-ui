import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import classnames from 'classnames';
import LoginBox from '@/pages/Login/components/LoginBox';
import RegisterBox from '@/pages/Login/components/RegisterBox';
import ForgotBox from '@/pages/Login/components/ForgotBox';
import { Divider } from 'antd';
import { HeartFilled } from '@ant-design/icons';

export const Action = {
  LOGIN: 1,
  REGISTER: 2,
  FORGOT: 3,
};

@connect(({ global, loading }) => {
  return {};
}, dispatch => ({
  $login: (args = {}) => dispatch({ type: 'apps/login', ...args }),
}))
class index extends React.Component {
  form = React.createRef();
  state = {
    action: Action.LOGIN,
  };

  render() {
    let { action } = this.state;
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
            <div className={styles.logo}>EAGLE<span className={styles.space}>X</span><HeartFilled
              className={classnames(styles.heartbeat, styles.heart)}/></div>
            <span className={styles.title}>{this.getTitle()}</span>
          </div>
          <Divider/>
          {action === Action.LOGIN && <LoginBox onChange={this.onChange}/>}
          {action === Action.REGISTER && <RegisterBox onChange={this.onChange}/>}
          {action === Action.FORGOT && <ForgotBox onChange={this.onChange}/>}
        </div>
      </div>
    </div>);
  }

  getTitle = () => {
    let { action } = this.state;
    switch (action) {
      case Action.REGISTER:
        return '注册 EAGLE.';
      case Action.FORGOT:
        return '忘记密码';
      case Action.LOGIN:
      default:
        return '登录 EAGLE.';
    }
  };

  onChange = action => this.setState({ action });

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
