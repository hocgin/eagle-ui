import React, { PureComponent } from 'react';
import { Avatar, Button, Collapse, Modal, Tag } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({ global, account: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['account/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'account/getOne', ...args }),
}))
class DetailModal extends PureComponent {
  componentDidMount() {
    let { id, $getDetail } = this.props;
    $getDetail({ payload: { id: id } });
  }

  render() {
    const { detail, detailLoading, visible, onClose, ...rest } = this.props;
    if (detailLoading) {
      return null;
    }
    let {
      username, email,
      createdAt, nickname, lastUpdatedAt, genderName, lastUpdaterName,
      createdIp,
      phone,
      avatar,
      roles,
      expiredName, enabledName, lockedName,
    } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="账号详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Avatar style={{height: 50, width: 50}} src={avatar}/>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header="基础信息" key="1">
          <TextRow first={true} title={'昵称'}>{nickname}</TextRow>
          <TextRow title={'登录名'}>{username}</TextRow>
          <TextRow title={'性别'}>{genderName}</TextRow>
          <TextRow title={'邮箱号'}>{email || '暂无'}</TextRow>
          <TextRow title={'手机号'}>{phone || '暂无'}</TextRow>
          <TextRow title={'注册 IP'}>{createdIp}</TextRow>
          <TextRow title={'角色'}>{(roles || []).map(({title})=> (<Tag color="lime">{title}</Tag>))}</TextRow>
          <TextRow title={'过期状态'}>{expiredName}</TextRow>
          <TextRow title={'锁定状态'}>{lockedName}</TextRow>
          <TextRow title={'开启状态'}>{enabledName}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
          <TextRow title={'最后更新时间'}>{DateFormatter.timestampAs(lastUpdatedAt)}</TextRow>
          <TextRow title={'最后更新人'}>{lastUpdaterName || '暂无'}</TextRow>
        </Panel>
      </ComplexCollapse>
    </Modal>);
  }

  renderFooter = () => {
    return ([<Button key="cancel" htmlType="button" type="primary" onClick={this.onCancel}>退出</Button>]);
  };

  /**
   * 取消
   */
  onCancel = () => {
    let { onClose } = this.props;
    onClose();
  };

  static propTypes = {
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    visible: false,
    detailLoading: true,
    id: null,
    onClose: () => {
    },
  };
}

export default DetailModal;
