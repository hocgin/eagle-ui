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

@connect(({ global, authority: { authorityTree }, dataDict: { allPlatform, allEnabled }, loading, ...rest }) => {
    return {
        authorityTree: authorityTree,
        allPlatform: allPlatform,
        confirmLoading: loading.effects['role/insert'],
    };
}, dispatch => ({
    $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
    $insertRole: (args = {}) => dispatch({ type: 'role/insert', ...args }),
    $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
    $getAllEnabled: (args = {}) => dispatch({ type: 'dataDict/getAllEnabled', ...args }),
}))
@Form.create()
class CreateModal extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        visible: false,
    };

    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formValue: {},
    };

    componentDidMount() {
        let { $getAuthorityTree, $getAllPlatform, $getAllEnabled } = this.props;
        $getAuthorityTree();
        $getAllPlatform();
    }

    render() {
        const { visible, onClose, ...rest } = this.props;
        const { step } = this.state;
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
              {this.Step(step)}
          </Modal>
        );
    }

    Step1 = () => {
        const { form, allPlatform } = this.props;
        let { formValue } = this.state;
        return ([<Form.Item key="1" {...formLayout} label="平台">
            {form.getFieldDecorator('platform', {
                initialValue: formValue.platform,
                rules: [{ required: true, message: '请选择平台' }],
            })(<Select style={{ width: '100%' }}>
                {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
            </Select>)}
        </Form.Item>, <Form.Item key="2" {...formLayout} label="角色名称" hasFeedback>
            {form.getFieldDecorator('title', {
                initialValue: formValue.title,
                rules: [{ required: true, message: '请输入角色名称' }],
            })(<Input style={{ width: '100%' }}/>)}
        </Form.Item>, <Form.Item key="3" {...formLayout} label="角色码" hasFeedback>
            {form.getFieldDecorator('roleCode', {
                initialValue: formValue.roleCode,
                rules: [{ required: true, message: '请输入角色码' }],
            })(<Input style={{ width: '100%' }}/>)}
        </Form.Item>, <Form.Item key="4" {...formLayout} label="角色描述" hasFeedback>
            {form.getFieldDecorator('remark', {
                initialValue: formValue.remark,
                rules: [{ required: false, message: '请输入角色描述' }],
            })(<Input style={{ width: '100%' }}/>)}
        </Form.Item>, <Form.Item key="5" {...formLayout} label="启用状态">
            {form.getFieldDecorator('enabled', {
                initialValue: formValue.enabled,
                valuePropName: 'checked',
            })(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
        </Form.Item>]);
    };

    Step2 = () => {
        const { form, authorityTree } = this.props;
        return [<Form.Item {...formLayout} label="权限列表" hasFeedback>
            {form.getFieldDecorator('authorities', {
                rules: [{ required: false, message: '请选择权限列表' }],
            })(<TreeSelect allowClear
                           treeCheckable
                           multiple={true}
                           placeholder="请选择权限列表"
                           style={{ width: '100%' }}>
                {UiUtils.renderTreeSelectNodes(authorityTree)}
            </TreeSelect>)}
        </Form.Item>];
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
        const { $insertRole, form, onClose } = this.props;
        let { step } = this.state;
        form.validateFieldsAndScroll((err, fieldsValue) => {
            if (err) {
                return;
            }
            const formValue = {
                ...this.state.formValue,
                ...fieldsValue,
            };

            this.setState({ formValue }, () => {
                if (step + 1 < this.Footer().length) {
                    this.setState({
                        step: step + 1,
                    });
                } else {
                    $insertRole({
                        payload: {
                            ...formValue,
                            enabled: formValue.enabled ? 1 : 0,
                        },
                        callback: () => {
                            message.success('提交成功');
                            form.resetFields();
                            this.setState(({ step }) => ({
                                step: 0,
                                formValue: {},
                            }), onClose);
                        },
                    });
                }
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

}

export default CreateModal;