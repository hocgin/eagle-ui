import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, loading, ...rest }) => {
  return {
    confirmLoading: loading.effects['orderRefundApply/handle'],
  };
}, dispatch => ({
  $handleOne: (args = {}) => dispatch({ type: 'orderRefundApply/handle', ...args }),
}))
class HandleModal extends PureComponent {
  handleForm = React.createRef();

  state = {
    // 待提交的值
    formValue: {},
  };

  render() {
    const { visible, onClose, itemDetail } = this.props;

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="处理退费申请"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.handleForm}
              initialValues={{ ...itemDetail }}>
          <Form.Item {...formLayout} label="处理备注"
                     rules={[{ required: false, message: '请输入处理备注' }]}
                     name="handleRemark">
            <TextArea style={{ width: '100%' }}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      placeholder="请输入处理备注"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderFooter = () => {
    let { confirmLoading, type } = this.props;
    let handleBtn = {
      'pass': <Button key="pass" loading={confirmLoading} type="primary"
                      onClick={this.onDone.bind(this, 'pass')}>同意</Button>,
      'reject': <Button key="reject" loading={confirmLoading} type="primary" danger
                        onClick={this.onDone.bind(this, 'reject')}>拒绝</Button>,
    }[type];
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
      handleBtn]);
  };

  /**
   * 完成
   */
  onDone = (type, e) => {
    e.preventDefault();
    const {
      id,
      onClose,
      $handleOne,
    } = this.props;
    let form = this.handleForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $handleOne({
          payload: {
            ...values,
            isPass: 'pass' === type,
            id: id,
          },
          callback: () => {
            message.success('处理完成');
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
    // pass/reject
    type: PropTypes.string,
    onClose: PropTypes.func,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    detailLoading: true,
    type: 'pass',
  };
}

export default HandleModal;
