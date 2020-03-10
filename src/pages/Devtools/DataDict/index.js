import React from 'react';
import styles from './index.less';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Devtools/DataDict/Modal/CreateModal';
import DetailModal from '@/pages/Devtools/DataDict/Modal/DetailModal';
import UpdateModal from '@/pages/Devtools/DataDict/Modal/UpdateModal';
import DataDictItem from './DataDictItem/index';
import CreateSubItemModal from '@/pages/Devtools/DataDict/Modal/CreateSubItemModal';

@connect(({ global, dataDict: { paging }, loading, ...rest }) => {
  return {
    pagingDataDict: paging,
    pagingLoading: loading.effects['role/paging'],
  };
}, dispatch => ({
  $pagingDataDict: (args = {}) => dispatch({ type: 'dataDict/paging', ...args }),
  $deletesDataDict: (args = {}) => dispatch({ type: 'dataDict/deletes', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
    visibleCreateSubItem: false,
  };

  componentDidMount() {
    this.paging();
  }

  componentDidUpdate() {
    // window.removeEventListener('resize', this.handleResize);
  }


  tableColumns = [{
    title: '字典名称',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '字典码',
    dataIndex: 'code',
    key: 'code',
  }, {
    title: '启用状态',
    dataIndex: 'enabledName',
    key: 'enabledName',
    render: (val, { enabled }) => <Badge status={['error', 'success'][enabled]} text={val}/>,
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
  },
    {
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
          <Menu.Item key="rowCreateSubItem">新增字典项</Menu.Item>
          <Menu.Divider/>
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

  expandedRowRender = () => {
    return {
      rowExpandable: ({ items }) => items.length > 0,
      expandedRowRender: (record) => {
        return (<DataDictItem record={record} paging={this.paging}/>);
      },
    };
  };

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleCreateSubItem, operateRow } = this.state;
    let { pagingDataDict, pagingLoading } = this.props;
    const BatchMenus = (
      <Menu onClick={this.onClickMenuBatchItem}>
        <Menu.Item key="delete">删除选中项</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.page}>
        <ComplexTable toolbarTitle={'数据字典列表'}
                      expandable={this.expandedRowRender()}
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
                        list: UiUtils.fastGetPagingList(pagingDataDict),
                        pagination: UiUtils.fastPagingPagination(pagingDataDict),
                      }}
                      selectedRows={selectedRows}
                      onSelectRow={this.onChangeSelectRow}
                      onClickSearch={this.onClickSearch}
                      onChangeStandardTable={this.onChangeStandardTable}
                      tableColumns={this.tableColumns}
        />
        <CreateModal visible={visibleCreate}
                     onClose={this.onClickCloseCreateModal}/>
        {visibleDetail && <DetailModal visible={visibleDetail}
                                       id={operateRow}
                                       onClose={this.onClickCloseDetailModal}/>}
        {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                       id={operateRow}
                                       onClose={this.onClickCloseUpdateModal}/>}
        {visibleCreateSubItem && <CreateSubItemModal visible={visibleCreateSubItem}
                                                     id={operateRow}
                                                     onClose={this.onClickCloseCreateSubItemModal}/>}
      </div>
    );
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
   * 【批量操作】点击菜单
   * @param rest
   */
  onClickMenuBatchItem = ({ key }) => {
    switch (key) {
      case 'delete': {
        this.onClickShowDeleteModal(this.state.selectedRows || []);
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
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    switch (key) {
      case 'rowDelete': {
        this.onClickShowDeleteModal([this.state.operateRow]);
        break;
      }
      case 'rowDetail': {
        this.setState({
          visibleDetail: true,
        });
        break;
      }
      case 'rowUpdate': {
        this.setState({
          visibleUpdate: true,
        });
        break;
      }
      case 'rowCreateSubItem': {
        this.setState({
          visibleCreateSubItem: true,
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
    let { $pagingDataDict } = this.props;
    $pagingDataDict({
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


  onClickShowDeleteModal = (ids = []) => {
    let { $deletesDataDict } = this.props;
    let paging = this.paging;
    let props = {
      content: `确认删除选中数据字典?`,
      onCancel() {
        Modal.destroyAll();
      },
    };

    if (ids.length > 1) {
      props = {
        ...props,
        onOk() {
          $deletesDataDict({
            payload: {
              id: ids,
              force: true,
            },
            callback: paging,
          });
        },
      };
    } else {
      props = {
        ...props,
        content: `确认删除该数据字典?`,
        onOk() {
          $deletesDataDict({
            payload: {
              id: ids,
              force: true,
            },
            callback: paging,
          });
        },
      };
    }
    Modal.confirm(props);
  };

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });

  onClickCloseCreateModal = () => {
    this.setState({
      visibleCreate: false,
    }, this.paging);
  };

  onClickCloseCreateSubItemModal = () => this.setState({
    visibleCreateSubItem: false,
  }, this.paging);

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.paging);
  };

  onClickShowDetailModal = (id) => {
    this.setState({
      visibleDetail: true,
    });
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
