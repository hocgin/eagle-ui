import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, productCategory: { tree }, loading, ...rest }) => {
  return {
    data: tree,
    confirmLoading: loading.effects['productCategory/insertOne'],
  };
}, dispatch => ({
  $getTree: (args = {}) => dispatch({ type: 'productCategory/getTree', ...args }),
  $insertOne: (args = {}) => dispatch({ type: 'productCategory/insert', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();

  componentDidMount() {
    let { $getTree } = this.props;
    $getTree();
  }

  render() {
    const { form, visible, data, parentId, onClose, allPlatform, allAuthorityType, ...rest } = this.props;
    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="新增品类"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form onFinish={this.onFinish} ref={this.createForm}
            initialValues={{ enabled: true, type: 0, platform: 0, parentId }}>
        <Form.Item {...formLayout} label="父级"
                   name="parentId"
                   rules={[{ required: false, message: '请选择父级' }]}>
          <TreeSelect onSelect={this.onSelectRows}
                      allowClear
                      placeholder="默认为顶级">
            {UiUtils.renderTreeSelectNodes(data)}
          </TreeSelect>
        </Form.Item>
        <Form.Item {...formLayout} label="品类名称" hasFeedback
                   rules={[{ required: true, message: '请输入品类名称' }]}
                   name="title">
          <Input style={{ width: '100%' }}
                 placeholder="请输入品类名称"/>
        </Form.Item>
        <Form.Item {...formLayout} label="品类描述" hasFeedback
                   rules={[{ required: true, message: '请输入品类描述' }]}
                   name="authorityCode">
          <Input style={{ width: '100%' }}
                 placeholder="请输入品类描述"/>
        </Form.Item>
        <Form.Item {...formLayout} label="关键词" name="keywords">
          <Select mode="tags" style={{ width: '100%' }} placeholder="请输入关键词"/>
        </Form.Item>
        <Form.Item {...formLayout} label="启用状态"
                   valuePropName="checked"
                   name="enabled">
          <Switch checkedChildren="开" unCheckedChildren="关"/>
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
    e.preventDefault();
    const {
      onClose,
      $insertOne,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $insertOne({
          payload: {
            ...values,
            enabled: enabled ? 1 : 0,
          },
          callback: () => {
            message.success('新增成功');
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
    parentId: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    parentId: null,
    onClose: () => {
    },
  };
}


export default CreateModal;
