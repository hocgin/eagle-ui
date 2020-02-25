import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';

const { TreeNode } = TreeSelect;
const { Option } = Select;

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

@connect(({ global, authority: { authorityTree }, dataDict: { allPlatform, allAuthorityType }, loading, ...rest }) => {
    return {
        data: authorityTree,
        allPlatform: allPlatform,
        allAuthorityType: allAuthorityType,
    };
}, dispatch => ({
    $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
    $insertOneAuthority: (args = {}) => dispatch({ type: 'authority/insertOne', ...args }),
    $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
    $getAllAuthorityType: (args = {}) => dispatch({ type: 'dataDict/getAllAuthorityType', ...args }),
}))
@Form.create()
class CreateModal extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        parentId: PropTypes.number,
    };

    static defaultProps = {
        visible: false,
        parentId: null,
    };

    state = {
        visible: this.props.visible,
        // 待提交的值
        formValue: {},
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let { $getAuthorityTree, $getAllPlatform, $getAllAuthorityType } = this.props;
        $getAuthorityTree();
        $getAllPlatform();
        $getAllAuthorityType();
    }

    render() {
        const { form, data, parentId, allPlatform, allAuthorityType, ...rest } = this.props;
        const { visible } = this.state;

        return (<Modal width={640}
                       bodyStyle={{ padding: '32px 40px 48px' }}
                       title="新增权限"
                       visible={visible}
                       maskClosable
                       footer={this.renderFooter()}>
            <Form onSubmit={this.onSubmit}>
                <Form.Item {...formLayout} label="平台" hasFeedback>
                    {form.getFieldDecorator('platform', {
                        initialValue: 0,
                        rules: [{ required: false, message: '请选择平台' }],
                    })(<Select>
                        {(allPlatform).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
                    </Select>)}
                </Form.Item>
                <Form.Item {...formLayout} label="类型" hasFeedback>
                    {form.getFieldDecorator('type', {
                        initialValue: 0,
                        rules: [{ required: false, message: '请选择平台' }],
                    })(<Select>
                        {(allAuthorityType).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
                    </Select>)}
                </Form.Item>
                <Form.Item {...formLayout} label="父级" hasFeedback>
                    {form.getFieldDecorator('parentId', {
                        initialValue: parentId,
                        rules: [{ required: false, message: '请选择父级' }],
                    })(<TreeSelect onSelect={this.onSelectRows}>
                        {this.renderTreeNodes(data)}
                    </TreeSelect>)}
                </Form.Item>
                <Form.Item {...formLayout} label="权限名称" hasFeedback>
                    {form.getFieldDecorator('title', {
                        rules: [{ required: true, message: '请输入权限名称' }],
                    })(<Input style={{ width: '100%' }}/>)}
                </Form.Item>
                <Form.Item {...formLayout} label="权限码" hasFeedback>
                    {form.getFieldDecorator('authorityCode', {
                        rules: [{ required: true, message: '请输入权限码' }],
                    })(<Input style={{ width: '100%' }}/>)}
                </Form.Item>
                <Form.Item {...formLayout} label="启用状态">
                    {form.getFieldDecorator('enabled', {
                        initialValue: true,
                        valuePropName: 'checked',
                    })(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
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
        return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
            <Button key="submit" htmlType="button" type="primary" onClick={this.onDone}>完成</Button>]);
    };

    onSubmit = () => {

    };

    /**
     * 取消
     */
    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 完成
     */
    onDone = (e) => {
        e.preventDefault();
        const {
            form: { validateFieldsAndScroll },
            $insertOneAuthority,
        } = this.props;
        validateFieldsAndScroll((err, { enabled, ...values }) => {
            if (err) {
                let text = Utils.getErrorMessage(err);
                message.error(text);
                return;
            }
            $insertOneAuthority({
                payload: {
                    ...values,
                    enabled: enabled ? 1 : 0,
                },
                callback: () => {
                    message.success('新增成功');
                    this.setState({
                        visible: false,
                    });
                },
            });
        });
    };
}

export default CreateModal;