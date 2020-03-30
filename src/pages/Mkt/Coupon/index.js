import React from 'react';
import styles from './index.less';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Mkt/Coupon/Modal/CreateModal';
import UpdateModal from '@/pages/Access/Role/Modal/UpdateModal';
import GrantModal from '@/pages/Access/Role/Modal/GrantModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { LangFormatter } from '@/utils/formatter/LangFormatter';
import Goto from '@/utils/Goto';

@connect(({ global, coupon: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['coupon/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'coupon/paging', ...args }),
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

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '优惠券名称',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '优惠类型',
    dataIndex: 'couponTypeName',
    key: 'couponTypeName',
  }, {
    title: '可用范围',
    dataIndex: 'useTypeName',
    key: 'useTypeName',
  }, {
    title: '使用门槛',
    dataIndex: 'minPoint',
    key: 'minPoint',
    render: (val) => LangFormatter.formatRMB(val),
  }, {
    title: '折扣',
    dataIndex: 'credit',
    key: 'credit',
    render: (val, { couponType }) => {
      let v = val;
      if (couponType === 0) {
        v = LangFormatter.formatRMB(v);
      } else {
        v = `${v * 100} 折`;
      }
      return v;
    },
  }, {
    title: '适用平台',
    dataIndex: 'platformName',
    key: 'platformName',
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
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
          <Menu.Item key="rowUpdate">
            <del>修改</del>
          </Menu.Item>
          <Menu.Item key="rowGrant">发送</Menu.Item>
          <Menu.Divider/>
          <Menu.Item key="rowDelete">
            <del>禁止派发</del>
          </Menu.Item>
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
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'优惠券列表'}
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
      <CreateModal visible={visibleCreate}
                   onClose={this.onClickCloseCreateModal}/>
      {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                     id={operateRow}
                                     onClose={this.onClickCloseUpdateModal}/>}
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
    let { operateRow } = this.state;
    switch (key) {
      case 'rowDelete': {
        this.onClickShowDeleteModal([this.state.operateRow]);
        break;
      }
      case 'rowDetail': {
        Goto.couponDetail(operateRow);
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
    $paging({ payload: { ...searchValue } });
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

  onClickCloseCreateModal = () => {
    this.setState({
      visibleCreate: false,
    }, this.paging);
  };

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
