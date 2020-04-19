import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, authority: { authorityTree }, role: { detail }, dataDict: { allPlatform, allEnabled }, loading, ...rest }) => {
  let detailLoading = loading.effects['role/getOne'];
  let roleDetail = detail;
  if (detail) {
    roleDetail = {
      ...detail,
      enabled: detail.enabled === 1,
    };
  }

  return {
    roleDetail: roleDetail,
    allPlatform: allPlatform,
    detailLoading,
    confirmLoading: loading.effects['role/insert'],
  };
}, dispatch => ({
  $getRole: (args = {}) => dispatch({ type: 'role/getOne', ...args }),
  $updateRole: (args = {}) => dispatch({ type: 'role/update', ...args }),
  $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
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
    let { id, $getRole, $getAllPlatform } = this.props;
    $getRole({ payload: { id } });
    $getAllPlatform();
  }

  render() {
    const { visible, onClose, roleDetail, detailLoading, allPlatform } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="修改角色"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.updateForm}
              initialValues={{ ...roleDetail }}>
          <Form.Item {...formLayout} label="平台"
                     rules={[{ required: true, message: '请选择平台' }]}
                     name="platform">
            <Select style={{ width: '100%' }}>
              {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item {...formLayout} label="角色名称"
                     rules={[{ required: true, message: '请输入角色名称' }]}
                     name="title">
            <Input style={{ width: '100%' }} placeholder="请输入角色名称"/>
          </Form.Item>
          <Form.Item {...formLayout} label="角色码"
                     rules={[{ required: true, message: '请输入角色码' }]}
                     name="roleCode"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="角色描述"
                     rules={[{ required: false, message: '请输入角色描述' }]}
                     name="remark"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="启用状态"
                     name="enabled"
                     valuePropName={'checked'}
                     hasFeedback>
            <Switch checkedChildren="开" unCheckedChildren="关"/>
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
      $updateRole,
    } = this.props;
    let form = this.updateForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $updateRole({
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
