import React, { PureComponent } from 'react';
import { Form, Modal } from 'antd';
import PropTypes from 'prop-types';

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

@Form.create()
class CreateModal extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool,
    };

    static defaultProps = {
        visible: false,
    };

    state = {
        visible: this.props.visible,
        // 待提交的值
        formValue: {},
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { ...rest } = this.props;
        const { visible } = this.state;

        return (
          <Modal width={640}
                 bodyStyle={{ padding: '32px 40px 48px' }}
                 title="规则配置"
                 visible={visible}
                 maskClosable
                 footer={this.renderFooter()}>
              <Form>

              </Form>
          </Modal>
        );
    }

    renderFooter = () => {
        return (<div></div>);
    };
}

export default CreateModal;