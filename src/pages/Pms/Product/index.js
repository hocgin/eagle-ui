import React from 'react';
import styles from './index.less';
import ComplexTable from '@/components/ComplexTable';
import { Badge, Button, Divider, Dropdown, Form, Input, Menu, Modal } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import UiUtils from '@/utils/UiUtils';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import CreateStepModal from '@/pages/Pms/Product/Modal/CreateStepModal';
import Img from 'react-image';
import DetailModal from '@/pages/Pms/Product/Modal/DetailModal';
import UpdateStepModal from '@/pages/Pms/Product/Modal/UpdateStepModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


@connect(({ global, product: { paging }, loading, ...rest }) => {
  return {
    paging: paging,
    pagingLoading: loading.effects['product/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'product/paging', ...args }),
  $deleteOne: (args = {}) => dispatch({ type: 'product/delete', ...args }),
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

  tableColumns = [{
    title: '商品图片',
    dataIndex: 'photos',
    key: 'photos',
    render: val => <Img src={val.length > 0 && val[0].url}/>,
  }, {
    title: '商品标题',
    dataIndex: 'title',
    key: 'title',
  }, {
    title: '商品品类',
    dataIndex: 'productCategoryName',
    key: 'productCategoryName',
  }, {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  }, {
    title: '上架状态',
    dataIndex: 'publishStatusName',
    key: 'publishStatusName',
    render: (val, { publishStatus }) => <Badge status={['error', 'success'][publishStatus]} text={val}/>,
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
            operateRow: record.id,
          },
          () => {
            this.onClickMenuRowItem(e, record);
          });
      };

      const MoreMenus = (<Menu onClick={onClickOperateRow.bind(this, record)}>
        <Menu.Item key="rowUpdate">修改</Menu.Item>
        <Menu.Item key="rowDetail">查看详情</Menu.Item>
        <Menu.Item key="rowDelete">删除</Menu.Item>
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

  componentDidMount() {
    this.paging();
  }

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading } = this.props;
    const BatchMenus = null;
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={'商品列表'}
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
      <CreateStepModal visible={visibleCreate}
                       onClose={this.onClickCloseCreateModal}/>
      {visibleDetail && <DetailModal visible={visibleDetail}
                                     id={operateRow}
                                     onClose={this.onClickCloseDetailModal}/>}
      {visibleUpdate && <UpdateStepModal visible={visibleUpdate}
                                         id={operateRow}
                                         onClose={this.onClickCloseUpdateModal}/>}
    </PageHeaderWrapper>);
  }

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
      case 'rowDelete': {
        this.onClickShowDeleteModal([this.state.operateRow]);
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
  onClickSearch = (values) => this.setState({
    searchValue: {
      ...values,
    },
  }, this.paging);

  onClickShowDeleteModal = (ids = []) => {
    let { $deleteOne } = this.props;
    let paging = this.paging;
    UiUtils.showConfirmModal({
      ids: ids,
      dispatch: $deleteOne,
      callback: paging,
    });
  };

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });

  onClickCloseCreateModal = () => this.setState({
    visibleCreate: false,
  }, this.paging);

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.paging);
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
