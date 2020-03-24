import React, { PureComponent } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, order: { detail }, loading, ...rest }) => {
  let detailLoading = loading.effects['order/getOne'];
  let itemDetail = detail;
  if (detail) {
    itemDetail = {
      ...detail,
    };
  }

  return {
    itemDetail: itemDetail,
    detailLoading,
    confirmLoading: loading.effects['order/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'order/getOne', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'order/update', ...args }),
}))
class UpdateModal extends PureComponent {
  updateForm = React.createRef();

  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formValue: {},
  };

  componentDidMount() {
    let { id, $getOne } = this.props;
    $getOne({ payload: { id } });
  }

  render() {
    const { visible, onClose, itemDetail, detailLoading } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="调整订单信息"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.updateForm}
              initialValues={{ ...itemDetail }}>
          <Form.Item {...formLayout} label="收货人姓名"
                     rules={[{ required: false, message: '请输入收货人姓名' }]}
                     name="receiverName">
            <Input style={{ width: '100%' }} placeholder="请输入角色名称"/>
          </Form.Item>
          <Form.Item {...formLayout} label="收货人电话"
                     rules={[{ required: false, message: '请输入收货人电话' }]}
                     name="receiverPhone"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="收货人邮编"
                     rules={[{ required: false, message: '请输入收货人邮编' }]}
                     name="receiverPostCode"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="省份/直辖市"
                     rules={[{ required: false, message: '请输入省份/直辖市' }]}
                     name="receiverProvince"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="城市"
                     rules={[{ required: false, message: '请输入城市' }]}
                     name="receiverCity"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="区"
                     rules={[{ required: false, message: '请输入区' }]}
                     name="receiverRegion"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="详细地址"
                     rules={[{ required: false, message: '请输入详细地址' }]}
                     name="receiverDetailAddress"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="管理员优惠金额"
                     rules={[{ required: false, message: '管理员优惠金额' }]}
                     name="discountAmount"
                     hasFeedback>
            <InputNumber min={0} style={{ width: '100%' }}/>
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
      id,
      onClose,
      $updateOne,
    } = this.props;
    let form = this.updateForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $updateOne({
          payload: {
            ...values,
            id: id,
          },
          callback: () => {
            message.success('修改成功');
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
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    detailLoading: true,
  };
}

export default UpdateModal;
