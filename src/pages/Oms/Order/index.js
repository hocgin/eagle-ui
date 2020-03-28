import React from 'react';
import styles from './index.less';
import ComplexTable from '@/components/ComplexTable';
import { Divider, Dropdown, Form, Input, Menu, Modal, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import UiUtils from '@/utils/UiUtils';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import UpdateModal from '@/pages/Oms/Order/Modal/UpdateModal';
import router from 'umi/router';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


@connect(({ global, order: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['order/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'order/paging', ...args }),
  $deleteOne: (args = {}) => dispatch({ type: 'order/delete', ...args }),
  $closeOne: (args = {}) => dispatch({ type: 'order/close', ...args }),
  $shippedOne: (args = {}) => dispatch({ type: 'order/shipped', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
  };

  tableColumns = [{
    title: '订单ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  }, {
    title: '订单编号',
    dataIndex: 'orderSn',
    key: 'orderSn',
    width: 250,
  }, {
    title: '实际支付金额',
    dataIndex: 'payAmount',
    key: 'payAmount',
    width: 150,
    render: (val, { totalAmount, couponAmount, freightAmount, discountAmount }) => {
      let title = `支付方式 = 订单总金额(${totalAmount}) + 运费金额(${freightAmount}) - 优惠券抵扣金额(${couponAmount === null ? '未使用' : couponAmount}) - 管理员后台调整订单使用的折扣金额(${discountAmount})`;
      return (<Tooltip placement="top" title={title}>{LangFormatter.formatRMB(val, '无')}</Tooltip>);
    },
  }, {
    title: '订单来源',
    dataIndex: 'sourceTypeName',
    key: 'sourceTypeName',
    width: 100,
  }, {
    title: '订单备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 100,
  }, {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    width: 100,
    render: (val, { orderStatusName }) => EnumFormatter.orderStatus(val, orderStatusName),
  }, {
    title: '确认状态',
    dataIndex: 'confirmStatus',
    key: 'confirmStatus',
    width: 100,
    render: (val, { confirmStatusName }) => EnumFormatter.confirmStatus(val, confirmStatusName),
  }, {
    title: '支付方式',
    dataIndex: 'payTypeName',
    key: 'payTypeName',
    width: 100,
    render: val => <span>{val || '未支付'}</span>,
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 200,
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '支付时间',
    dataIndex: 'paymentTime',
    key: 'paymentTime',
    width: 200,
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '发货时间',
    dataIndex: 'deliveryTime',
    key: 'deliveryTime',
    width: 200,
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '确认时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    width: 200,
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '评价时间',
    dataIndex: 'commentTime',
    key: 'commentTime',
    width: 200,
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    render: (text, record) => {
      const onClickOperateRow = (record, e) => {
        this.setState({
            operateRow: record.id,
          },
          () => {
            this.onClickMenuRowItem(e, record);
          });
      };

      const MoreMenus = (<Menu onClick={onClickOperateRow.bind(this, record)}>
        <Menu.Item key="rowUpdate">修改订单</Menu.Item>
        <Menu.Item key="rowClose">关闭订单</Menu.Item>
        <Menu.Item key="rowShipped">确认发货</Menu.Item>
        <Menu.Item key="rowUk">
          <del>物流追踪</del>
        </Menu.Item>
        <Menu.Item key="rowDetail">查看详情</Menu.Item>
        <Menu.Item key="rowDelete">删除</Menu.Item>
      </Menu>);

      return <>
        <a href={null}
           rel="noopener noreferrer"
           onClick={onClickOperateRow.bind(this, record, { key: 'rowDetail' })}>查看详情</a>
        <Divider type="vertical"/>
        <Dropdown overlay={MoreMenus}>
          <a href={null}
             rel="noopener noreferrer">
            更多操作 <DownOutlined/>
          </a>
        </Dropdown>
      </>;
    },
  }];

  componentDidMount() {
    this.paging();
  }

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'订单列表'}
                    toolbarMenu={BatchMenus}
                    searchBarChildren={[
                      <Form.Item label="关键词搜索"
                                 name="keyword">
                        <Input style={{ width: '100%' }} placeholder="请输入关键词"/>
                      </Form.Item>,
                    ]}
                    tableLoading={pagingLoading}
                    tableData={{
                      list: UiUtils.fastGetPagingList(paging),
                      pagination: UiUtils.fastPagingPagination(paging),
                    }}
                    selectedRows={selectedRows}
                    onSelectRow={this.onChangeSelectRow}
                    onClickSearch={this.onClickSearch}
                    onChangeStandardTable={this.onChangeStandardTable}
                    tableColumns={this.tableColumns}/>
      {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                     id={operateRow}
                                     onClose={this.onClickCloseUpdateModal}/>}
    </PageHeaderWrapper>);
  }

  /**
   * 分页搜索
   */
  paging = () => {
    let { searchValue } = this.state;
    let { $paging } = this.props;
    $paging({
      payload: {
        ...searchValue,
      },
    });
  };

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ id }) => id);
    this.setState({
      selectedRows: rowsId,
    });
  };

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    let { operateRow } = this.state;
    console.log('operateRow', operateRow);

    switch (key) {
      case 'rowDetail': {
        router.push({
          pathname: `/oms/order/${operateRow}`,
        });
        break;
      }
      case 'rowUpdate': {
        this.setState({ visibleUpdate: true });
        break;
      }
      case 'rowDelete': {
        this.onClickShowDeleteModal([this.state.operateRow]);
        break;
      }
      case 'rowClose': {
        this.onClickShowCloseModal([this.state.operateRow]);
        break;
      }
      case 'rowShipped': {
        this.onClickShowShippedModal([this.state.operateRow]);
        break;
      }
      default: {
        Modal.error({
          content: '无效操作',
        });
      }
    }
  };

  /**
   * 点击查询按钮
   * @param values
   */
  onClickSearch = (values) => this.setState({
    searchValue: {
      ...values,
    },
  }, this.paging);

  onClickShowDeleteModal = (ids = []) => {
    let { $deleteOne } = this.props;
    let paging = this.paging;
    UiUtils.showConfirmModal({
      ids: ids,
      dispatch: $deleteOne,
      callback: paging,
    });
  };

  onClickShowCloseModal = (ids) => {
    let { $closeOne } = this.props;
    let paging = this.paging;
    UiUtils.showConfirmModal({
      ids: ids,
      dispatch: $closeOne,
      callback: paging,
    });
  };

  onClickShowShippedModal = (ids) => {
    let { $shippedOne } = this.props;
    let paging = this.paging;
    UiUtils.showConfirmModal({
      ids: ids,
      dispatch: $shippedOne,
      callback: paging,
    });
  };

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.paging);
  };
}

export default index;
