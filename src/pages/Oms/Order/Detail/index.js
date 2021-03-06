import React from 'react';
import styles from './index.less';
import { Card, Col, Divider, Row, Table, Tag, Tooltip } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import Img from 'react-image';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UiUtils from '@/utils/UiUtils';
import StandardTable from '@/components/StandardTable';
import Goto from '@/utils/Goto';

const { Description } = DescriptionList;


@connect(({ global, order: { detail, changeLogPaging }, loading, ...rest }) => {
  return {
    detail: detail || {},
    changeLogPaging: changeLogPaging,
    detailLoading: loading.effects['order/getOne'],
    changeLogLoading: loading.effects['order/pagingChangeLog'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'order/getOne', ...args }),
  $pagingChangeLog: (args = {}) => dispatch({ type: 'order/pagingChangeLog', ...args }),
}))
class index extends React.Component {
  state = {
    searchValue: {},
  };

  render() {
    const { detailLoading, detail } = this.props;
    let {
      orderSn, orderStatus, orderStatusName, accountName, confirmStatusName, confirmStatus,
      receiverName, receiverPhone, receiverPostCode, receiverProvince, receiverCity, receiverRegion, receiverDetailAddress,
      orderItems, remark, freightAmount, totalAmount, payAmount, adjustmentDiscountAmount, createdAt, couponDiscountAmount,
    } = detail;

    let goodsData = orderItems;
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === orderItems.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
        render: (text, row, index) => {
          return <a href="">{text}</a>;
        },
      }, {
        title: '商品图片',
        dataIndex: 'productPic',
        key: 'productPic',
        render: val => <Img src={val} alt="商品图片"/>,
      }, {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        render: renderContent,
      }, {
        title: '规格',
        dataIndex: 'productSkuCode',
        key: 'productSkuCode',
        render: (val, { spec }, index) => (<span>
            {(spec || []).map(({ key, value }) => {
              return <Tag key={key}>{key}/{value}</Tag>;
            })}
          </span>),
      }, {
        title: '退款状态',
        dataIndex: 'refundStatus',
        key: 'refundStatus',
        render: (val, { refundStatusName, refundApplyId }) => {
          if (!!refundApplyId) {
            return (<Tooltip title="点击查看退款申请单"
                             onClick={() => {
                               Goto.refundApplyDetail(refundApplyId);
                             }}>{EnumFormatter.refundApplyStatus(val, refundStatusName)}</Tooltip>);
          }
          return EnumFormatter.refundApplyStatus(val, refundStatusName);
        },
      }, {
        title: '单价',
        dataIndex: 'productPrice',
        key: 'productPrice',
        align: 'right',
        render: (val) => val && LangFormatter.formatRMB(val),
      }, {
        title: '数量（件）',
        dataIndex: 'productQuantity',
        key: 'productQuantity',
        align: 'right',
        render: (text, row, index) => {
          return `${text}`;
        },
      }, {
        title: '小计',
        dataIndex: 'realAmount',
        key: 'realAmount',
        align: 'right',
        render: (text, row, index) => {
          text = LangFormatter.formatRMB(text);
          let couponAmount = row.couponAmount;
          if (couponAmount > 0) {
            couponAmount = LangFormatter.formatRMB(couponAmount);
            return `${text}, 优惠${couponAmount}`;
          }
          return text;
        },
      },
    ];

    return (<PageHeaderWrapper title={`订单单号: ${orderSn}`}
                               loading={detailLoading}
                               content={this.renderPageHeaderContent()}
                               extraContent={this.renderExtra()}
                               wrapperClassName={styles.page}>
      <Card bordered={false}>
        <DescriptionList size="large" title="收货人信息" style={{ marginBottom: 32 }}>
          <Description term="姓名">{receiverName}</Description>
          <Description term="手机号码">{receiverPhone}</Description>
          <Description term="邮编">{receiverPostCode}</Description>
          <Description term="省份">{receiverProvince}</Description>
          <Description term="城市">{receiverCity}</Description>
          <Description term="区域">{receiverRegion}</Description>
          <Description term="详细地址">{receiverDetailAddress}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }}/>
        <div className={styles.title}>商品信息</div>
        <Table rowKey={'id'}
               style={{ marginBottom: 24 }}
               pagination={false}
               loading={false}
               summary={data => {
                 let totalQuantity = 0;
                 let totalAmount = 0;
                 (data || []).forEach(({ productQuantity, realAmount }) => {
                   totalQuantity += productQuantity;
                   totalAmount += realAmount;
                 });
                 return (<>
                   <tr>
                     <th colSpan={6}>总计</th>
                     <td align={'right'}>{totalQuantity}</td>
                     <td align={'right'}>{LangFormatter.formatRMB(totalAmount)}</td>
                   </tr>
                 </>);
               }}
               dataSource={goodsData}
               columns={goodsColumns}/>
        <DescriptionList size="large" title="费用明细" style={{ marginBottom: 32 }}>
          <Description term="订单总价">{LangFormatter.formatRMB(totalAmount)}</Description>
          <Description term="应付金额">{LangFormatter.formatRMB(payAmount)}</Description>
          <Description term="运费">{LangFormatter.formatRMB(freightAmount)}</Description>
          <Description term="优惠券抵扣金额">{LangFormatter.formatRMB(couponDiscountAmount)}</Description>
          <Description term="后台调整优惠金额">{LangFormatter.formatRMB(adjustmentDiscountAmount)}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }}/>
        <div className={styles.title}>订单日志</div>
        {this.renderChangeLogTable()}
      </Card>
    </PageHeaderWrapper>);
  }

  renderChangeLogTable = () => {
    let { changeLogPaging, changeLogLoading } = this.props;
    let tableColumns = [{
      title: '日志编号',
      dataIndex: 'logSn',
      key: 'logSn',
      fixed: 'left',
    }, {
      title: '日志类型',
      dataIndex: 'refTypeName',
      key: 'refTypeName',
      render: (val, { changeTypeName }, index) => {
        return `${val}:${changeTypeName}`;
      },
    }, {
      title: '操作日志',
      dataIndex: 'changes',
      key: 'changes',
      width: 600,
      render: (val, { changeTypeName }, index) => {
        let changes = (val || []).map(({ changeRemark }) => {
          return (<li>{changeRemark}</li>);
        });
        return (<ul>{changes}</ul>);
      },
    }, {
      title: '操作人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      fixed: 'right',
    }, {
      title: '操作时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed: 'right',
      render: val => <span>{DateFormatter.timestampAs(val)}</span>,
    }];

    return (<StandardTable rowKey="id"
                           hiddenAlert={true}
                           expandable={null}
                           loading={changeLogLoading}
                           data={{
                             list: UiUtils.fastGetPagingList(changeLogPaging),
                             pagination: UiUtils.fastPagingPagination(changeLogPaging),
                           }}
                           columns={tableColumns}
                           onChange={this.onChangeStandardTable}/>);
  };

  renderPageHeaderContent = () => {
    const { detail } = this.props;
    let {
      createdAt, orderStatus, orderStatusName, accountName, confirmStatusName, confirmStatus, remark,
    } = detail;
    return (<DescriptionList size="small" col="2">
      <Description term="创建人">{accountName}</Description>
      <Description term="确认状态">{EnumFormatter.confirmStatus(confirmStatus, confirmStatusName)}</Description>
      <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
      {/*<Description term="关联退费单据">*/}
      {/*  <a href="">12421</a>*/}
      {/*</Description>*/}
      <Description term="客户备注">{remark}</Description>
    </DescriptionList>);
  };

  renderExtra = () => {
    const { detail: { totalAmount, orderStatus, orderStatusName } } = this.props;
    return (<Row>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>订单状态</div>
        <div className={styles.heading}>{EnumFormatter.orderStatus(orderStatus, orderStatusName)}</div>
      </Col>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>订单金额</div>
        <div className={styles.heading}>{LangFormatter.formatRMB(totalAmount)}</div>
      </Col>
    </Row>);
  };


  /**
   * 条件变更
   * @param pageSize
   * @param current
   * @param filtersArg
   * @param sorter
   */
  onChangeStandardTable = ({ pageSize, current }, filtersArg, sorter) => {
    let { searchValue } = this.state;
    this.setState({
      searchValue: { ...searchValue, size: pageSize, page: current },
    }, this.paging);
  };

  paging = () => {
    let { searchValue } = this.state;
    let { detail: { id } } = this.props;
    let { $pagingChangeLog } = this.props;
    $pagingChangeLog({ payload: { ...searchValue, id: id } });
  };


}

export default index;
