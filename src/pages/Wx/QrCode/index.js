import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Select } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/QrCode/Modal/DetailModal';
import CreateModal from '@/pages/Wx/QrCode/Modal/CreateModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import UiUtils from '@/utils/UiUtils';

@connect(({ global, wxMpQrcode: { paging }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    pagingLoading: loading.effects['wxMpQrcode/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpQrcode/paging', ...args }),
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
  };

  componentDidMount() {
    let { $getAllWithWxMpConfig } = this.props;
    $getAllWithWxMpConfig();
    this.paging();
  }

  tableColumns = [{
    title: '二维码',
    dataIndex: 'qrcodeUrl',
    key: 'qrcodeUrl',
    fixed: 'left',
    render: val => <img src={val} alt="二维码" width={80}/>,
  }, {
    title: 'AppID',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '场景值',
    dataIndex: 'sceneStr',
    key: 'sceneStr',
    render: (val, { sceneId }) => sceneId ?? val,
  }, {
    title: '过期时间',
    dataIndex: 'expireAt',
    key: 'expireAt',
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
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
        <Menu.Item key="rowDelete">
          <del>删除</del>
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
    let { selectedRows, visibleCreate, searchValue: { appid }, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    let toolbarChildren = (<>
      <Button htmlType="button" type="primary" icon={<PlusOutlined/>} onClick={this.onClickShowCreateModal}>新建</Button>,
    </>);
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>二维码 {this.renderAppIdWithSelect()}</>}
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

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ id }) => id);
    this.setState({
      selectedRows: rowsId,
    });
  };

  onClickCloseDetailModal = () => this.setState({
    visibleDetail: false,
  });

  onClickCloseCreateModal = () => this.setState({
    visibleCreate: false,
  }, this.paging);

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });
}

export default index;
