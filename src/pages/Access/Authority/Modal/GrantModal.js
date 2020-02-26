import React, { PureComponent } from 'react';
import { Button, Form, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

@connect(({ global, role: { paging }, loading, ...rest }) => {
    return {
        pagingRole: paging,
        confirmLoading: loading.effects['authority/grantRole'],
    };
}, dispatch => ({
    $pagingRole: (args = {}) => dispatch({ type: 'role/paging', ...args }),
    $grantRole: (args = {}) => dispatch({ type: 'authority/grantRole', ...args }),
}))
@Form.create()
class GrantModal extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        id: PropTypes.number,
    };

    static defaultProps = {
        visible: false,
        id: null,
        onClose: () => {
        },
    };

    state = {
        // 待提交的值
        formValue: {},
    };

    constructor(props) {
        super(props);
        console.log('Update', this.props);
    }

    componentDidMount() {
        let { id, $pagingRole } = this.props;
        $pagingRole({});
    }

    render() {
        const { form, visible, onClose, pagingRole, ...rest } = this.props;
        let roles = UiUtils.getPagingList(pagingRole);
        return (<Modal width={640}
                       bodyStyle={{ padding: '32px 40px 48px' }}
                       title="权限详情"
                       visible={visible}
                       maskClosable
                       onCancel={onClose}
                       footer={this.renderFooter()}>
            <Form>
                <Form.Item {...formLayout} label="选择角色" hasFeedback>
                    {form.getFieldDecorator('roles', {
                        rules: [{ required: false, message: '请选择角色' }],
                    })(<Select showSearch
                               mode="multiple"
                               onSelect={this.onSelectRows}
                               onSearch={this.onSearchKeyword}
                               allowClear
                               placeholder="请选择角色">
                        {(roles || []).map(({ id, title }) =>
                          <Select.Option key={id} value={id}>{title}</Select.Option>)}
                    </Select>)}
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

    onSearchKeyword = (keyword) => {
        let { $pagingRole } = this.props;
        $pagingRole({
            keyword: keyword,
        });
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
            form: { validateFieldsAndScroll },
            onClose,
            $grantRole,
        } = this.props;
        validateFieldsAndScroll((err, { enabled, ...values }) => {
            if (err) {
                let text = Utils.getErrorMessage(err);
                message.error(text);
                return;
            }
            $grantRole({
                payload: {
                    id,
                    ...values,
                },
                callback: () => {
                    message.success('授权完成');
                    onClose();
                },
            });
        });
    };
}

export default GrantModal;