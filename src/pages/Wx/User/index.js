import React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Select } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import DetailModal from '@/pages/Wx/User/Modal/DetailModal';
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
        <Menu.Item key="rowRefresh">
          <del>刷新用户信息</del>
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
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleGrant, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<span>微信用户列表</span>}
                    rowKey={`appid`}
                    toolbarMenu={BatchMenus}
                    searchBarChildren={[
                      <Form.Item label="公众号" name="appid">
                        {this.renderAppIdWithSelect()}
                      </Form.Item>,
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
    </PageHeaderWrapper>);
  }

  renderAppIdWithSelect() {
    let { allMpConfig = [] } = this.props;

    return (<Select defaultValue={null}>
      <Select.Option>全部</Select.Option>
      {(allMpConfig || []).map(({ appid, title }) => <Select.Option value={appid}>{title}</Select.Option>)}
    </Select>);
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

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
