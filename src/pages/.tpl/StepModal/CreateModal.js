import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal, Select, Steps } from 'antd';
import PropTypes from 'prop-types';

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

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

    constructor(props) {
        super(props);
    }

    render() {
        const { visible, onClose, ...rest } = this.props;
        const { step } = this.state;
        return (
          <Modal width={640}
                 bodyStyle={{ padding: '32px 40px 48px' }}
                 title="规则配置"
                 visible={visible}
                 maskClosable
                 footer={this.Footer(step)}>
              <Steps size="small" current={step} style={{ marginBottom: 28 }}>
                  <Steps.Step title="基本信息"/>
                  <Steps.Step title="分配权限"/>
                  <Steps.Step title="基本信息"/>
              </Steps>
              {this.Step(step)}
          </Modal>
        );
    }

    Step1 = () => {
        const { form } = this.props;
        return ([<Form.Item key="1" {...formLayout} label="名称" hasFeedback>
            {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入资源名称' }],
            })(<Input style={{ width: '100%' }}/>)}
        </Form.Item>]);
    };

    Step2 = () => {
        const { form } = this.props;
        return [<Form.Item key="target" {...formLayout} label="监控对象">
            {form.getFieldDecorator('target', {
                initialValue: 1,
            })(
              <Select style={{ width: '100%' }}>
                  <Select.Option value="0">表一</Select.Option>
                  <Select.Option value="1">表二</Select.Option>
              </Select>,
            )}
        </Form.Item>];
    };

    Step3 = () => {
        return <div>ok</div>;
    };

    Step = (index) => {
        return [this.Step1, this.Step2, this.Step3][index]();
    };

    /**
     * 步骤渲染
     */
    Footer = (index) => {
        const previousBtn = (
            <Button key="previous" htmlType="button" style={{ float: 'left' }} onClick={this.onPrevious}>上一步 </Button>),
          nextBtn = (<Button key="next" type="primary" htmlType="button" onClick={this.onNext}>下一步</Button>),
          cancelBtn = (<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消</Button>),
          doneBtn = (<Button key="submit" htmlType="button" type="primary" onClick={this.onDone}>完成</Button>);

        return [
            [cancelBtn, nextBtn],
            [previousBtn, cancelBtn, nextBtn],
            [previousBtn, cancelBtn, doneBtn],
        ][index];
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
    onNext = () => {
        this.setState(({ step }) => ({
            step: step + 1,
        }));
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
    onDone = () => {
        let { form } = this.props;
        const value = form.getFieldsValue();
        console.log(value);
    };
}

export default CreateModal;