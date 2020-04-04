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

@connect(({ global, account: { complete }, loading, ...rest }) => {
  return {
    completeUser: complete,
    confirmLoading: loading.effects['coupon/give'],
  };
}, dispatch => ({
  $getCompleteUser: (args = {}) => dispatch({ type: 'account/getComplete', ...args }),
  $give: (args = {}) => dispatch({ type: 'coupon/give', ...args }),
}))
class SendModal extends PureComponent {
  sendForm = React.createRef();

  componentDidMount() {
    let { $getCompleteUser } = this.props;
    $getCompleteUser();
  }

  render() {
    const {
      form, visible, data, onClose,
      completeUser,
      ...rest
    } = this.props;
    console.log('completeUser', completeUser);

    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="派发优惠券"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Form ref={this.sendForm}>
        <Form.Item {...formLayout} label="有效期"
                   rules={[{ type: 'array', required: true, message: '请选择有效期' }]}
                   name="datetime">
          <RangePicker format="YYYY-MM-DD" placeholder={['生效时间', '失效时间']}/>
        </Form.Item>
        <Form.Item {...formLayout} label="用户列表"
                   rules={[{ required: true, message: '请选择用户' }]}
                   name="accountId">
          <Select allowClear showSearch
                  mode="multiple"
                  labelInValue
                  filterOption={false}
                  onSearch={this.onSearchWithUser}
                  notFoundContent="暂无数据"
                  placeholder="请输入编号或关键词搜索">
            {(completeUser || []).map(({ id, avatar, nickname, username, phone }) => <Option
              value={id}>{nickname} - {username}</Option>)}
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

  onSearchWithUser = (val) => {
    let { $getCompleteUser } = this.props;
    $getCompleteUser({ payload: { keyword: val } });
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
      onClose,
      $give,
    } = this.props;
    let form = this.sendForm.current;
    form.validateFields()
      .then(({ datetime, accountId, ...values }) => {
        $give({
          payload: {
            id,
            accountId: (accountId || []).map(({ key }) => key),
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
