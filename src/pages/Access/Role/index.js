import React from 'react';
import styles from './index.less';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Access/Role/Modal/CreateModal';
import DetailModal from '@/pages/Access/Role/Modal/DetailModal';
import UpdateModal from '@/pages/Access/Role/Modal/UpdateModal';
import GrantModal from '@/pages/Access/Role/Modal/GrantModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

@connect(({ global, role: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['role/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'role/paging', ...args }),
  $delete: (args = {}) => dispatch({ type: 'role/delete', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
    visibleGrant: false,
  };

  componentDidMount() {
    this.paging();
  }

  componentDidUpdate() {
    // window.removeEventListener('resize', this.handleResize);
  }


  tableColumns = [{
    title: '角色名称',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '角色码',
    dataIndex: 'roleCode',
    key: 'roleCode',
  }, {
    title: '平台',
    dataIndex: 'platformName',
    key: 'platformName',
  }, {
    title: '启用状态',
    dataIndex: 'enabledName',
    key: 'enabledName',
    render: (val, { enabled }) => EnumFormatter.enabledStatus(enabled, val),
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
          <Menu.Item key="rowGrant">赋予权限</Menu.Item>
          <Menu.Item>
            <del>查询关联账号</del>
          </Menu.Item>
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

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleGrant, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = (
      <Menu onClick={this.onClickMenuBatchItem}>
        <Menu.Item key="delete">删除角色</Menu.Item>
      </Menu>
    );
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'角色列表'}
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
      {visibleGrant && <GrantModal visible={visibleGrant}
                                   id={operateRow}
                                   onClose={this.onClickCloseGrantModal}/>}
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
      case 'rowGrant': {
        this.setState({
          visibleGrant: true,
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
    $paging({ payload: { ...searchValue } });
  };

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ id }) => id);
    this.setState({
      selectedRows: rowsId,
    });
  };


  onClickShowDeleteModal = (ids = []) => {
    let { $delete } = this.props;
    let paging = this.paging;
    let props = {
      content: `确认删除选中角色?`,
      onCancel() {
        Modal.destroyAll();
      },
    };

    if (ids.length > 1) {
      // TODO
    } else {
      props = {
        content: `确认删除该角色?`,
        onOk() {
          $delete({
            payload: {
              id: ids[0],
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

  onClickCloseGrantModal = () => this.setState({
    visibleGrant: false,
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
