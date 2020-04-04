import React from 'react';
import styles from './index.less';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import UiUtils from '@/utils/UiUtils';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

const { Description } = DescriptionList;


const tabList = [{
  key: 'tab1',
  tab: '详情',
}, {
  key: 'tab2',
  tab: '用户列表',
}];

@connect(({ global, coupon: { detail }, couponAccount: { paging }, loading, ...rest }) => {
  return {
    detail: detail || {},
    couponAccountPaging: paging,
    detailLoading: loading.effects['coupon/getOne'],
    couponAccountPagingLoading: loading.effects['couponAccount/paging'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'coupon/getOne', ...args }),
  $pagingCouponAccount: (args = {}) => dispatch({ type: 'couponAccount/paging', ...args }),
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
    return {
      'tab1': this.renderTab1,
      'tab2': this.renderTab2,
    }[key]();
  };
  renderTab1 = () => {
    const { detail: { remark, useType, creatorName, createdAt, canUseProduct, canUseProductCategory }, couponAccountPaging } = this.props;
    let table1 = (<>
      <div className={styles.title}>使用范围 · 指定商品品类</div>
      <StandardTable rowKey="id" data={{ list: canUseProductCategory, pagination: null }}
                     hiddenAlert={true}
                     columns={[{
                       title: 'ID',
                       dataIndex: 'id',
                       key: 'id',
                     }, {
                       title: '品类名称',
                       dataIndex: 'title',
                       key: 'title',
                     }]}/>
    </>);
    let table2 = (<>
      <div className={styles.title}>使用范围 · 指定商品</div>
      <StandardTable rowKey="id" data={{ list: canUseProduct, pagination: null }}
                     hiddenAlert={true}
                     columns={[{
                       title: 'ID',
                       dataIndex: 'id',
                       key: 'id',
                     }, {
                       title: '商品名称',
                       dataIndex: 'title',
                       key: 'title',
                     }]}/>
    </>);
    let tables = {
      '0': <></>,
      '1': table1,
      '2': table2,
    };

    return (<>
      <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
        <Description term="创建人">{creatorName}</Description>
        <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
        <Description term="备注">{remark}</Description>
      </DescriptionList>
      {tables[`${useType}`]}
    </>);
  };

  renderTab2 = () => {
    let { couponAccountPaging, couponAccountPagingLoading } = this.props;
    const tableColumns = [{
      title: '优惠卷码',
      dataIndex: 'couponSn',
      key: 'couponSn',
    }, {
      title: '持有人',
      dataIndex: 'accountName',
      key: 'accountName',
    }, {
      title: '优惠券状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      render: (val, { useStatusName }) => EnumFormatter.couponUseStatus(val, useStatusName),
    }, {
      title: '领取时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: val => <span>{DateFormatter.timestampAs(val)}</span>,
    }, {
      title: '生效时间',
      dataIndex: 'startAt',
      key: 'startAt',
      render: (val, { endAt }) => <span>{DateFormatter.timestampAs(val)}}</span>,
    }, {
      title: '失效时间',
      dataIndex: 'endAt',
      key: 'endAt',
      render: (val, { endAt }) => <span>{DateFormatter.timestampAs(val)}</span>,
    }];
    return (<>
      <div className={styles.title}>用户列表</div>
      <StandardTable rowKey="id" selectedRows={[]}
                     hiddenAlert={true}
                     expandable={null}
                     loading={couponAccountPagingLoading}
                     data={{
                       list: UiUtils.fastGetPagingList(couponAccountPaging),
                       pagination: UiUtils.fastPagingPagination(couponAccountPaging),
                     }}
                     onChange={this.onChangeStandardTable}
                     columns={tableColumns}/>
    </>);
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
    </DescriptionList>);
  };

  renderExtra = () => {
    const { detail: { credit, couponType } } = this.props;
    let v = LangFormatter.formatCouponValue(credit, couponType === 0);
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

  onChangeStandardTable = ({ pageSize, current }, filtersArg, sorter) => {
    let { searchValue } = this.state;
    this.setState({
      searchValue: {
        ...searchValue,
        size: pageSize,
        page: current,
      },
    }, this.props.$pagingCouponAccount);
  };

  onChangeTab = (key) => {
    this.setState({ operationKey: key });
  };
}

export default index;
