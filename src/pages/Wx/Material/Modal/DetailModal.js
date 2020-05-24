import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { WxMaterial } from '@/pages/Wx/Material/WxMaterial';
import ClickCopy from '@/components/ClickCopy';

const { Panel } = Collapse;

@connect(({ global, wxMpMaterial: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['wxMpMaterial/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'wxMpMaterial/getOne', ...args }),
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
      materialType,
      materialTypeName,
      materialContent,
      materialResult: { mediaId },
    } = detail;
    let mediaUrl = WxMaterial.getMediaUrl(materialType, appid, mediaId);
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="素材详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header="基础信息" key="1">
          <TextRow first={true} title={'appid'}>{appid || '暂无'}</TextRow>
          <TextRow title={'素材类型'}>{materialTypeName}</TextRow>
          <TextRow title={'mediaId'}>{mediaId} <ClickCopy text={`${mediaId}`}/></TextRow>
          <TextRow title={'素材URL'}>{mediaUrl ? <><a href={`${mediaUrl}`}>点击下载</a> <ClickCopy
            text={`${mediaUrl}`}/></> : `暂无`}</TextRow>
          <TextRow title={'素材内容'}>{JSON.stringify(materialContent)}</TextRow>
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
