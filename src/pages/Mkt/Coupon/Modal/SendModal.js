import React, { PureComponent } from 'react';
import { Button, DatePicker, Form, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { RangePicker } = DatePicker;


const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, productCategory: { tree }, product: { all }, loading, ...rest }) => {
  return {
    allProduct: all,
    confirmLoading: loading.effects['coupon/give'],
  };
}, dispatch => ({
  $getAllProduct: (args = {}) => dispatch({ type: 'product/getAll', ...args }),
  $give: (args = {}) => dispatch({ type: 'coupon/give', ...args }),
}))
class SendModal extends PureComponent {
  createForm = React.createRef();

  state = {
    useType: 0,
    couponType: 0,
  };

  componentDidMount() {
    let { $getAllProduct } = this.props;
    $getAllProduct();
  }

  render() {
    const {
      form, visible, data, productCategoryTree, onClose,
      allProduct, allCouponPlatformType, allCouponType, allCouponUseType, ...rest
    } = this.props;
    let { useType, couponType } = this.state;

    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="派发优惠券"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form ref={this.createForm}
            initialValues={{ couponType: couponType, minPoint: 0, useType: useType, platform: 0 }}>
        <Form.Item {...formLayout} label="有效期"
                   rules={[{ type: 'array', required: true, message: '请选择有效期' }]}
                   name="datetime">
          <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['生效时间', '失效时间']}/>
        </Form.Item>
        <Form.Item {...formLayout} label="用户列表"
                   rules={[{ required: true, message: '请选择用户' }]}
                   name="accountId">
          <Select allowClear showArrow showSearch
                  mode="multiple"
                  placeholder="请选择用户">
            {(allProduct || []).map(({ id, title }) => <Option value={id}>{title}</Option>)}
          </Select>
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

  onChangeUseType = (e) => this.setState({ useType: e.target.value });
  onChangeCouponType = (e) => this.setState({ couponType: e.target.value });

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
      $give,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ datetime, ...values }) => {
        $give({
          payload: {
            id,
            startAt: datetime[0].valueOf(),
            endAt: datetime[1].valueOf(),
            ...values,
          },
          callback: () => {
            message.success('派发成功');
            form.resetFields();
            onClose();
          },
        });
      })
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
  };

  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    id: null,
    onClose: () => {
    },
  };
}


export default SendModal;
