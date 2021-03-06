import React from 'react';
import styles from './index.less';
import { Form, Input, Modal, Tooltip } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import DetailModal from '@/pages/Devtools/RequestLog/Modal/DetailModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ global, requestLog: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['requestLog/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'requestLog/paging', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleDetail: false,
  };

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '请求入口',
    dataIndex: 'uri',
    fixed: 'left',
    key: 'uri',
    ellipsis: true,
    width: 200,
    render: (val, { method }) => <Tooltip placement="top" title={`${method} ${val}`}>{method} {val}</Tooltip>,
  }, {
    title: '入口描述',
    dataIndex: 'enterRemark',
    key: 'enterRemark',
    width: 200,
  }, {
    title: '用户昵称',
    dataIndex: 'creatorName',
    key: 'creatorName',
    width: 150,
  }, {
    title: '用户IP',
    dataIndex: 'clientIp',
    key: 'clientIp',
    width: 150,
  }, {
    title: '用户地址',
    dataIndex: 'nation',
    key: 'nation',
    width: 200,
    render: (val, { nation, province, city }) => `${nation} / ${province} / ${city}`,
  }, {
    title: '运营商',
    dataIndex: 'operator',
    key: 'operator',
    width: 150,
  }, {
    title: '设备类型',
    dataIndex: 'platform',
    key: 'platform',
    width: 150,
  }, {
    title: '系统',
    dataIndex: 'systemOs',
    key: 'systemOs',
    width: 150,
    render: (val, { systemOs, systemVersion }) => `${systemOs}(${systemVersion})`,
  }, {
    title: '请求耗时',
    dataIndex: 'totalTimeMillis',
    key: 'totalTimeMillis',
    width: 100,
    render: (val) => `${val}ms`,
  }, {
    title: '操作时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
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

      return <>
        <a href={null}
           rel="noopener noreferrer"
           onClick={onClickOperateRow.bind(this, record, { key: 'rowDetail' })}>查看详情</a>
      </>;
    },
  }];

  render() {
    let { selectedRows, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'请求日志'}
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
                    tableColumns={this.tableColumns}/>
      {visibleDetail && <DetailModal visible={visibleDetail}
                                     id={operateRow}
                                     onClose={this.onClickCloseDetailModal}/>}
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
    switch (key) {
      case 'rowDetail': {
        this.setState({
          visibleDetail: true,
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

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
