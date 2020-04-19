import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Radio } from 'antd';
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

@connect(({ global, accountGroup: { complete }, dataDict: { allGroupMemberSource, allAccountGroupType }, loading, ...rest }) => {
  return {
    allGroupMemberSource,
    allAccountGroupType,
    confirmLoading: loading.effects['accountGroup/insert'],
  };
}, dispatch => ({
  $insertOne: (args = {}) => dispatch({ type: 'accountGroup/insert', ...args }),
  $getAllGroupMemberSource: (args = {}) => dispatch({ type: 'dataDict/getAllGroupMemberSource', ...args }),
  $getAllAccountGroupType: (args = {}) => dispatch({ type: 'dataDict/getAllAccountGroupType', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();
  state = {
    groupType: 0,
    memberSource: 0,
  };

  componentDidMount() {
    let { $getAllGroupMemberSource, $getAllAccountGroupType } = this.props;
    $getAllGroupMemberSource();
    $getAllAccountGroupType();
  }

  render() {
    const { visible, onClose, allGroupMemberSource, allAccountGroupType } = this.props;
    let { groupType, memberSource } = this.state;

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="新增分组"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.createForm} initialValues={{ ...defaultValue, groupType, memberSource }}>
          <Form.Item {...formLayout} label="组名称"
                     rules={[{ required: true, message: '请输入组名称' }]}
                     name="title">
            <Input style={{ width: '100%' }} placeholder="请输入组名称"/>
          </Form.Item>
          <Form.Item {...formLayout} label="组描述"
                     rules={[{ required: true, message: '请输入组描述' }]}
                     name="remark">
            <Input style={{ width: '100%' }} placeholder="请输入组描述"/>
          </Form.Item>
          <Form.Item {...formLayout} label="组类型"
                     rules={[{ required: true, message: '请输入组类型' }]}
                     name="groupType">
            <Radio.Group>
              {(allAccountGroupType).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formLayout} label="组员来源"
                     rules={[{ required: true, message: '请输入组员来源' }]}
                     name="memberSource">
            <Radio.Group>
              {(allGroupMemberSource).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" loading={confirmLoading} htmlType="button" onClick={this.onCancel}>取消</Button>,
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
      .then(({ ...values }) => {
        $insertOne({
          payload: {
            ...values,
          },
          callback: () => {
            message.success('新建成功');
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
  };
}

export default CreateModal;
