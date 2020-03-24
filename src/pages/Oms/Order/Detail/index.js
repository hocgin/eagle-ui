import React from 'react';
import styles from './index.less';
import { Card, Divider, Table, Tag } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import Img from 'react-image';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

const { Description } = DescriptionList;


@connect(({
            global,
            order: { detail },
            loading, ...rest
          }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['order/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'order/getOne', ...args }),
}))
class index extends React.Component {

  render() {
    const { detailLoading, detail } = this.props;
    if (detailLoading) {
      return <></>;
    }
    let {
      orderSn, orderStatus, orderStatusName, accountName, confirmStatusName, confirmStatus,
      receiverName, receiverPhone, receiverPostCode, receiverProvince, receiverCity, receiverRegion, receiverDetailAddress,
      orderItems, remark, freightAmount, totalAmount, payAmount, discountAmount, createdAt, couponAmount,
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
      },
      {
        title: '单价',
        dataIndex: 'productPrice',
        key: 'productPrice',
        align: 'right',
        render: (val) => val && LangFormatter.formatRMB(val),
      },
      {
        title: '数量（件）',
        dataIndex: 'productQuantity',
        key: 'productQuantity',
        align: 'right',
        render: (text, row, index) => {
          return `${text}`;
        },
      },
      {
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


    return (<div className={styles.page}>
      <Card bordered={false}>
        <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
          <Description term="单号">{orderSn}</Description>
          <Description term="下单人">{accountName}</Description>
          <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
          <Description term="订单状态">{EnumFormatter.orderStatus(orderStatus, orderStatusName)}</Description>
          <Description term="确认状态">{EnumFormatter.confirmStatus(confirmStatus, confirmStatusName)}</Description>
          <Description term="订单备注">{remark}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }}/>
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
        <Table style={{ marginBottom: 24 }}
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
                     <th colSpan={5}>总计</th>
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
          <Description term="优惠券抵扣金额">{LangFormatter.formatRMB(couponAmount)}</Description>
          <Description term="后台调整优惠金额">{LangFormatter.formatRMB(discountAmount)}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }}/>
        <div className={styles.title}>订单日志</div>
        <Table
          style={{ marginBottom: 16 }}
          pagination={false}
          loading={true}
          dataSource={[]}
          columns={[]}
        />
      </Card>
    </div>);
  }

}

export default index;
