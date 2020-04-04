import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, account: { complete }, loading, ...rest }) => {
  return {
    completeUser: complete,
    confirmLoading: loading.effects['notify/publishPrivateLetter'],
  };
}, dispatch => ({
  $getCompleteUser: (args = {}) => dispatch({ type: 'account/getComplete', ...args }),
  $publishPrivateLetter: (args = {}) => dispatch({ type: 'notify/publishPrivateLetter', ...args }),
}))
class SendModal extends PureComponent {
  publishForm = React.createRef();

  componentDidMount() {
    let { $getCompleteUser } = this.props;
    $getCompleteUser();
  }

  render() {
    const { visible, onClose, completeUser } = this.props;
    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="发送消息"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.publishForm}>
          <Form.Item {...formLayout} label="接收人"
                     rules={[{ required: false, message: '请输入编号或关键词搜索' }]}
                     name="receivers">
            <Select allowClear showSearch
                    mode="multiple"
                    labelInValue
                    filterOption={false}
                    onSearch={this.onSearchWithUser}
                    notFoundContent="暂无数据"
                    placeholder="请输入编号或关键词搜索">
              {(completeUser || []).map(({ id, avatar, nickname, username, phone }) => <Option
                value={id}>{nickname} - {username}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item {...formLayout} label="消息内容"
                     rules={[{ required: false, message: '请输入消息内容' }]}
                     name="content">
            <Input.TextArea style={{ width: '100%' }} placeholder="请输入消息内容"/>
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

  onSearchWithUser = (val) => {
    let { $getCompleteUser } = this.props;
    $getCompleteUser({ payload: { keyword: val } });
  };

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const {
      onClose,
      $publishPrivateLetter,
    } = this.props;
    let form = this.publishForm.current;
    form.validateFields()
      .then(({ receivers, ...values }) => {
        $publishPrivateLetter({
          payload: {
            receivers: (receivers || []).map(({ key }) => key),
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
