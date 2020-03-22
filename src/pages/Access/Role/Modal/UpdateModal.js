import React, { PureComponent } from 'react';
import { Button, Form, message, Modal, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/Utils';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, account: { detail }, loading, ...rest }) => {
  let detailLoading = loading.effects['account/getOne'];
  let nowDetail = detail;
  if (nowDetail) {
    nowDetail = {
      ...detail,
      enabled: detail.enabled === 1,
      locked: detail.locked === 1,
      expired: detail.expired === 1,
    };
  }

  return {
    detail: nowDetail,
    detailLoading,
    confirmLoading: loading.effects['account/updateStatus'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'account/getOne', ...args }),
  $updateStatus: (args = {}) => dispatch({ type: 'account/updateStatus', ...args }),
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
    let { id, $getDetail } = this.props;
    $getDetail({ payload: { id } });
  }

  render() {
    const { visible, onClose, detail, detailLoading } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="修改账户"
                   visible={visible}
                   onCancel={onClose}
                   footer={this.renderFooter()}
                   maskClosable>
      <Form ref={this.updateForm}
            initialValues={{ ...detail }}>
        <Form.Item {...formLayout} label="过期状态"
                   name="expired"
                   valuePropName={'checked'}>
          <Switch checkedChildren="开" unCheckedChildren="关"/>
        </Form.Item>
        <Form.Item {...formLayout} label="锁定状态"
                   name="locked"
                   valuePropName={'checked'}>
          <Switch checkedChildren="开" unCheckedChildren="关"/>
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
      $updateStatus,
    } = this.props;
    let form = this.updateForm.current;
    form.validateFields()
      .then(({ enabled, locked, expired, ...values }) => {
        $updateStatus({
          payload: {
            ...values,
            id: id,
            enabled: enabled ? 1 : 0,
            locked: locked ? 1 : 0,
            expired: expired ? 1 : 0,
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
