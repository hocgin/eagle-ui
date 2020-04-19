import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Radio } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, accountGroup: { detail }, dataDict: { allGroupMemberSource, allAccountGroupType }, loading, ...rest }) => {
  let detailLoading = loading.effects['accountGroup/getOne'];
  let itemDetail = detail;
  if (detail) {
    itemDetail = {
      ...detail,
    };
  }

  return {
    itemDetail: itemDetail,
    detailLoading,
    allGroupMemberSource,
    allAccountGroupType,
    confirmLoading: loading.effects['accountGroup/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'accountGroup/getOne', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'accountGroup/update', ...args }),
  $getAllGroupMemberSource: (args = {}) => dispatch({ type: 'dataDict/getAllGroupMemberSource', ...args }),
  $getAllAccountGroupType: (args = {}) => dispatch({ type: 'dataDict/getAllAccountGroupType', ...args }),
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
    let { id, $getOne, $getAllGroupMemberSource, $getAllAccountGroupType } = this.props;
    $getOne({ payload: { id } });
    $getAllGroupMemberSource();
    $getAllAccountGroupType();
  }

  render() {
    const { visible, onClose, itemDetail, detailLoading, allAccountGroupType, allGroupMemberSource } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="修改分组"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.updateForm}
              initialValues={{ ...itemDetail }}>
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
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消</Button>,
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
