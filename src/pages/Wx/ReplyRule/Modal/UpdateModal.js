import React, { PureComponent } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let defaultValue = {};

@connect(({
            global, wxMpReplyRule: { detail }, wxMpConfig: { all },
            dataDict: { allWxMatchMsgType, allWxReplyMsgType }, loading, ...rest
          }) => {
  let detailLoading = loading.effects['wxMpReplyRule/getOne'];
  let nowDetail = detail;
  if (detail) {
    nowDetail = {
      ...detail,
      enabled: detail.enabled === 1,
    };
  }
  return {
    detail: nowDetail,
    detailLoading: detailLoading,
    allMpConfig: all,
    allWxMatchMsgType: allWxMatchMsgType,
    allWxReplyMsgType: allWxReplyMsgType,
    confirmLoading: loading.effects['wxMpReplyRule/update'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'wxMpReplyRule/getOne', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'wxMpReplyRule/update', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
  $getAllWxMatchMsgType: (args = {}) => dispatch({ type: 'dataDict/getAllWxMatchMsgType', ...args }),
  $getAllWxReplyMsgType: (args = {}) => dispatch({ type: 'dataDict/getAllWxReplyMsgType', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();

  state = {
    formVal: {
      ...defaultValue,
    },
  };

  componentDidMount() {
    let { $getOne, $getAllWxMatchMsgType, $getAllWxReplyMsgType, $getAllWithWxMpConfig, id } = this.props;
    $getAllWxMatchMsgType();
    $getAllWxReplyMsgType();
    $getAllWithWxMpConfig();
    $getOne({ payload: { id } });
  }

  render() {
    const { detailLoading, visible, onClose, detail, allWxMatchMsgType, allWxReplyMsgType, allMpConfig } = this.props;
    if (detailLoading) {
      return null;
    }
    let { formVal = {} } = this.state;

    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="修改回复规则"
                   visible={visible}
                   onCancel={onClose}
                   footer={this.renderFooter()}
                   maskClosable>
      <Form ref={this.createForm} initialValues={{ ...defaultValue, ...detail }}
            onValuesChange={this.onValuesChange}>
        <Form.Item {...formLayout} label="公众号"
                   rules={[{ required: true, message: '请输入公众号' }]}
                   name="appid">
          <Select onSelect={this.onSelectAppId}>
            {(allMpConfig || []).map(({ appid, title }, index) =>
              <Select.Option key={index} value={`${appid}`}>{title}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formLayout} label="规则名称"
                   rules={[{ required: true, message: '请输入规则名称' }]}
                   name="title">
          <Input style={{ width: '100%' }} placeholder="请输入规则名称"/>
        </Form.Item>
        {/*匹配方式*/}
        <Form.Item {...formLayout} label="匹配类型"
                   rules={[{ required: true, message: '请选择匹配类型' }]}
                   name="matchMsgType">
          <Radio.Group>
            {(allWxMatchMsgType || []).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            let matchMsgType = getFieldValue('matchMsgType');
            return <>
              {matchMsgType === 0 && <>
                <Form.Item {...formLayout} label="匹配类型"
                           rules={[{ required: true, message: '请选择匹配类型' }]}
                           name={['matchRule', 'matchType']}>
                  <Radio.Group>
                    <Radio.Button value={0}>部分匹配</Radio.Button>
                    <Radio.Button value={1}>完全匹配</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    let matchType = getFieldValue(['matchRule', 'matchType']);
                    return (<>
                      {matchType === 0 && <>
                        <Form.Item {...formLayout} label="包含文字"
                                   rules={[{ required: true, message: '请输入文字' }]}
                                   name={['matchRule', 'rContent']}>
                          <Input style={{ width: '100%' }} placeholder="请输入文字"/>
                        </Form.Item>
                      </>}
                      {matchType === 1 && <>
                        <Form.Item {...formLayout} label="完全匹配"
                                   rules={[{ required: true, message: '请输入文字' }]}
                                   name={['matchRule', 'content']}>
                          <Input style={{ width: '100%' }} placeholder="请输入文字"/>
                        </Form.Item>
                      </>}
                    </>);
                  }}
                </Form.Item>
              </>}
              {matchMsgType === 1 && <>
                <Form.Item {...formLayout} label="事件类型"
                           name={['matchRule', 'event']}>
                  <Input style={{ width: '100%' }} placeholder="请输入事件类型"/>
                </Form.Item>
                <Form.Item {...formLayout} label="事件Key"
                           name={['matchRule', 'eventKey']}>
                  <Input style={{ width: '100%' }} placeholder="请输入事件Key"/>
                </Form.Item>
              </>}
            </>;
          }}
        </Form.Item>

        {/*回复方式*/}
        <Form.Item {...formLayout} label="回复类型"
                   rules={[{ required: true, message: '请选择回复类型' }]}
                   name="replyMsgType">
          <Radio.Group>
            {(allWxReplyMsgType || []).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            let replyMsgType = getFieldValue('replyMsgType');
            return (<>
              {replyMsgType === 0 && <>
                <Form.Item {...formLayout} label="回复内容"
                           rules={[{ required: true, message: '请输入回复内容' }]}
                           name={['replyContent', 'content']}>
                  <Input style={{ width: '100%' }} placeholder="请输入回复内容"/>
                </Form.Item>
              </>}
            </>);
          }}
        </Form.Item>

        <Form.Item {...formLayout} label="优先级" name="sort">
          <InputNumber placeholder="默认: 1000"/>
        </Form.Item>
        <Form.Item {...formLayout} label="启用状态"
                   name="enabled"
                   valuePropName={'checked'}>
          <Switch checkedChildren="开" unCheckedChildren="关"/>
        </Form.Item>
      </Form>
    </Modal>);
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" loading={confirmLoading} htmlType="button" onClick={this.onCancel}>取消 </Button>,
      <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
              onClick={this.onDone}>完成</Button>]);
  };

  onValuesChange = (changedValues, allValues) => {
    this.setState(({ formVal }) => {
      return {
        formVal: {
          ...formVal,
          ...changedValues,
        },
      };
    });
  };

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const { onClose, $updateOne, id } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $updateOne({
          payload: {
            ...values,
            id,
            enabled: enabled ? 1 : 0,
          },
          callback: () => {
            message.success('更新成功');
            form.resetFields();
            onClose();
          },
        });
      })
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
  };

  /**
   * 取消
   */
  onCancel = () => {
    let { onClose } = this.props;
    onClose();
  };

  static propTypes = {
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    detailLoading: true,
  };
}

export default CreateModal;
