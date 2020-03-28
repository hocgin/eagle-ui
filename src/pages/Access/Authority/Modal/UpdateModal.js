import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, authority: { authorityTree, detail }, dataDict: { allPlatform, allAuthorityType }, loading, ...rest }) => {
  return {
    data: authorityTree,
    authorityDetail: detail,
    allPlatform: allPlatform,
    allAuthorityType: allAuthorityType,
    detailLoading: loading.effects['authority/getAuthority'],
    confirmLoading: loading.effects['authority/updateOne'],
  };
}, dispatch => ({
  $getTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'authority/updateOne', ...args }),
  $getOne: (args = {}) => dispatch({ type: 'authority/getAuthority', ...args }),
  $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
  $getAllAuthorityType: (args = {}) => dispatch({ type: 'dataDict/getAllAuthorityType', ...args }),
}))
class UpdateModal extends PureComponent {
  updateForm = React.createRef();

  state = {
    // 待提交的值
    formValue: {},
  };

  constructor(props) {
    super(props);
    console.log('Update', this.props);
  }

  componentDidMount() {
    let { id, $getOne, $getTree, $getAllPlatform, $getAllAuthorityType } = this.props;
    $getOne({ payload: { id: id } });
    $getTree();
    $getAllPlatform();
    $getAllAuthorityType();
  }

  render() {
    const { form, visible, detailLoading, confirmLoading, data, onClose, allPlatform, authorityDetail, allAuthorityType, ...rest } = this.props;
    if (detailLoading) {
      return null;
    }
    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="修改权限"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form ref={this.updateForm}
            initialValues={{ ...authorityDetail }}>
        <Form.Item {...formLayout} label="父级" hasFeedback
                   rules={[{ required: false, message: '请选择父级' }]}
                   name="parentId">
          <TreeSelect onSelect={this.onSelectRows}
                      allowClear
                      placeholder="默认为顶级">
            {this.renderTreeNodes(data)}
          </TreeSelect>
        </Form.Item>
        <Form.Item {...formLayout} label="平台" hasFeedback
                   rules={[{ required: true, message: '请选择平台' }]}
                   name="platform">
          <Select placeholder="请选择平台">
            {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formLayout} label="类型" hasFeedback
                   rules={[{ required: true, message: '请选择类型' }]}
                   name="type">
          <Select>
            {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formLayout} label="权限名称" hasFeedback
                   rules={[{ required: true, message: '请输入权限名称' }]}
                   name="title">
          <Input style={{ width: '100%' }} placeholder="请输入权限名称"/>
        </Form.Item>
        <Form.Item {...formLayout} label="权限码" hasFeedback
                   rules={[{ required: true, message: '请输入权限码' }]}
                   name="authorityCode">
          <Input style={{ width: '100%' }} placeholder="请输入权限码"/>
        </Form.Item>
        <Form.Item {...formLayout} label="启用状态" hasFeedback
                   valuePropName="checked"
                   name="enabled">
          <Switch checkedChildren="开" unCheckedChildren="关"/>
        </Form.Item>
      </Form>
    </Modal>);
  }

  renderTreeNodes = data => {
    return (data || []).map(item => {
      if (item.children && item.children.length > 0) {
        return (<TreeNode value={item.id} title={item.title} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>);
      }
      return <TreeNode value={item.id} key={item.authorityCode} title={item.title} dataRef={item}/>;
    });
  };

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
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
      .catch(err => {
        let text = UiUtils.getErrorMessage(err);
        message.error(text);
      });
  };

  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    detailLoading: true,
    visible: false,
    onClose: () => {
    },
  };
}

export default UpdateModal;
