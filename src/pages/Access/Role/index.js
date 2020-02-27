import React from 'react';
import styles from './index.less';
import { Badge, Button, Divider, Dropdown, Form, Icon, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Access/Role/Modal/CreateModal';
import DetailModal from '@/pages/Access/Role/Modal/DetailModal';

@connect(({ global, role: { paging }, loading, ...rest }) => {
  return {
    pagingRole: paging,
    pagingLoading: loading.effects['role/paging'],
  };
}, dispatch => ({
  $pagingRole: (args = {}) => dispatch({ type: 'role/paging', ...args }),
  $deleteRole: (args = {}) => dispatch({ type: 'role/delete', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
  };

  componentDidMount() {
    let { $pagingRole } = this.props;
    $pagingRole();
  }

  componentWillUnmount() {
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
      render: (text, record) => {
        const MoreMenus = (<Menu>
          <Menu.Item key="edit">修改</Menu.Item>
          <Menu.Item key="setRoles">赋予权限</Menu.Item>
          <Menu.Item>查询关联账号</Menu.Item>
          <Menu.Divider/>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>);
        return (<>
          <a onClick={this.onClickShowDetailModal.bind(this, record.id)}>查看详情</a>
          <Divider type="vertical"/>
          <Dropdown overlay={MoreMenus}>
            <a className="ant-dropdown-link">
              更多操作 <Icon type="down"/>
            </a>
          </Dropdown>
        </>);
      },
    }];

  render() {
    let { selectedRows, visibleCreate, visibleDetail } = this.state;
    let { pagingRole, pagingLoading } = this.props;
    const BatchMenus = (
      <Menu onClick={this.onClickMenuItem}>
        <Menu.Item key="delete">删除角色</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.page}>
        <ComplexTable toolbarTitle={'角色列表'}
                      toolbarMenu={BatchMenus}
                      toolbarChildren={<Button htmlType="button" icon="plus" type="primary"
                                               onClick={this.onClickShowCreateModal}>新建</Button>}
                      searchBarChildren={form => [
                        <Form.Item label="关键词搜索">
                          {form.getFieldDecorator('keyword')(
                            <Input style={{ width: '100%' }}
                                   placeholder="请输入关键词"
                            />,
                          )}
                        </Form.Item>,
                      ]}
                      tableLoading={pagingLoading}
                      tableData={{
                        list: UiUtils.fastGetPagingList(pagingRole),
                        pagination: UiUtils.fastPagingPagination(pagingRole),
                      }}
                      selectedRows={selectedRows}
                      onSelectRow={this.onChangeSelectRow}
                      onClickSearch={this.onClickSearch}
                      tableColumns={this.tableColumns}
        />
        <CreateModal visible={visibleCreate}
                     onClose={this.onClickCloseCreateModal}/>
        {visibleDetail && <DetailModal visible={visibleDetail}
                                       id={selectedRows[0]}
                                       onClose={this.onClickCloseDetailModal}/>}
      </div>
    );
  }

  /**
   * 点击菜单
   * @param rest
   */
  onClickMenuItem = ({ key }) => {
    switch (key) {
      case 'update': {
        this.onClickShowUpdateModal();
        break;
      }
      case 'delete': {
        this.onClickShowDeleteModal();
        break;
      }
      case 'detail': {
        this.onClickShowDetailModal();
        break;
      }
      case 'add':
      default: {
        this.onClickShowCreateModal(true);
      }
    }
  };

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
    let { $pagingRole } = this.props;
    $pagingRole({
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


  onClickShowDeleteModal = () => {
    let { $deleteRole } = this.props;
    let { selectedRows } = this.state;
    if (selectedRows.length > 1) {
      Modal.warning({
        content: '暂不支持删除多个角色',
      });
      return;
    }

    const id = selectedRows[0];
    let paging = this.paging;
    Modal.confirm({
      content: `确认删除选中角色?`,
      onOk() {
        $deleteRole({
          payload: {
            id,
          },
          callback: paging,
        });
      },
      onCancel() {
        Modal.destroyAll();
      },
    });

  };

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });

  onClickShowUpdateModal = () => this.setState({
    visibleUpdate: true,
  });

  onClickCloseCreateModal = () => {
    this.setState({
      visibleCreate: false,
    }, this.paging);
  };

  onClickCloseUpdateModal = () => {
    let { $getAuthorityTree } = this.props;
    $getAuthorityTree();
    this.setState({
      visibleUpdate: false,
    });
  };

  onClickShowDetailModal = (id) => {
    let state = {
      visibleDetail: true,
    };
    if (id) {
      state = {
        ...state,
        selectedRows: [id],
      };
    }

    this.setState(state);
  };

  onClickCloseDetailModal = () => {
    this.setState({
      selectedRows: [],
      visibleDetail: false,
    });
  };
}

export default index;
