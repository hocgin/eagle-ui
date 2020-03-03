import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';

const { Option } = Select;
const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

let defaultValue = {
    platform: 0,
    enabled: true,
};

@connect(({ global, authority: { authorityTree }, dataDict: { allPlatform, allEnabled }, loading, ...rest }) => {
    return {
        confirmLoading: loading.effects['dataDict/insert'],
    };
}, dispatch => ({
    $insertDataDict: (args = {}) => dispatch({ type: 'dataDict/insert', ...args }),
}))
class CreateModal extends PureComponent {
    createForm = React.createRef();

    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formValue: defaultValue,
    };

    componentDidMount() {
    }

    render() {
        const { visible, onClose } = this.props;
        const { formValue } = this.state;
        return (
          <Modal width={640}
                 bodyStyle={{ padding: '32px 40px 48px' }}
                 title="新增数据字典"
                 visible={visible}
                 onCancel={onClose}
                 maskClosable
                 footer={this.renderFooter()}>
              <Form ref={this.createForm}
                    initialValues={{ ...formValue }}>
                  <Form.Item {...formLayout} label="字典名称"
                             rules={[{ required: true, message: '请输入字典名称' }]}
                             name="title"
                             hasFeedback>
                      <Input style={{ width: '100%' }} placeholder="请输入字典名称"/>
                  </Form.Item>
                  <Form.Item {...formLayout} label="字典码"
                             rules={[{ required: true, message: '请输入字典码' }]}
                             name="code"
                             hasFeedback>
                      <Input style={{ width: '100%' }} placeholder="请输入字典码"/>
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
            onClose,
            $insertDataDict,
        } = this.props;
        let form = this.createForm.current;
        form.validateFields()
          .then(({ enabled, ...values }) => {
              $insertDataDict({
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
          .catch(err => message.error(Utils.getErrorMessage(err)));
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
    };

    static defaultProps = {
        visible: false,
    };
}

export default CreateModal;