import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({ global, wxMpQrcode: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['wxMpQrcode/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'wxMpQrcode/getOne', ...args }),
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
      appid,
      expireSeconds,
      sceneId,
      sceneStr,
      ticket,
      url,
      qrcodeUrl,
      id,
      createdAt,
      expireAt,
      creatorName,
    } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="二维码详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header={`基础信息(${id})`} key="1">
          <TextRow first={true} title={'AppID'}>{appid || '暂无'}</TextRow>
          <TextRow title={'过期时间'}>{expireSeconds}秒</TextRow>
          <TextRow title={'过期时间'}>{DateFormatter.timestampAs(expireAt)}</TextRow>
          <TextRow title={'场景值(Int)'}>{sceneId}</TextRow>
          <TextRow title={'场景值(String)'}>{sceneStr}</TextRow>
          <TextRow title={'Ticket'}>{ticket}</TextRow>
          <TextRow title={'Url'}>{url}</TextRow>
          <TextRow title={'二维码'}><img src={qrcodeUrl} alt="二维码" width={80}/></TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
          <TextRow title={'创建人'}>{creatorName}</TextRow>
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
