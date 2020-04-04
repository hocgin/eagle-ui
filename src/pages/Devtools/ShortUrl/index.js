import React from 'react';
import styles from './index.less';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Tooltip } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Devtools/ShortUrl/Modal/CreateModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';

@connect(({ global, shortUrl: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['shortUrl/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'shortUrl/paging', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'shortUrl/update', ...args }),
}))
class index extends React.Component {

  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleCreate: false,
  };

  componentDidMount() {
    this.paging();
  }

  tableColumns = [{
    title: '原链接',
    dataIndex: 'originalUrl',
    fixed: 'left',
    key: 'originalUrl',
    ellipsis: true,
    render: (val) => <Tooltip placement="top" title={`${val}`}>{val}</Tooltip>,
  }, {
    title: '短链码',
    dataIndex: 'code',
    key: 'code',
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
        <Menu.Item key="rowEnabled">启用</Menu.Item>
        <Menu.Item key="rowDisabled">禁用</Menu.Item>
      </Menu>);

      return <>
        <a href={`${record.originalUrl}`} target="_blank" rel="noopener noreferrer">访问链接</a>
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
    let { selectedRows, visibleCreate, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'短链接列表'}
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
      case 'rowEnabled': {
        this.onClickShowUpdateModal([this.state.operateRow], true);
        break;
      }
      case 'rowDisabled': {
        this.onClickShowUpdateModal([this.state.operateRow], false);
        break;
      }
      default: {
        Modal.error({
          content: '无效操作',
        });
      }
    }
  };

  onClickShowUpdateModal = (ids = [], isEnabled = true) => {
    let { $updateOne } = this.props;
    let callback = this.paging;
    let title = '请确认正在进行的操作?';
    let props = {
      content: title,
      okText: '确定',
      cancelText: '取消',
      onCancel() {
        Modal.destroyAll();
      },
    };

    Modal.confirm({
      ...props,
      content: title,
      onOk() {
        $updateOne({ payload: { id: ids[0], enabled: isEnabled ? 1 : 0 }, callback: callback });
      },
    });
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
  onClickShowCreateModal = () => {
    this.setState({
      visibleCreate: true,
    });
  };
}

export default index;
