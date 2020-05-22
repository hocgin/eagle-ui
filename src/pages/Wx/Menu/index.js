import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Button, Divider, Dropdown, Form, Input, Menu, message, Modal, Select, Tooltip } from 'antd';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';
import Goto from '@/utils/Goto';


@connect(({ global, wxMpMenu: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    pagingLoading: loading.effects['wxMpMenu/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpMenu/paging', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
  $sync: (args = {}) => dispatch({ type: 'wxMpMenu/sync', ...args }),
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
    let { $getAllWithWxMpConfig } = this.props;
    $getAllWithWxMpConfig();
    this.paging();
  }

  tableColumns = [{
    title: '标题',
    dataIndex: 'title',
    fixed: 'left',
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
        <Menu.Item key="rowSync">同步微信</Menu.Item>
      </Menu>);

      return <>
        <a href={null}
           rel="noopener noreferrer"
           onClick={onClickOperateRow.bind(this, record, { key: 'rowUpdate' })}>查看or更新</a>
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
    let toolbarChildren = (<>
        <Button htmlType="button" icon={<PlusOutlined/>} type="primary"
                onClick={this.onClickGotoCreate}>新建</Button>
      </>
    );
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>微信菜单配置 {this.renderAppIdWithSelect()}</>}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={toolbarChildren}
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
    </PageHeaderWrapper>);
  }

  renderAppIdWithSelect() {
    let { allMpConfig = [] } = this.props;
    return (<Select defaultValue={null} onSelect={this.onSelectAppId}>
      <Select.Option key={-1} value={null}>全部</Select.Option>
      {(allMpConfig || []).map(({ appid, title }, index) =>
        <Select.Option key={index} value={`${appid}`}>{title}</Select.Option>)}
    </Select>);
  }

  onSelectAppId = (value) => {
    this.setState(({ searchValue }) => ({
      searchValue: { ...searchValue, appid: value },
    }));
  };

  /**
   * 条件变更
   * @param pageSize
   * @param current
   * @param filtersArg
   * @param sorter
   */
  onChangeStandardTable = ({ pageSize, current }, filtersArg, sorter) => {
    this.setState(({ searchValue }) => ({
      searchValue: {
        ...searchValue,
        size: pageSize,
        page: current,
      },
    }), this.paging);
  };

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    switch (key) {
      case 'rowSync': {
        this.onClickShowSyncModal(this.state.operateRow);
        break;
      }
      case 'rowUpdate': {
        Goto.menuDetail(this.state.operateRow);
        break;
      }
      default: {
        Modal.error({
          content: '无效操作',
        });
      }
    }
  };

  onClickShowSyncModal = (id) => {
    let { $sync } = this.props;
    let paging = this.paging;
    let props = {
      content: `确认上传菜单配置到微信服务器?`,
      onOk() {
        $sync({
          payload: { id: id }, callback: () => {
            message.success('同步成功');
            paging();
          },
        });
      },
    };
    Modal.confirm(props);
  };

  /**
   * 点击查询按钮
   * @param values
   */
  onClickSearch = (values) => {
    this.setState(({ searchValue }) => ({
      searchValue: {
        ...searchValue,
        ...values,
      },
    }), this.paging);
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

  onClickGotoCreate = () => {
    let { searchValue: { appid = '' } } = this.state;
    Goto.menuAdd(appid);
  };

}

export default index;
