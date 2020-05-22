import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

const { Panel } = Collapse;

@connect(({ global, wxMpReplyRule: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['wxMpReplyRule/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'wxMpReplyRule/getOne', ...args }),
}))
class DetailModal extends PureComponent {
  componentDidMount() {
    let { id, $getOne } = this.props;
    $getOne({ payload: { id: id } });
  }

  render() {
    const { detail, detailLoading, visible, onClose, ...rest } = this.props;
    if (detailLoading) {
      return null;
    }
    let { id, appid, title, createdAt, creatorName, lastUpdatedAt, enabled, enabledName, replyContent, matchRule, sort, lastUpdaterName, matchMsgTypeName, replyMsgTypeName } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="回复规则详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header={`基础信息(ID:${id})`} key="1">
          <TextRow first={true} title={'appid'}>{appid}</TextRow>
          <TextRow title={'规则名称'}>{title}</TextRow>
          <TextRow title={'匹配类型'}>{matchMsgTypeName}</TextRow>
          <TextRow title={'回复类型'}>{replyMsgTypeName}</TextRow>
          <TextRow title={'匹配规则'}>{JSON.stringify(matchRule)}</TextRow>
          <TextRow title={'回复内容'}>{JSON.stringify(replyContent)}</TextRow>
          <TextRow title={'优先级'}>{sort}</TextRow>
          <TextRow title={'开启状态'}>{EnumFormatter.enabledStatus(enabled, enabledName)}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
          <TextRow title={'创建人'}>{creatorName}</TextRow>
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
