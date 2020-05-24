import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Button, Divider, Dropdown, Form, Input, Menu, message, Modal, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/UserTags/Modal/DetailModal';
import CreateModal from '@/pages/Wx/UserTags/Modal/CreateModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';

@connect(({ global, wxMpUserTags: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    pagingLoading: loading.effects['wxMpUserTags/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpUserTags/paging', ...args }),
  $deleteOne: (args = {}) => dispatch({ type: 'wxMpUserTags/delete', ...args }),
  $refresh: (args = {}) => dispatch({ type: 'wxMpUserTags/refresh', ...args }),
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
    title: '标签ID',
    dataIndex: 'tagId',
    key: 'tagId',
    fixed: 'left',
  }, {
    title: 'AppID',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '标签名称',
    dataIndex: 'name',
    key: 'name',
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
        <Menu.Item key="rowDelete">
          删除标签
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
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, searchValue: { appid }, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    let toolbarChildren = (<>
      <Button htmlType="button" type="primary" onClick={this.onClickShowSyncModal} danger>同步标签</Button>
      <Button htmlType="button" type="primary" onClick={this.onClickShowCreateModal}>新建标签</Button>
    </>);
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>用户标签 {this.renderAppIdWithSelect()}</>}
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
      <CreateModal visible={visibleCreate}
                   appid={appid}
                   onClose={this.onClickCloseCreateModal}/>
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
      case 'rowDelete': {
        let { $deleteOne } = this.props;
        UiUtils.showConfirmModal({ ids: [this.state.operateRow], dispatch: $deleteOne, callback: this.paging });
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
    let { $refresh } = this.props;
    if (!(appid ?? false)) {
      message.error('请选择公众号');
      return;
    }

    let props = {
      content: `确认是否同步标签?`,
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

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };

  onClickCloseCreateModal = () => this.setState({
    visibleCreate: false,
  }, this.paging);

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });
}

export default index;
