import React from 'react';
import styles from './index.less';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;


const tabList = [{
  key: 'tab1',
  tab: '详情',
}, {
  key: 'tab2',
  tab: '用户列表',
}];

@connect(({
            global,
            coupon: { detail },
            loading, ...rest
          }) => {
  return {
    detail: detail || {},
    detailLoading: loading.effects['coupon/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'coupon/getOne', ...args }),
}))
class index extends React.Component {
  state = {
    operationKey: 'tab1',
  };

  render() {
    const { detailLoading, detail: { title } } = this.props;
    let { operationKey } = this.state;
    return (<PageHeaderWrapper title={`优惠券名称: ${title}`}
                               loading={detailLoading}
                               content={this.renderPageHeaderContent()}
                               extraContent={this.renderExtra()}
                               onTabChange={this.onChangeTab}
                               wrapperClassName={styles.page}
                               tabActiveKey={operationKey}
                               tabList={tabList}>
      <Card bordered={false}>
        {this.renderCardContent(operationKey)}
      </Card>
    </PageHeaderWrapper>);
  }

  renderCardContent = (key) => {
    // -
    // 1. 适用商品
    // 2. 适用商品品类

    // -
    // 相关人员
    return key;
  };

  renderPageHeaderContent = () => {
    const { detail } = this.props;
    let {
      createdAt, couponTypeName, instructions, creatorName, platformName, useTypeName, remark,
      minPoint, ceiling,
    } = detail;
    return (<DescriptionList size="small" col="2">
      <Description term="折扣类型">{couponTypeName}</Description>
      <Description term="使用门槛">{LangFormatter.formatRMB(minPoint)}</Description>
      <Description term="优惠上限">{LangFormatter.formatRMB(ceiling)}</Description>
      <Description term="使用说明">{instructions}</Description>
      <Description term="适用平台">{platformName}</Description>
      <Description term="使用范围">{useTypeName}</Description>
      <Description term="创建人">{creatorName}</Description>
      <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
      <Description term="备注">{remark}</Description>
    </DescriptionList>);
  };

  renderExtra = () => {
    const { detail: { credit, couponType } } = this.props;
    let v = credit;
    if (couponType === 1) {
      v = LangFormatter.formatRMB(v);
    } else {
      v = `${v} 折`;
    }
    return (<Row>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>优惠券状态</div>
        <div className={styles.heading}>预留</div>
      </Col>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>优惠力度</div>
        <div className={styles.heading}>{v}</div>
      </Col>
    </Row>);
  };

  onChangeTab = (key) => {
    this.setState({ operationKey: key });
  };
}

export default index;
