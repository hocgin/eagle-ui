import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, wxMpConfig: { detail }, loading, ...rest }) => {
  let detailLoading = loading.effects['wxMpConfig/getOne'];
  let nowDetail = detail;
  if (nowDetail) {
    nowDetail = {
      ...detail,
      enabled: detail.enabled === 1,
    };
  }

  return {
    detail: nowDetail,
    detailLoading,
    confirmLoading: loading.effects['wxMpConfig/updateOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'wxMpConfig/getOne', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'wxMpConfig/update', ...args }),
}))
class UpdateModal extends PureComponent {
  updateForm = React.createRef();

  state = {
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
                   title="修改公众号配置"
                   visible={visible}
                   onCancel={onClose}
                   footer={this.renderFooter()}
                   maskClosable>
      <Form ref={this.updateForm}
            initialValues={{ ...detail }}>
        <Form.Item {...formLayout} label="APP ID"
                   rules={[{ required: true, message: '请输入APP ID' }]}
                   name="appid">
          <Input style={{ width: '100%' }} placeholder="请输入APP ID" disabled={true}/>
        </Form.Item>
        <Form.Item {...formLayout} label="标题"
                   rules={[{ required: true, message: '请输入标题' }]}
                   name="title">
          <Input style={{ width: '100%' }} placeholder="请输入标题"/>
        </Form.Item>
        <Form.Item {...formLayout} label="AppSecret"
                   rules={[{ required: true, message: '请输入AppSecret' }]}
                   name="appSecret">
          <Input style={{ width: '100%' }} placeholder="请输入AppSecret"/>
        </Form.Item>
        <Form.Item {...formLayout} label="AesKey"
                   rules={[{ required: true, message: '请输入AesKey' }]}
                   name="aesKey">
          <Input style={{ width: '100%' }} placeholder="请输入AesKey"/>
        </Form.Item>
        <Form.Item {...formLayout} label="Token"
                   rules={[{ required: true, message: '请输入Token' }]}
                   name="token">
          <Input style={{ width: '100%' }} placeholder="请输入Token"/>
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
