import React, { PureComponent } from 'react';
import { Avatar, Button, Form, List, message, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  wrapperCol: { span: 13 },
};

let defaultValue = {
  enabled: true,
};

@connect(({ global, account: { complete }, loading, ...rest }) => {
  return {
    completeUser: complete,
    confirmLoading: loading.effects['accountGroup/joinMember'],
  };
}, dispatch => ({
  $joinMember: (args = {}) => dispatch({ type: 'accountGroup/joinMember', ...args }),
  $getCompleteUser: (args = {}) => dispatch({ type: 'account/getComplete', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();
  state = {
    dataSource: [],
  };

  componentDidMount() {
    let { $getCompleteUser } = this.props;
    $getCompleteUser();
  }

  render() {
    const { visible, onClose, completeUser } = this.props;
    let { dataSource } = this.state;
    return (
      <Modal width={460}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="新增组员"
             visible={visible}
             onCancel={onClose}
             footer={this.renderFooter()}
             maskClosable>
        <Form ref={this.createForm} initialValues={{ ...defaultValue }}>
          <Form.Item name="members">
            <Select style={{ width: '100%' }}
                    showSearch
                    onSearch={this.onSearchWithUser}
                    labelInValue
                    autoClearSearchValue
                    onSelect={this.onSelect}
                    placeholder="搜索加入组员">
              {(completeUser || []).filter(({ id }) => {
                return !(dataSource || []).find(({ id: did }) => `${did}` === `${id}`);
              }).map(({ id, avatar, nickname, username, phone }) =>
                <Select.Option value={id}>{nickname} - {username}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <List dataSource={dataSource}
                  style={{ minHeight: 300 }}
                  renderItem={({ id, avatar, nickname, email, phone }, index) => (
                    <List.Item actions={[<a onClick={this.onClickRowDelete.bind(this, index)}>删除</a>]}>
                      <List.Item.Meta avatar={<Avatar src={`${avatar}`}/>} title={`${nickname}`}
                                      description={`ID:${id}/${email}`}/>
                    </List.Item>)}/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  onClickRowDelete = (index) => {
    let { dataSource } = this.state;
    dataSource[index] = null;
    let result = (dataSource || []).filter(item => item !== null);
    this.setState({ dataSource: [...result] });
  };

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" loading={confirmLoading} htmlType="button" onClick={this.onCancel}>取消</Button>,
      <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
              onClick={this.onDone}>完成</Button>]);
  };

  onSelect = ({ value }) => {
    let { completeUser } = this.props;
    let result = (completeUser || []).find(({ id }) => `${value}` === `${id}`);
    if (!result) {
      return;
    }
    this.setState(({ dataSource }) => ({ dataSource: [...dataSource, result] }));
  };

  onSearchWithUser = (val) => {
    let { $getCompleteUser } = this.props;
    $getCompleteUser({ payload: { keyword: val } });
  };

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const {
      onClose,
      id,
      $joinMember,
    } = this.props;
    let { dataSource } = this.state;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ ...values }) => {
        $joinMember({
          payload: {
            groupId: id,
            members: (dataSource || []).map(({ id }) => id),
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
  };
}

export default CreateModal;
