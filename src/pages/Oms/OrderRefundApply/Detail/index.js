import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Card, Col, Divider, Row, Table, Tag } from 'antd';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import Description from '@/components/DescriptionList/Description';
import Img from 'react-image';
import HandleModal from '@/pages/Oms/OrderRefundApply/Detail/Modal/HandleModal';

const ButtonGroup = Button.Group;


@connect(({ global, orderRefundApply: { detail = {} }, loading, ...rest }) => {
  return {
    detail: detail,
    id: (detail || {}).id,
    detailLoading: loading.effects['orderRefundApply/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'orderRefundApply/getOne', ...args }),
}))
class index extends React.Component {
  state = {
    visibleHandle: false,
    handleType: 'pass',
  };

  render() {
    const {
      id,
      detailLoading, detail: {
        applySn, orderItem,
        handleRemark, handlerName, handlerAt,
        receiveRemark, receiveName, receiveAt,
      },
    } = this.props;
    let { visibleHandle, handleType } = this.state;
    const orderItems = [orderItem];
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
        render: (val, { refundStatusName }) => EnumFormatter.refundApplyStatus(val, refundStatusName),
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

    const isHandled = (!!handlerAt);

    const action = (
      <>
        <ButtonGroup>
          <Button key="pass" type="primary" disabled={isHandled}
                  onClick={this.onClickShowHandleModal.bind(this, 'pass')}>同意</Button>
          <Button key="reject" type="primary" disabled={isHandled}
                  onClick={this.onClickShowHandleModal.bind(this, 'reject')}
                  danger>拒绝</Button>
        </ButtonGroup>
      </>);

    return (<PageHeaderWrapper className={styles.page}
                               loading={detailLoading}
                               action={action}
                               content={this.renderPageHeaderContent()}
                               extraContent={this.renderExtra()}
                               tabBarExtraContent={<span>extraContent</span>}
                               title={`申请单号: ${applySn}`}>
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="处理人">{handlerName || '暂无'}</Description>
          <Description term="处理时间">{DateFormatter.timestampAs(handlerAt)}</Description>
          <Description term="处理备注">{handleRemark || '暂无'}</Description>
          <Description term="收货人">{receiveName || '暂无'}</Description>
          <Description term="收货时间">{DateFormatter.timestampAs(receiveAt)}</Description>
          <Description term="收货备注">{receiveRemark || '暂无'}</Description>
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
      </Card>
      <HandleModal id={id}
                   type={handleType}
                   onClose={this.onClickCloseHandleModal}
                   visible={visibleHandle}/>
    </PageHeaderWrapper>);
  }

  renderPageHeaderContent = () => {
    const {
      detail: {
        createdAt, refundRemark, creatorName, refundReason,
      },
    } = this.props;
    return (<DescriptionList size="small" col="2">
      <Description term="创建人">{creatorName}</Description>
      <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
      <Description term="退费原因">{refundReason}</Description>
      <Description term="退费备注">{refundRemark}</Description>
    </DescriptionList>);
  };

  renderExtra = () => {
    const { detail: { refundAmount, applyStatus, applyStatusName } } = this.props;
    return (<Row>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>申请状态</div>
        <div className={styles.heading}>{EnumFormatter.refundApplyStatus(applyStatus, applyStatusName)}</div>
      </Col>
      <Col xs={24} sm={12}>
        <div className={styles.textSecondary}>退费金额</div>
        <div className={styles.heading}>{LangFormatter.formatRMB(refundAmount, '暂未处理')}</div>
      </Col>
    </Row>);
  };

  refresh = () => {
    let { id, $getOne } = this.props;
    $getOne({ payload: { id } });
  };

  onClickShowHandleModal = (type) => {
    this.setState({
      handleType: type,
      visibleHandle: true,
    });
  };

  onClickCloseHandleModal = () => this.setState({
    visibleHandle: false,
  }, this.refresh);

}

export default index;
