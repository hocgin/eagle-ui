import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Steps, Switch, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let defaultValue = {
  platform: 0,
  enabled: true,
};

@connect(({ global, authority: { authorityTree }, role: { detail }, dataDict: { allPlatform, allEnabled }, loading, ...rest }) => {
  let detailLoading = loading.effects['role/getOne'];
  let roleDetail = detail;
  if (detail) {
    roleDetail = {
      ...detail,
      enabled: detail.enabled === 1,
      authorities: (detail.authorities || []).map(({ id }) => id),
    };
  }

  return {
    roleDetail: roleDetail,
    authorityTree: authorityTree,
    allPlatform: allPlatform,
    detailLoading,
    confirmLoading: loading.effects['role/insert'],
  };
}, dispatch => ({
  $getRole: (args = {}) => dispatch({ type: 'role/getOne', ...args }),
  $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
  $updateRole: (args = {}) => dispatch({ type: 'role/update', ...args }),
  $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
  $getAllEnabled: (args = {}) => dispatch({ type: 'dataDict/getAllEnabled', ...args }),
}))
class UpdateModal extends PureComponent {
  createForm = React.createRef();

  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formValue: {},
  };

  componentDidMount() {
    let { id, $getRole, $getAuthorityTree, $getAllPlatform } = this.props;
    $getRole({ payload: { id } });
    $getAuthorityTree();
    $getAllPlatform();
  }

  render() {
    const { visible, onClose, roleDetail, detailLoading } = this.props;
    const { step } = this.state;
    if (detailLoading) {
      return <></>;
    }

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="新增角色"
             visible={visible}
             onCancel={onClose}
             maskClosable
             footer={this.Footer()[step]}>
        <Steps size="small" current={step} style={{ marginBottom: 28 }}>
          <Steps.Step title="基本信息"/>
          <Steps.Step title="分配权限"/>
        </Steps>
        <Form ref={this.createForm}
              initialValues={{ ...roleDetail }}>
          {this.Step(step)}
        </Form>
      </Modal>
    );
  }

  Step1 = () => {
    const { allPlatform } = this.props;
    return ([
      <Form.Item {...formLayout} label="平台"
                 rules={[{ required: true, message: '请选择平台' }]}
                 name="platform">
        <Select style={{ width: '100%' }}>
          {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
        </Select>
      </Form.Item>,
      <Form.Item {...formLayout} label="角色名称"
                 rules={[{ required: true, message: '请输入角色名称' }]}
                 name="title">
        <Input style={{ width: '100%' }} placeholder="请输入角色名称"/>
      </Form.Item>,
      <Form.Item {...formLayout} label="角色码"
                 rules={[{ required: true, message: '请输入角色码' }]}
                 name="roleCode"
                 hasFeedback>
        <Input style={{ width: '100%' }}/>
      </Form.Item>,
      <Form.Item {...formLayout} label="角色描述"
                 rules={[{ required: false, message: '请输入角色描述' }]}
                 name="remark"
                 hasFeedback>
        <Input style={{ width: '100%' }}/>
      </Form.Item>,
      <Form.Item {...formLayout} label="启用状态"
                 name="enabled"
                 valuePropName={'checked'}
                 hasFeedback>
        <Switch checkedChildren="开" unCheckedChildren="关"/>
      </Form.Item>]);
  };

  Step2 = () => {
    const { authorityTree } = this.props;
    return ([<Form.Item {...formLayout} label="权限列表"
                        rules={[{ required: false, message: '请选择权限列表' }]}
                        name={'authorities'}
                        hasFeedback>
      <TreeSelect allowClear
                  treeCheckable
                  multiple={true}
                  placeholder="请选择权限列表"
                  style={{ width: '100%' }}>
        {UiUtils.renderTreeSelectNodes(authorityTree)}
      </TreeSelect>
    </Form.Item>]);
  };

  Step = (index) => {
    return [this.Step1, this.Step2][index]();
  };

  /**
   * 步骤渲染
   */
  Footer = (index) => {
    let { confirmLoading } = this.props;
    const previousBtn = (
        <Button key="previous" htmlType="button" style={{ float: 'left' }} onClick={this.onPrevious}>上一步 </Button>),
      nextBtn = (<Button key="next" type="primary" htmlType="button" onClick={this.onNextOrDone}>下一步</Button>),
      cancelBtn = (<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消</Button>),
      doneBtn = (<Button key="submit" loading={confirmLoading} htmlType="button" type="primary"
                         onClick={this.onNextOrDone}>完成</Button>);

    return [
      [cancelBtn, nextBtn],
      [previousBtn, cancelBtn, doneBtn],
    ];
  };

  /**
   * 上一页
   */
  onPrevious = () => {
    this.setState(({ step }) => ({
      step: step - 1,
    }));
  };

  /**
   * 下一页
   */
  onNextOrDone = () => {
    const { $updateRole, onClose, id } = this.props;
    let { step } = this.state;
    let form = this.createForm.current;
    form.validateFields()
      .then(values => {
        const formValue = {
          ...this.state.formValue,
          ...values,
        };
        this.setState({ formValue }, () => {
          if (step + 1 < this.Footer().length) {
            this.setState({
              step: step + 1,
            });
            return;
          }
          $updateRole({
            payload: {
              id,
              ...formValue,
              enabled: formValue.enabled ? 1 : 0,
            },
            callback: () => {
              message.success('提交成功');
              this.setState(({ step }) => ({
                step: 0,
                formValue: {
                  ...defaultValue,
                },
              }), onClose);
              form.resetFields();
            },
          });
        });
      });
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
