import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Divider, Dropdown, Form, Input, Menu, message, Modal, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/MessageTemplate/Modal/DetailModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';
import SendTemplateMessageModal from '@/pages/Wx/MessageTemplate/Modal/SendTemplateMessageModal';

@connect(({ global, wxMpMessageTemplate: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    pagingLoading: loading.effects['wxMpMessageTemplate/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpMessageTemplate/paging', ...args }),
  $refresh: (args = {}) => dispatch({ type: 'wxMpMessageTemplate/refresh', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
}))
class index extends React.Component {
  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    operateAppid: null,
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
    visibleSendTemplateMessage: false,
  };

  componentDidMount() {
    let { $getAllWithWxMpConfig } = this.props;
    $getAllWithWxMpConfig();
    this.paging();
  }

  tableColumns = [{
    title: '模版ID',
    dataIndex: 'templateId',
    key: 'templateId',
    fixed: 'left',
  }, {
    title: '模版标题',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '消息模版',
    dataIndex: 'content',
    key: 'content',
  }, {
    title: 'AppID',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '一级行业',
    dataIndex: 'primaryIndustry',
    key: 'primaryIndustry',
  }, {
    title: '二级行业',
    dataIndex: 'deputyIndustry',
    key: 'deputyIndustry',
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
            operateAppid: record.appid,
          },
          () => {
            this.onClickMenuRowItem(e, record);
          });
      };

      const MoreMenus = (<Menu onClick={onClickOperateRow.bind(this, record)}>
        <Menu.Item key="rowSendTemplateMessage">发送模版消息</Menu.Item>
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
    let { selectedRows, visibleCreate, operateAppid, visibleDetail, visibleSendTemplateMessage, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    let toolbarChildren = (<>
      <Button htmlType="button" type="primary" onClick={this.onClickShowSyncModal} danger>同步消息模版</Button>,
    </>);
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>消息模版 {this.renderAppIdWithSelect()}</>}
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
      {visibleSendTemplateMessage && <SendTemplateMessageModal visible={visibleSendTemplateMessage}
                                                               id={operateRow}
                                                               onClose={this.onClickCloseSendTemplateMessageModal}/>}
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
        this.setState({ visibleDetail: true });
        break;
      }
      case 'rowSendTemplateMessage': {
        this.setState({ visibleSendTemplateMessage: true });
        break;
      }
      default: {
        Modal.error({ content: '无效操作' });
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
    let { $refresh } = this.props;
    if (!(appid ?? false)) {
      message.error('请选择公众号');
      return;
    }

    let props = {
      content: `确认是否同步消息模版?`,
      onCancel() {
        Modal.destroyAll();
      },
      onOk() {
        $refresh({ payload: { appid: appid }, callback: message.success('操作成功，请稍后') });
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

  onClickCloseSendTemplateMessageModal = () => this.setState({
    visibleSendTemplateMessage: false,
  });

  onClickShowSendTemplateMessageModal = () => this.setState({
    visibleSendTemplateMessage: true,
  });
}

export default index;
