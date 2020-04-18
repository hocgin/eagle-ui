import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, settings: { detail }, loading, ...rest }) => {
  let detailLoading = loading.effects['settings/getOne'];
  let nowDetail = detail;
  if (detail) {
    nowDetail = {
      ...detail,
    };
  }

  return {
    detail: nowDetail,
    detailLoading,
    confirmLoading: loading.effects['settings/update'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'settings/getOne', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'settings/update', ...args }),
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
    const { visible, onClose, detail, detailLoading } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="修改系统配置"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.updateForm}
              initialValues={{ ...detail }}>
          <Form.Item {...formLayout} label="配置名称"
                     rules={[{ required: true, message: '请输入配置名称' }]}
                     name="title">
            <Input style={{ width: '100%' }} placeholder="请输入配置名称"/>
          </Form.Item>
          <Form.Item {...formLayout} label="配置备注"
                     rules={[{ required: true, message: '请输入配置备注' }]}
                     name="remark">
            <Input style={{ width: '100%' }} placeholder="请输入配置备注"/>
          </Form.Item>
          <Form.Item {...formLayout} label="配置码"
                     rules={[{ required: true, message: '请输入配置码' }]}
                     name="configCode">
            <Input style={{ width: '100%' }} placeholder="请输入配置码"/>
          </Form.Item>
          <Form.Item {...formLayout} label="配置值"
                     rules={[{ required: true, message: '请输入配置值' }]}
                     name="value">
            <Input style={{ width: '100%' }} placeholder="请输入配置值"/>
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
            enabled: enabled ? 1 : 0,
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
