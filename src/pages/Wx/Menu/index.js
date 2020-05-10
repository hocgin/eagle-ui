import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Tooltip } from 'antd';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';
import CreateModal from '@/pages/Devtools/Settings/Modal/CreateModal';
import UpdateModal from '@/pages/Devtools/Settings/Modal/UpdateModal';
import DetailModal from '@/pages/Devtools/Settings/Modal/DetailModal';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';


@connect(({ global, wxMpMenu: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['wxMpMenu/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpMenu/paging', ...args }),
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
    title: '标题',
    dataIndex: 'title',
    fixed: 'title',
    key: 'title',
    ellipsis: true,
    render: (val, { remark }) => <Tooltip placement="top" title={`${remark}`}>{val}</Tooltip>,
  }, {
    title: 'APP ID',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '菜单类型',
    dataIndex: 'menuTypeName',
    key: 'menuTypeName',
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
          <a href={null} rel="noopener noreferrer">
            更多操作 <DownOutlined/>
          </a>
        </Dropdown>
      </>;
    },
  }];

  render() {
    let { selectedRows, visibleCreate, visibleDetail, visibleUpdate, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'微信菜单配置'}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={<Button htmlType="button" icon={<PlusOutlined/>} type="primary"
                                             onClick={this.onClickShowCreateModal}>新建</Button>}
                    searchBarChildren={[
                      <Form.Item key="keyword" label="关键词搜索" name="keyword">
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
      {visibleCreate && <CreateModal visible={visibleCreate}
                                     onClose={this.onClickCloseCreateModal}/>}
      {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                     id={operateRow}
                                     onClose={this.onClickCloseUpdateModal}/>}
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
      case 'rowUpdate': {
        this.setState({
          visibleUpdate: true,
        });
        break;
      }
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

  onClickShowCreateModal = () => {
    this.setState({
      visibleCreate: true,
    });
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
