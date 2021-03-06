import React from 'react';
import styles from './index.less';
import { Form, Input, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { history } from 'umi';

@connect(({ global, orderRefundApply: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['orderRefundApply/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'orderRefundApply/paging', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
  };

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '退款申请号',
    dataIndex: 'applySn',
    key: 'applySn',
  }, {
    title: '申请人',
    dataIndex: 'creatorName',
    key: 'creatorName',
  }, {
    title: '申请退款金额',
    dataIndex: 'refundAmount',
    key: 'refundAmount',
    render: val => LangFormatter.formatRMB(val),
  }, {
    title: '申请状态',
    dataIndex: 'applyStatus',
    key: 'applyStatus',
    render: (val, { applyStatusName }) => EnumFormatter.orderStatus(val, applyStatusName),
  }, {
    title: '申请时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '最后更新时间',
    dataIndex: 'lastUpdatedAt',
    key: 'lastUpdatedAt',
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
      return <>
        <a href={null}
           rel="noopener noreferrer"
           onClick={onClickOperateRow.bind(this, record, { key: 'rowDetail' })}>查看详情</a>
      </>;
    },
  }];

  render() {
    let { selectedRows } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'申请列表'}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={null}
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
                    tableColumns={this.tableColumns}
      />
    </PageHeaderWrapper>);
  }

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
      searchValue: {
        ...searchValue,
        size: pageSize,
        page: current,
      },
    }, this.paging);
  };

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    let { operateRow } = this.state;
    switch (key) {
      case 'rowDetail': {
        history.push({
          pathname: `/oms/order-refund-apply/${operateRow}`,
        });
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
  onClickSearch = (values) => {
    this.setState({
      searchValue: {
        ...values,
      },
    }, this.paging);
  };

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
}

export default index;
