import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

@connect(({ global, dataDict: { detail }, loading, ...rest }) => {
    let detailLoading = loading.effects['dataDict/getOne'];
    let dataDictDetail = detail;
    if (detail) {
        dataDictDetail = {
            ...detail,
            enabled: detail.enabled === 1,
        };
    }

    return {
        dataDictDetail: dataDictDetail,
        detailLoading,
        confirmLoading: loading.effects['dataDict/update'],
    };
}, dispatch => ({
    $getDataDict: (args = {}) => dispatch({ type: 'dataDict/getOne', ...args }),
    $updateDataDict: (args = {}) => dispatch({ type: 'dataDict/update', ...args }),
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
        let { id, $getDataDict } = this.props;
        $getDataDict({ payload: { id } });
    }

    render() {
        const { visible, onClose, dataDictDetail, detailLoading, allPlatform } = this.props;
        if (detailLoading) {
            return <></>;
        }

        return (
            <Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="修改数据字典"
                   visible={visible}
                   onCancel={onClose}
                   footer={this.renderFooter()}
                   maskClosable>
                <Form ref={this.updateForm}
                      initialValues={{ ...dataDictDetail }}>
                    <Form.Item {...formLayout} label="字典名称"
                               rules={[{ required: true, message: '请输入字典名称' }]}
                               name="title">
                        <Input style={{ width: '100%' }} placeholder="请输入字典名称"/>
                    </Form.Item>
                    <Form.Item {...formLayout} label="标识"
                               rules={[{ required: true, message: '请输入标识' }]}
                               name="code"
                               hasFeedback>
                        <Input style={{ width: '100%' }}/>
                    </Form.Item>
                    <Form.Item {...formLayout} label="字典描述"
                               rules={[{ required: false, message: '请输入字典描述' }]}
                               name="remark"
                               hasFeedback>
                        <Input style={{ width: '100%' }}/>
                    </Form.Item>
                    <Form.Item {...formLayout} label="启用状态"
                               name="enabled"
                               valuePropName={'checked'}
                               hasFeedback>
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
            $updateDataDict,
        } = this.props;
        let form = this.updateForm.current;
        form.validateFields()
            .then(({ enabled, ...values }) => {
                $updateDataDict({
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
