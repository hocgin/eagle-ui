import React, { PureComponent } from 'react';
import { Button, Form, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/Utils';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, account: { detail }, role: { all }, loading, ...rest }) => {
  return {
    detail: detail,
    all: all,
    detailLoading: loading.effects['account/getOne'],
    confirmLoading: loading.effects['account/grantRole'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'account/getOne', ...args }),
  $getAll: (args = {}) => dispatch({ type: 'role/getAll', ...args }),
  $grantRole: (args = {}) => dispatch({ type: 'account/grantRole', ...args }),
}))
class GrantModal extends PureComponent {
  grantForm = React.createRef();

  componentDidMount() {
    let { $getDetail, $getAll, id } = this.props;
    $getDetail({ payload: { id } });
    $getAll();
  }

  render() {
    const { visible, onClose, detail, detailLoading, all } = this.props;
    if (detailLoading) {
      return null;
    }
    let ids = (detail.roles || []).map(({ id }) => id);
    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="账号角色"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form ref={this.grantForm}
            initialValues={{ roles: ids }}>
        <Form.Item {...formLayout} label="选择角色"
                   rules={[{ required: false, message: '请选择角色' }]}
                   name="roles">
          <Select mode="multiple"
                  placeholder="请选择角色"
                  style={{ width: '100%' }}>
            {(all || []).map(({ title, id }) => (<Select.Option value={id}>{title}</Select.Option>))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>);
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消</Button>,
      <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
              onClick={this.onDone}>完成</Button>]);
  };

  /**
   * 取消
   */
  onCancel = () => {
    let { onClose } = this.props;
    onClose();
  };

  /**
   * 完成
   */
  onDone = (e) => {
    const {
      id,
      onClose,
      $grantRole,
    } = this.props;
    let form = this.grantForm.current;
    form.validateFields()
      .then(({ ...values }) => {
        $grantRole({
          payload: {
            id,
            ...values,
          },
          callback: () => {
            message.success('授权完成');
            form.resetFields();
            onClose();
          },
        });
      })
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
  };

  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    authorityTree: [],
    detailLoading: true,
    onClose: () => {
    },
  };

}

export default GrantModal;
