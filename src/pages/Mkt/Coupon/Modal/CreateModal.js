import React, { PureComponent } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ global, productCategory: { tree }, product: { all }, dataDict: { allCouponPlatformType, allCouponType, allCouponUseType }, loading, ...rest }) => {
  return {
    allProduct: all,
    productCategoryTree: tree,
    allCouponPlatformType: allCouponPlatformType,
    allCouponType: allCouponType,
    allCouponUseType: allCouponUseType,
    confirmLoading: loading.effects['coupon/insert'],
  };
}, dispatch => ({
  $getAllProduct: (args = {}) => dispatch({ type: 'product/getAll', ...args }),
  $getProductCategoryTree: (args = {}) => dispatch({ type: 'productCategory/getTree', ...args }),
  $insert: (args = {}) => dispatch({ type: 'coupon/insert', ...args }),
  $getAllCouponType: (args = {}) => dispatch({ type: 'dataDict/getAllCouponType', ...args }),
  $getAllCouponPlatformType: (args = {}) => dispatch({ type: 'dataDict/getAllCouponPlatformType', ...args }),
  $getAllCouponUseType: (args = {}) => dispatch({ type: 'dataDict/getAllCouponUseType', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();

  state = {
    useType: 0,
    couponType: 0,
  };

  componentDidMount() {
    let { $getAllProduct, $getProductCategoryTree, $getAllCouponType, $getAllCouponPlatformType, $getAllCouponUseType } = this.props;
    $getAllCouponType();
    $getAllCouponPlatformType();
    $getAllCouponUseType();
    $getProductCategoryTree();
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
                   title="新增优惠券"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form ref={this.createForm}
            initialValues={{ couponType: couponType, minPoint: 0, useType: useType, platform: 0 }}>
        <Form.Item {...formLayout} label="优惠券名称" hasFeedback
                   rules={[{ required: true, message: '请输入优惠券名称' }]}
                   name="title">
          <Input style={{ width: '100%' }} placeholder="请输入优惠券名称"/>
        </Form.Item>
        <Form.Item {...formLayout} label="折扣类型"
                   rules={[{ required: true, message: '请选择折扣类型' }]}
                   name="couponType">
          <Radio.Group onChange={this.onChangeCouponType}>
            {(allCouponType).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
          </Radio.Group>
        </Form.Item>
        {couponType === 0 && <Form.Item {...formLayout} label="优惠金额"
                                        rules={[{ required: true, message: '请输入优惠金额' }]}
                                        name="credit">
          <InputNumber style={{ width: '100%' }} min={0} step={0.1} precision={2}
                       formatter={value => `${value}元`}
                       placeholder="请输入优惠金额"/>
        </Form.Item>}
        {couponType === 1 && <Form.Item {...formLayout} label="优惠折扣"
                                        rules={[{ required: true, message: '请输入折扣' }]}
                                        name="credit">
          <InputNumber style={{ width: '100%' }} min={0.1} step={0.1} precision={2} max={0.99}
                       placeholder="请输入优惠折扣"/>
        </Form.Item>}
        <Form.Item {...formLayout} label="适用平台"
                   rules={[{ required: true, message: '请选择适用平台' }]}
                   name="platform">
          <Select>
            {(allCouponPlatformType).map(({ key, value }) => <Option value={value * 1}>{key}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item {...formLayout} label="使用门槛"
                   rules={[{ required: true, message: '请输入使用门槛' }]}
                   name="minPoint">
          <InputNumber style={{ width: '100%' }} min={0} step={0.1} precision={2}
                       placeholder="请输入使用门槛"/>
        </Form.Item>
        <Form.Item {...formLayout} label="可用范围"
                   rules={[{ required: true, message: '请选择可用范围' }]}
                   name="useType">
          <Radio.Group onChange={this.onChangeUseType}>
            {(allCouponUseType).map(({ key, value }) => <Radio.Button value={value * 1}>{key}</Radio.Button>)}
          </Radio.Group>
        </Form.Item>
        {useType === 1 && <Form.Item {...formLayout} label="商品品类"
                                     rules={[{ required: true, message: '请选择商品品类' }]}
                                     name="useProductCategoryId">
          <TreeSelect showSearch allowClear treeDefaultExpandAll multiple
                      treeCheckable
                      placeholder="请选择商品品类">
            {UiUtils.renderTreeSelectNodes(productCategoryTree)}
          </TreeSelect>
        </Form.Item>}
        {useType === 2 && <Form.Item {...formLayout} label="商品列表"
                                     rules={[{ required: true, message: '请选择商品列表' }]}
                                     name="useProductId">
          <Select allowClear showArrow showSearch
                  mode="multiple"
                  placeholder="请选择商品">
            {(allProduct || []).map(({ id, title }) => <Option value={id}>{title}</Option>)}
          </Select>
        </Form.Item>}
        <Form.Item {...formLayout} label="后台备注" hasFeedback
                   rules={[{ required: false, message: '请输入后台备注' }]}
                   name="remark">
          <TextArea style={{ width: '100%' }} autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder="请输入后台备注"/>
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
      onClose,
      $insert,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $insert({
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
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
  };

  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
    onClose: () => {
    },
  };
}


export default CreateModal;
