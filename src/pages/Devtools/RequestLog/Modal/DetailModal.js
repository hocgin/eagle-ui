import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({ global, requestLog: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['requestLog/getOne'],
  };
}, dispatch => ({
  $getDetail: (args = {}) => dispatch({ type: 'requestLog/getOne', ...args }),
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
      id,
      logs,
      exception,
      totalTimeMillis,
      mapping,
      host,
      userAgent,
      createdAt,
      clientIp,
      enterRemark,
      creatorName,
      method,
      nation,
      city,
      province,
      operator,
      uri,
      args,
      ret,
      platform,
      zipCode,
      cityCode,
      netType,
      systemOs,
      systemVersion,
      engine,
      engineVersion,
      supporter,
      supporterVersion,
      shell,
      shellVersion,
    } = detail;
    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="请求日志详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header={`基础信息(ID: ${id})`} key="1">
          <TextRow first={true} title={'请求入口'}>{method} {uri}</TextRow>
          <TextRow title={'入口描述'}>{enterRemark}</TextRow>
          <TextRow title={'用户 IP'}>{clientIp}</TextRow>
          <TextRow title={'Host'}>{host}</TextRow>
          <TextRow title={'User-Agent'}>{userAgent}</TextRow>
          <TextRow title={'用户地址'}>{`${nation} / ${province} / ${city}`}</TextRow>
          <TextRow title={'网络类型'}>{netType}</TextRow>
          <TextRow title={'运营商'}>{operator}</TextRow>
          <TextRow title={'设备类型'}>{platform}</TextRow>
          <TextRow title={'邮编号码'}>{zipCode}</TextRow>
          <TextRow title={'城市区号'}>{cityCode}</TextRow>
          <TextRow title={'系统(版本)'}>{`${systemOs}(${systemVersion})`}</TextRow>
          <TextRow title={'内核(版本)'}>{`${engine}(${engineVersion})`}</TextRow>
          <TextRow title={'载体(版本)'}>{`${supporter}(${supporterVersion})`}</TextRow>
          <TextRow title={'外壳(版本)'}>{`${shell}(${shellVersion})`}</TextRow>
          <TextRow title={'触发位置'}>{mapping}</TextRow>
          <TextRow title={'异常信息'}>{exception || 'N/A'}</TextRow>
          <TextRow title={'请求耗时'}>{totalTimeMillis} ms</TextRow>
          <TextRow title={'操作人'}>{creatorName || 'N/A'}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
        </Panel>
        <Panel header="请求体" key="2">{args}</Panel>
        <Panel header="线程日志" key="3">{logs}</Panel>
        <Panel header="响应体" key="4">{ret}</Panel>
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
