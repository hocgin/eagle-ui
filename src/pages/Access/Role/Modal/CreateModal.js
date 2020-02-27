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
        onClose: PropTypes.func,
    };

    static defaultProps = {
        visible: false,
        onClose: () => {
        },
    };

    state = {
        // 待提交的值
        formValue: {},
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { visible, onClose, ...rest } = this.props;
        const {} = this.state;

        return (
          <Modal width={640}
                 onCancel={onClose}
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