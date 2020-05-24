import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { Data } from '@/pages/Wx/WxConsts';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const { Option } = Select;

let defaultValue = {
  msgType: `text`,
};

@connect(({ global, loading, ...rest }) => {
  return {
    confirmLoading: loading.effects['wxMpMessage/sendMessageToUser'],
  };
}, dispatch => ({
  $sendMessageToUser: (args = {}) => dispatch({ type: 'wxMpMessage/sendMessageToUser', ...args }),
}))
class index extends PureComponent {
  createForm = React.createRef();

  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="发送消息"
             visible={visible}
             onCancel={onClose}
             maskClosable
             footer={this.renderFooter()}>
        <Form ref={this.createForm} initialValues={{ ...defaultValue }}>
          <Form.Item  {...formLayout} label="消息类型"
                      rules={[{ required: true, message: '请选择消息类型' }]}
                      name="msgType">
            <Select>
              {(Data.getMsgType() || []).map(({ key, value }) => <Option value={value}>{key}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate>
            {({ getFieldValue }) => {
              let msgType = getFieldValue('msgType');
              return (<>
                {msgType === `text`
                  ? <Form.Item {...formLayout} label="消息内容"
                               rules={[{ required: true, message: '请输入消息内容' }]}
                               name="content">
                    <Input style={{ width: '100%' }} placeholder="请输入消息内容"/>
                  </Form.Item>
                  : <Form.Item {...formLayout} label="Media Id"
                               rules={[{ required: true, message: '请输入Media Id' }]}
                               name="mediaId">
                    <Input style={{ width: '100%' }} placeholder="请输入Media Id"/>
                  </Form.Item>}
              </>);
            }}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
      <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
              onClick={this.onDone}>完成</Button>]);
  };

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const {
      onClose,
      toUsers,
      $sendMessageToUser,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $sendMessageToUser({
          payload: {
            toUsers,
            ...values,
          },
          callback: () => {
            message.success('发送成功');
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
    toUsers: PropTypes.arrayOf(PropTypes.number),
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };
}

export default index;
