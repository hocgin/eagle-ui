import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let defaultValue = {
  enabled: true,
};

@connect(({ global, shortUrl: { complete }, loading, ...rest }) => {
  return {
    confirmLoading: loading.effects['shortUrl/insert'],
  };
}, dispatch => ({
  $insertOne: (args = {}) => dispatch({ type: 'shortUrl/insert', ...args }),
}))
class SendModal extends PureComponent {
  createForm = React.createRef();

  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="新增短链"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.createForm} initialValues={{ ...defaultValue }}>
          <Form.Item {...formLayout} label="原链接"
                     rules={[{ required: true, type: 'url', message: '请输入链接' }]}
                     name="originalUrl">
            <Input style={{ width: '100%' }} placeholder="请输入链接"/>
          </Form.Item>
          <Form.Item {...formLayout} label="开启状态"
                     name="enabled"
                     valuePropName={'checked'}>
            <Switch checkedChildren="开启" unCheckedChildren="禁用"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" loading={confirmLoading} htmlType="button" onClick={this.onCancel}>取消 </Button>,
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
      $insertOne,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $insertOne({
          payload: {
            enabled: enabled ? 1 : 0,
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
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    detailLoading: true,
  };
}

export default SendModal;
