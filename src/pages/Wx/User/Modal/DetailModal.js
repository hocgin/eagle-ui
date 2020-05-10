import React, { PureComponent } from 'react';
import { Avatar, Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { WxEnum } from '@/pages/Wx/WxEnum';

const { Panel } = Collapse;

@connect(({ global, wxMpUser: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['wxMpUser/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'wxMpUser/getOne', ...args }),
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
      nickname, sex,
      country, province, city,
      createdAt, subscribe, subscribeTime,
      language,
      headimgurl,
      unionid,
      openid,
      appid,
      remark,
      subscribeScene,
      qrScene,
      qrSceneStr,
      id,
    } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="微信用户详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <Avatar style={{ height: 50, width: 50 }} src={headimgurl}/>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header="基础信息" key="1">
          <TextRow first={true} title={'UnionId'}>{unionid || '暂无'}</TextRow>
          <TextRow title={'OpenId'}>{openid}</TextRow>
          <TextRow title={'用户昵称'}>{nickname}</TextRow>
          <TextRow title={'性别'}>{WxEnum.sex(sex)}</TextRow>
          <TextRow title={'所在地'}>{`${country} / ${province} / ${city}`}</TextRow>
          <TextRow title={'语言'}>{language}</TextRow>
          <TextRow title={'备注'}>{remark}</TextRow>
          <TextRow title={'关注状态'}>{WxEnum.subscribe(subscribe)}</TextRow>
          <TextRow title={'关注的渠道来源'}>{WxEnum.subscribeScene(subscribeScene)}</TextRow>
          <TextRow title={'二维码扫码场景(1)'}>{qrScene}</TextRow>
          <TextRow title={'二维码扫码场景(2)'}>{qrSceneStr}</TextRow>
          <TextRow title={'关注时间'}>{DateFormatter.timestampAs(subscribeTime)}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
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
