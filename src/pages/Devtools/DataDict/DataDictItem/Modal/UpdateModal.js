import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/Utils';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, dataDictItem: { detail }, loading, ...rest }) => {
  let detailLoading = loading.effects['dataDictItem/getOne'];
  let dataDictItemDetail = detail;
  if (detail) {
    dataDictItemDetail = {
      ...detail,
      enabled: detail.enabled === 1,
    };
  }

  return {
    dataDictItemDetail: dataDictItemDetail,
    detailLoading,
    confirmLoading: loading.effects['dataDictItem/update'],
  };
}, dispatch => ({
  $getDataDictItem: (args = {}) => dispatch({ type: 'dataDictItem/getOne', ...args }),
  $updateDataDictItem: (args = {}) => dispatch({ type: 'dataDictItem/update', ...args }),
}))
class UpdateModal extends PureComponent {
  updateForm = React.createRef();

  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formValue: {},
    operateRow: null,
    visibleUpdate: false,
  };

  componentDidMount() {
    let { id, $getDataDictItem } = this.props;
    $getDataDictItem({ payload: { id } });
  }

  render() {
    const { visible, onClose, dataDictItemDetail, detailLoading } = this.props;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="修改数据字典项"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.updateForm}
              initialValues={{ ...dataDictItemDetail }}>
          <Form.Item {...formLayout} label="字典项名称"
                     rules={[{ required: true, message: '请输入字典项名称' }]}
                     name="title">
            <Input style={{ width: '100%' }} placeholder="请输入字典项名称"/>
          </Form.Item>
          <Form.Item {...formLayout} label="标识"
                     rules={[{ required: true, message: '请输入标识' }]}
                     name="code"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="字典项描述"
                     rules={[{ required: false, message: '请输入字典项描述' }]}
                     name="remark"
                     hasFeedback>
            <Input style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item {...formLayout} label="启用状态"
                     name="enabled"
                     valuePropName={'checked'}>
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
      dataDictItemDetail: { dictId },
      $updateDataDictItem,
    } = this.props;
    let form = this.updateForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $updateDataDictItem({
          payload: {
            ...values,
            dictId,
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
