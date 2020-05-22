import React from 'react';
import styles from './index.less';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Select, Tooltip } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateModal from '@/pages/Wx/ReplyRule/Modal/CreateModal';
import UpdateModal from '@/pages/Wx/ReplyRule/Modal/UpdateModal';
import DetailModal from '@/pages/Wx/ReplyRule/Modal/DetailModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { WxReplyRule } from '@/pages/Wx/ReplyRule/WxReplyRule';

@connect(({ global, wxMpReplyRule: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    allMpConfig: all,
    paging: paging,
    pagingLoading: loading.effects['wxMpReplyRule/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpReplyRule/paging', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
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
    title: '规则名称',
    dataIndex: 'title',
    fixed: 'left',
    key: 'title',
    ellipsis: true,
    render: (val, { remark }) => <Tooltip placement="top" title={`${remark}`}>{val}</Tooltip>,
  }, {
    title: '匹配类型',
    dataIndex: 'matchMsgTypeName',
    key: 'matchMsgTypeName',
  }, {
    title: '回复类型',
    dataIndex: 'replyMsgTypeName',
    key: 'replyMsgTypeName',
  }, {
    title: '回复内容',
    dataIndex: 'replyContent',
    key: 'replyContent',
    render: (val, { replyMsgType }) => WxReplyRule.getReplyContent(replyMsgType, val),
  }, {
    title: '优先级',
    dataIndex: 'sort',
    key: 'sort',
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
      <ComplexTable toolbarTitle={<>回复规则 {this.renderAppIdWithSelect()}</>}
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
