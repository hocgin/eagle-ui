import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/Config/Modal/DetailModal';
import CreateModal from '@/pages/Wx/Config/Modal/CreateModal';
import UpdateModal from '@/pages/Wx/Config/Modal/UpdateModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';

@connect(({ global, wxMpConfig: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['wxMpConfig/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpConfig/paging', ...args }),
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
    title: 'APP ID',
    dataIndex: 'appid',
    key: 'appid',
    fixed: 'left',
  }, {
    title: '公众号标题(自有)',
    dataIndex: 'title',
    key: 'title',
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
  }, {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    render: (text, record) => {
      const onClickOperateRow = (record, e) => {
        this.setState({
            operateRow: record.appid,
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
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleGrant, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'微信公众号列表'}
                    rowKey={`appid`}
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
      {visibleCreate && <CreateModal visible={visibleCreate}
                                     onClose={this.onClickCloseCreateModal}/>}
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

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.paging);
  };

  onClickCloseCreateModal = () => {
    this.setState({
      visibleCreate: false,
    }, this.paging);
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
