import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({ global, wxMpConfig: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['wxMpConfig/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'wxMpConfig/getOne', ...args }),
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
      appid, title,
      createdAt, appSecret, lastUpdatedAt, token, lastUpdaterName,
      aesKey,
      creatorName, enabledName,
    } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="公众号详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header="基础信息" key="1">
          <TextRow first={true} title={'APP ID'}>{appid}</TextRow>
          <TextRow title={'公众号标题'}>{title}</TextRow>
          <TextRow title={'AppSecret'}>{appSecret}</TextRow>
          <TextRow title={'AesKey'}>{aesKey}</TextRow>
          <TextRow title={'token'}>{token}</TextRow>
          <TextRow title={'开启状态'}>{enabledName}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
          <TextRow title={'创建人'}>{creatorName || '暂无'}</TextRow>
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
