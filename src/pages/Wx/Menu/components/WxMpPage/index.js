import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Button, Card, Form, Input, Radio } from 'antd';
import { connect } from 'dva';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 13 },
};

@connect(({ global, dataDict: { allWxMenuType }, loading, ...rest }) => {
  return {
    allWxMenuType: allWxMenuType,
  };
}, dispatch => ({
  $getAllWxMenuType: (args = {}) => dispatch({ type: 'dataDict/getAllWxMenuType', ...args }),
}))
class Index extends React.PureComponent {
  createForm = React.createRef();
  ruleForm = React.createRef();
  state = {
    buttonIndex: null,
    subButtonIndex: null,
    activeLevel: null,
    button: [],
    menuType: 0,
  };

  componentDidMount() {
    let { $getAllWxMenuType } = this.props;
    $getAllWxMenuType();
  }


  render() {
    let { buttonIndex, subButtonIndex, button = [], activeLevel, menuType } = this.state;
    let buttons = button || [];
    let { confirmLoading, allWxMenuType } = this.props;

    return (<div className={styles.component}>
      <div className={styles.wxMpPage}>
        <div className={styles.wxMpNav}/>
        <div className={styles.wxMpFooter}>
          <ul className={classnames(styles.wxMpButton, styles.btnGroup1)}>
            {buttons.map(({ name, subButton }, index) => {
              let subButtons = subButton || [];
              return (<>
                <li className={classnames(styles.li1, {
                  [styles.btnActive]: index === buttonIndex,
                })}>
                  <a className={styles.li1Title} onClick={this.onClickButton.bind(this, index)}>{name}</a>
                  <div className={styles.btnGroup2}>
                    <ul>
                      {subButtons.map(({ name }, subIndex) => {
                        return (<li className={classnames(styles.li2, {
                          [styles.subBtnActive]: subIndex === subButtonIndex,
                        })} onClick={this.onClickSubButton.bind(this, subIndex)}>
                          <span className={styles.li2Title}>{name}</span>
                        </li>);
                      })}
                      {subButtons.length < 5 ?
                        (<li className={styles.li2} onClick={this.onClickAppendSubButton.bind(this, index)}><span
                          className={styles.li2Title}>+</span></li>)
                        : null}
                    </ul>
                  </div>
                </li>
              </>);
            })}
            {buttons.length < 3 ?
              (<li className={styles.li1} onClick={this.onClickAppendButton}><a className={styles.li1Title}>+</a></li>)
              : null}
          </ul>
        </div>
      </div>
      <div className={classnames(styles.wxMpMenuPanel, {})}>
        <Card title="基础信息" style={{ width: 700 }}>
          {/* 基础信息 */}
          <Form ref={this.ruleForm} initialValues={{
            menuType,
          }}>
            <Form.Item {...formLayout} label="菜单组名称"
                       rules={[{ required: true, message: '请输入菜单组名称' }]}
                       name="name">
              <Input style={{ width: '100%' }} placeholder="请输入菜单名称"/>
            </Form.Item>
            <Form.Item {...formLayout} label="菜单组类型"
                       rules={[{ required: true, message: '请选择菜单组类型' }]}
                       name="menuType">
              <Radio.Group value={formLayout} onChange={this.onChangeMenuType}>
                {(allWxMenuType).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
              </Radio.Group>
            </Form.Item>
            {menuType === 1 && <>
              <Form.Item {...formLayout} label="用户标签"
                         name="tagId">
                <Input style={{ width: '100%' }} placeholder="请输入用户标签"/>
              </Form.Item>
              <Form.Item {...formLayout} label="性别"
                         name="sex">
                <Input style={{ width: '100%' }} placeholder="请输入性别"/>
              </Form.Item>
              <Form.Item {...formLayout} label="国家"
                         name="country">
                <Input style={{ width: '100%' }} placeholder="请输入国家"/>
              </Form.Item>
              <Form.Item {...formLayout} label="省"
                         name="province">
                <Input style={{ width: '100%' }} placeholder="请输入省"/>
              </Form.Item>
              <Form.Item {...formLayout} label="平台类型"
                         name="clientPlatformType">
                <Input style={{ width: '100%' }} placeholder="请输入平台类型"/>
              </Form.Item>
              <Form.Item {...formLayout} label="语言"
                         name="language">
                <Input style={{ width: '100%' }} placeholder="请输入语言"/>
              </Form.Item>
            </>}
          </Form>

          {/* 选中菜单 */}
          <Card title="菜单名称" className={classnames({ [styles.wxMpMenuPanelHidden]: activeLevel === null })}
                extra={<a onClick={this.onClickDeleteMenu}>删除菜单</a>}>
            <Form ref={this.createForm} onValuesChange={this.onValuesChange}>
              <Form.Item {...formLayout} label="菜单名称"
                         rules={[{ required: true, message: '请输入菜单名称' }]}
                         name="name">
                <Input style={{ width: '100%' }} placeholder="请输入菜单名称"/>
              </Form.Item>
              <Form.Item {...formLayout} label="菜单内容"
                         rules={[{ required: true, message: '请选择菜单内容' }]}
                         name="type">
                <Radio.Group value={formLayout}>
                  <Radio.Button value="media_id">发送消息</Radio.Button>
                  <Radio.Button value="view">跳转网页</Radio.Button>
                  <Radio.Button value="miniprogram">跳转小程序</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {this.renderContentItem()}
              <Form.Item {...{ wrapperCol: { span: 5, push: 5 } }}>
                <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
                        onClick={this.onDone}>保存</Button>
              </Form.Item>
            </Form>
          </Card>
        </Card>
      </div>
    </div>);
  }

  onChangeMenuType = (e) => this.setState({ menuType: e.target.value });

  onDone = () => {
    let { button = [], matchRule } = this.state;
    let { onDone } = this.props;

    onDone({
      button: [...button],
      matchRule: matchRule,
    });

  };

  onValuesChange = (changedValues, allValues) => {
    this.setState(({ button, activeLevel, buttonIndex, subButtonIndex }) => {
      if (activeLevel === 1) {
        button[buttonIndex] = {
          ...button[buttonIndex],
          ...changedValues,
        };
      } else if (activeLevel === 2) {
        button[buttonIndex].subButton[subButtonIndex] = {
          ...button[buttonIndex].subButton[subButtonIndex],
          ...changedValues,
        };
      }
      return ({
        button: button,
      });
    }, this.forceUpdate);
  };

  renderContentItem = () => {
    let menuType = (this.getActiveButton() || {}).type;
    if ('media_id' === menuType) {
      return <>
        <Form.Item {...formLayout} label="MEDIA ID"
                   rules={[{ required: true, message: '请输入MEDIA ID' }]}
                   name="media_id">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    } else if ('view_limited' === menuType) {
      return <>
        <Form.Item {...formLayout} label="MEDIA ID"
                   rules={[{ required: true, message: '请输入MEDIA ID' }]}
                   name="media_id">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    } else if ('click' === menuType) {
      return <>
        <Form.Item {...formLayout} label="key"
                   rules={[{ required: true, message: '请输入key' }]}
                   name="key">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    } else if ('view' === menuType) {
      return <>
        <Form.Item {...formLayout} label="网页链接"
                   rules={[{ required: true, message: '请输入网页链接' }]}
                   name="url">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    } else if ('miniprogram' === menuType) {
      return <>
        <Form.Item {...formLayout} label="小程序的AppId"
                   rules={[{ required: true, message: '请输入小程序的AppId' }]}
                   name="appid">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
        <Form.Item {...formLayout} label="小程序的url"
                   rules={[{ required: true, message: '请输入小程序的url' }]}
                   name="url">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
        <Form.Item {...formLayout} label="小程序的页面路径"
                   rules={[{ required: true, message: '请输入小程序的页面路径' }]}
                   name="pagepath">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    }
  };

  onClickDeleteMenu = () => {
    this.setState(({ button, activeLevel, buttonIndex, subButtonIndex }) => {
      if (activeLevel === 1) {
        (button || []).splice(buttonIndex, 1);
      } else {
        (button[buttonIndex].subButton || []).splice(subButtonIndex, 1);
      }
      return ({
        subButtonIndex: null,
        buttonIndex: null,
        activeLevel: null,
        button: button,
      });
    }, this.forceUpdate);
  };

  onClickButton = (index, e) => {
    e.preventDefault();
    this.setState(({ buttonIndex, subButtonIndex }) => ({
      buttonIndex: index,
      activeLevel: 1,
      activeButton: this.getButton(index, -1),
    }));
  };

  onClickSubButton = (index, e) => {
    e.preventDefault();
    this.setState(({ buttonIndex, subButtonIndex }) => ({
      subButtonIndex: index,
      activeLevel: 2,
      activeButton: this.getButton(buttonIndex, index),
    }));
  };

  onClickAppendButton = () => {
    let { button } = this.state;
    this.setState({
      button: [...button, { name: '菜单名称', type: 'view' }],
    });
  };

  onClickAppendSubButton = (buttonIndex) => {
    this.setState(({ button }) => {
      let buttonItem = button[buttonIndex];
      button[buttonIndex].subButton = [...(buttonItem.subButton || []), { name: '子菜单名称', type: 'view' }];
      return {
        button: button,
      };
    }, this.forceUpdate);
  };

  getButton = (buttonIndex, subButtonIndex) => {
    let { button = [] } = this.state;
    let btn1Ele = button[buttonIndex];

    let ele;
    if (subButtonIndex === -1) {
      ele = btn1Ele || {};
    } else {
      let subButton = btn1Ele.subButton || [];
      ele = subButton[subButtonIndex] || {};
    }

    this.createForm.current.setFieldsValue({
      ...ele,
    });
  };

  getActiveButton = () => {
    let { buttonIndex, subButtonIndex, activeLevel, button } = this.state;
    if (activeLevel === 1) {
      return button[buttonIndex] || {};
    } else if (activeLevel === 2) {
      return button[buttonIndex].subButton[subButtonIndex] || {};
    }
  };

  static propTypes = {
    onDone: PropTypes.func,
    confirmLoading: PropTypes.bool,
  };

  static defaultProps = {
    onDone: () => {
    },
    confirmLoading: false,
  };
}

export default Index;
