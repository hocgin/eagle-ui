import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Button, Card, Form, Input, Radio, Select, Switch } from 'antd';
import { connect } from 'dva';

let { Option } = Select;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 13 },
};

@connect(({ global, dataDict: { allWxMenuType }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    allWxMenuType: allWxMenuType,
    allMpConfig: all,
  };
}, dispatch => ({
  $getAllWxMenuType: (args = {}) => dispatch({ type: 'dataDict/getAllWxMenuType', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
}))
class Index extends React.Component {
  createForm = React.createRef();
  ruleForm = React.createRef();

  state = {
    buttonIndex: null,
    subButtonIndex: null,
    activeLevel: null,
    button: [],
    base: {},
  };

  componentDidMount() {
    let { $getAllWxMenuType, $getAllWithWxMpConfig } = this.props;
    $getAllWxMenuType();
    $getAllWithWxMpConfig();
  }

  constructor(props) {
    super(props);
    this.state = {
      base: props.base,
      button: props.button,
    };
  }

  render() {
    let { buttonIndex, subButtonIndex, button = [], base = {}, activeLevel } = this.state;
    let buttons = button || [];
    let fbase = base || {};
    let { confirmLoading, allWxMenuType, allMpConfig } = this.props;

    return (<div className={styles.component}>
      <div className={styles.wxMpPage}>
        <div className={styles.wxMpNav}/>
        <div className={styles.wxMpFooter}>
          <ul className={classnames(styles.wxMpButton, styles.btnGroup1)}>
            {buttons.map(({ name, subButtons }, index) => {
              subButtons = subButtons || [];
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
          <Form ref={this.ruleForm} onValuesChange={this.onValuesChangeWithBase}
                initialValues={{ ...fbase }}>
            <Form.Item {...formLayout} label="APP ID"
                       rules={[{ required: true, message: '请选择APP ID' }]}
                       name="appid">
              <Select>
                {(allMpConfig).map(({ title: key, appid: value }) => <Option value={`${value}`}>{key}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item {...formLayout} label="菜单组名称"
                       rules={[{ required: true, message: '请输入菜单组名称' }]}
                       name="title">
              <Input style={{ width: '100%' }} placeholder="请输入菜单名称"/>
            </Form.Item>
            <Form.Item {...formLayout} label="启用状态"
                       valuePropName="checked"
                       name="enabled">
              <Switch checkedChildren="开" unCheckedChildren="关"/>
            </Form.Item>
            <Form.Item {...formLayout} label="菜单组类型"
                       rules={[{ required: true, message: '请选择菜单组类型' }]}
                       name="menuType">
              <Radio.Group value={formLayout} onChange={this.onChangeMenuType}>
                {(allWxMenuType).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
              </Radio.Group>
            </Form.Item>
            {fbase.menuType === 1 && <>
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
          <Card title="菜单名称" className={classnames({ [styles.wxMpMenuPanelHidden]: !activeLevel })}
                extra={<a onClick={this.onClickDeleteMenu}>删除菜单</a>}>
            <Form ref={this.createForm} onValuesChange={this.onValuesChangeWithButton}>
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

  onValuesChangeWithBase = (changedValues, allValues) => {
    this.setState(({ base }) => {
      return {
        base: {
          ...base,
          ...changedValues,
        },
      };
    });
  };

  onChangeMenuType = (e) => this.setState({ menuType: e.target.value });

  onDone = () => {
    let { id, appid, button = [], base = {} } = this.state;
    let { onDone } = this.props;

    this.ruleForm.current.validateFields()
      .then(baseValues => {
        this.createForm.current.validateFields()
          .then(menuValues => {
            onDone({
              id,
              appid: appid,
              button: [...button],
              enabled: base.enabled,
              menuType: base.menuType,
              title: base.title,
              matchRule: {
                tagId: base.tagId,
                sex: base.sex,
                country: base.country,
                province: base.province,
                clientPlatformType: base.clientPlatformType,
                language: base.language,
              },
            });
          });
      });

  };

  onValuesChangeWithButton = (changedValues, allValues) => {
    this.setState(({ button, activeLevel, buttonIndex, subButtonIndex }) => {
      if (activeLevel === 1) {
        button[buttonIndex] = {
          ...button[buttonIndex],
          ...changedValues,
        };
      } else if (activeLevel === 2) {
        button[buttonIndex].subButtons[subButtonIndex] = {
          ...button[buttonIndex].subButtons[subButtonIndex],
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
                   name="mediaId">
          <Input style={{ width: '100%' }}/>
        </Form.Item>
      </>;
    } else if ('view_limited' === menuType) {
      return <>
        <Form.Item {...formLayout} label="MEDIA ID"
                   rules={[{ required: true, message: '请输入MEDIA ID' }]}
                   name="mediaId">
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
        (button[buttonIndex].subButtons || []).splice(subButtonIndex, 1);
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
      activeButton: this.updateButton(index, -1),
    }));
  };

  onClickSubButton = (index, e) => {
    e.preventDefault();
    this.setState(({ buttonIndex, subButtonIndex }) => ({
      subButtonIndex: index,
      activeLevel: 2,
      activeButton: this.updateButton(buttonIndex, index),
    }));
  };

  defaultMenu = {
    type: 'view',
    mediaId: null,
    pagepath: null,
    subButtons: [],
    url: null,
    key: null,
  };

  onClickAppendButton = () => {
    let { button } = this.state;
    this.setState({
      button: [...button, { name: '菜单名称', ...this.defaultMenu }],
    });
  };

  onClickAppendSubButton = (buttonIndex) => {
    this.setState(({ button }) => {
      let buttonItem = button[buttonIndex];
      button[buttonIndex].subButtons = [...(buttonItem.subButtons || []), { name: '子菜单名称', ...this.defaultMenu }];
      return {
        button: button,
      };
    }, this.forceUpdate);
  };

  updateButton = (buttonIndex, subButtonIndex) => {
    let { button = [] } = this.state;
    let btn1Ele = button[buttonIndex];

    let ele;
    if (subButtonIndex === -1) {
      ele = btn1Ele || {};
    } else {
      let subButtons = btn1Ele.subButtons || [];
      ele = subButtons[subButtonIndex] || {};
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
      return button[buttonIndex].subButtons[subButtonIndex] || {};
    }
  };

  static propTypes = {
    onDone: PropTypes.func,
    base: PropTypes.object,
    button: PropTypes.arrayOf(PropTypes.object),
    confirmLoading: PropTypes.bool,
    id: PropTypes.number,
  };

  static defaultProps = {
    onDone: () => {
    },
    confirmLoading: false,
    button: [],
    base: {},
  };
}

export default Index;
