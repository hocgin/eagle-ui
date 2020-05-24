import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Divider, Dropdown, Form, Input, Menu, message, Modal, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/User/Modal/DetailModal';
import SendMessageToUserModal from '@/pages/Wx/User/Modal/SendMessageToUserModal';
import SendPreviewMessageModal from '@/pages/Wx/User/Modal/SendPreviewMessageModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';
import { WxEnum } from '@/pages/Wx/WxEnum';

@connect(({ global, wxMpUser: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    pagingLoading: loading.effects['wxMpUser/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpUser/paging', ...args }),
  $syncWxUser: (args = {}) => dispatch({ type: 'wxMpUser/refresh', ...args }),
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
    visibleSendMessageToUser: false,
    visibleSendPreviewMessage: false,
  };

  componentDidMount() {
    let { $getAllWithWxMpConfig } = this.props;
    $getAllWithWxMpConfig();
    this.paging();
  }

  tableColumns = [{
    title: '微信昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    fixed: 'left',
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: val => <span>{WxEnum.sex(val)}</span>,
  }, {
    title: '所在地',
    dataIndex: 'city',
    key: 'city',
    render: (city, { country, province }) => <span>{`${country} / ${province} / ${city}`}</span>,
  }, {
    title: '关注状态',
    dataIndex: 'subscribe',
    key: 'subscribe',
    render: val => <span>{WxEnum.subscribe(val)}</span>,
  }, {
    title: '第一次关注时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '关注时间',
    dataIndex: 'subscribeTime',
    key: 'subscribeTime',
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
        <Menu.Item key="row">
          <del>刷新用户信息</del>
        </Menu.Item>
        <Menu.Item key="rowSendMessage">发送消息</Menu.Item>
        <Menu.Item key="rowSendPreviewMessage">发送预览消息</Menu.Item>
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
    let { selectedRows, visibleSendPreviewMessage, visibleDetail, visibleSendMessageToUser, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    let toolbarChildren = (<>
      <Button htmlType="button" type="primary" onClick={this.onClickShowSyncModal} danger>同步用户列表</Button>
      <Button htmlType="button" type="primary">
        <del>群发消息</del>
      </Button>
    </>);
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>微信用户列表 {this.renderAppIdWithSelect()}</>}
                    rowKey={`appid`}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={toolbarChildren}
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
      {visibleSendMessageToUser && <SendMessageToUserModal visible={visibleSendMessageToUser}
                                                           onClose={this.onClickCloseSendMessageToUserModal}
                                                           toUsers={[operateRow]}/>}
      {visibleSendPreviewMessage && <SendPreviewMessageModal visible={visibleSendPreviewMessage}
                                                             onClose={this.onClickCloseSendPreviewMessageModal}
                                                             toUsers={[operateRow]}/>}
      {visibleDetail && <DetailModal visible={visibleDetail}
                                     id={operateRow}
                                     onClose={this.onClickCloseDetailModal}/>}
    </PageHeaderWrapper>);
  }

  renderAppIdWithSelect() {
    let { allMpConfig = [] } = this.props;

    return (<Select defaultValue={null} onSelect={this.onSelectAppId}>
      <Select.Option>全部</Select.Option>
      {(allMpConfig || []).map(({ appid, title }) => <Select.Option value={appid}>{title}</Select.Option>)}
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
      case 'rowDetail': {
        this.setState({
          visibleDetail: true,
        });
        break;
      }
      case 'rowSendMessage': {
        this.setState({
          visibleSendMessageToUser: true,
        });
        break;
      }
      case 'rowSendPreviewMessage': {
        this.setState({
          visibleSendPreviewMessage: true,
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

  onClickShowSyncModal = () => {
    let { searchValue: { appid } } = this.state;
    let { $syncWxUser } = this.props;
    if (!(appid ?? false)) {
      message.error('请选择公众号');
      return;
    }

    let props = {
      content: `确认是否同步微信用户列表?`,
      onCancel() {
        Modal.destroyAll();
      },
      onOk() {
        $syncWxUser({ payload: { appid: appid }, callback: message.success('操作成功，请稍后') });
      },
    };
    Modal.confirm(props);
  };

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ id }) => id);
    this.setState({
      selectedRows: rowsId,
    });
  };

  onClickCloseDetailModal = () => this.setState({
    visibleDetail: false,
  });

  onClickCloseSendMessageToUserModal = () => this.setState({
    visibleSendMessageToUser: false,
  });

  onClickCloseSendPreviewMessageModal = () => this.setState({
    visibleSendPreviewMessage: false,
  });

}

export default index;
