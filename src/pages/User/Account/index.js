import React from 'react';
import styles from './index.less';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import DetailModal from '@/pages/User/Account/Modal/DetailModal';
import UpdateModal from '@/pages/Access/Role/Modal/UpdateModal';
import GrantModal from '@/pages/User/Account/Modal/GrantModal';

@connect(({ global, account: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['account/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'account/paging', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleUpdate: false,
    visibleDetail: false,
    visibleGrant: false,
  };

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  }, {
    title: '登录名',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '邮箱号',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '启用状态',
    dataIndex: 'enabledName',
    key: 'enabledName',
    render: (val, { enabled }) => <Badge status={['error', 'success'][enabled]} text={val}/>,
  }, {
    title: '过期状态',
    dataIndex: 'expiredName',
    key: 'expiredName',
    render: (val, { expired }) => <Badge status={['error', 'success'][expired]} text={val}/>,
  }, {
    title: '锁定状态',
    dataIndex: 'lockedName',
    key: 'lockedName',
    render: (val, { locked }) => <Badge status={['error', 'success'][locked]} text={val}/>,
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
        <Menu.Item key="rowGrant">赋予角色</Menu.Item>
        <Menu.Item key="rowUpdate">
          <del>修改</del>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="rowReset">
          <del>重制密码</del>
        </Menu.Item>
        <Menu.Divider/>
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
    const BatchMenus = null;
    return (<div className={styles.page}>
        <ComplexTable toolbarTitle={'账号列表'}
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
        {visibleDetail && <DetailModal visible={visibleDetail}
                                       id={operateRow}
                                       onClose={this.onClickCloseDetailModal}/>}
        {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                       id={operateRow}
                                       onClose={this.onClickCloseUpdateModal}/>}
        {visibleGrant && <GrantModal visible={visibleGrant}
                                     id={operateRow}
                                     onClose={this.onClickCloseGrantModal}/>}
      </div>);
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
