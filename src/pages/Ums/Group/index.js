import React from 'react';
import styles from './index.less';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import DetailModal from '@/pages/Ums/Account/Modal/DetailModal';
import UpdateModal from '@/pages/Ums/Group/Modal/UpdateModal';
import CreateModal from '@/pages/Ums/Group/Modal/CreateModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Goto from '@/utils/Goto';

@connect(({ global, accountGroup: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['accountGroup/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'accountGroup/paging', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleUpdate: false,
    visibleDetail: false,
    visibleCreate: false,
  };

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '分组名称',
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
  }, {
    title: '组描述',
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: '组类型',
    dataIndex: 'groupTypeName',
    key: 'groupTypeName',
  }, {
    title: '成员来源',
    dataIndex: 'memberSourceName',
    key: 'memberSourceName',
  }, {
    title: '创建时间',
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

      const MoreMenus = (<Menu onClick={onClickOperateRow.bind(this, record)}>
        <Menu.Item key="rowUpdate">修改</Menu.Item>
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

  render() {
    let { selectedRows, visibleUpdate, visibleDetail, visibleCreate, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'分组列表'}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={<Button htmlType="button" icon={<PlusOutlined/>} type="primary"
                                             onClick={this.onClickShowCreateModal}>新建</Button>}
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
      {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                     id={operateRow}
                                     onClose={this.onClickCloseUpdateModal}/>}
      {visibleCreate && <CreateModal visible={visibleCreate}
                                     onClose={this.onClickCloseCreateModal}/>}
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
        Goto.accountMemberDetailPage(operateRow);
        break;
      }
      case 'rowUpdate': {
        this.setState({
          visibleUpdate: true,
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

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });

  onClickCloseCreateModal = () => this.setState({
    visibleCreate: false,
  }, this.paging);

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.paging);
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
