import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { Avatar, Button, Card, Menu, Modal } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import Description from '@/components/DescriptionList/Description';
import UiUtils from '@/utils/UiUtils';
import { PlusOutlined } from '@ant-design/icons';
import ComplexTable from '@/components/ComplexTable';
import ChooseAccountModal from '@/pages/Ums/Group/Modal/ChooseAccountModal';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

const tabList = [{
  key: 'tab1',
  tab: '详情',
}];

@connect(({ global, accountGroup: { detail, pagingMembers }, loading, ...rest }) => {
  return {
    detail: detail || {},
    pagingMembers: pagingMembers,
    detailLoading: loading.effects['accountGroup/getOne'],
    pagingWithMemberLoading: loading.effects['accountGroup/pagingWithMember'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'accountGroup/getOne', ...args }),
  $pagingWithMember: (args = {}) => dispatch({ type: 'accountGroup/pagingWithMember', ...args }),
  $deleteWithMember: (args = {}) => dispatch({ type: 'accountGroup/deleteWithMember', ...args }),
}))
class index extends React.Component {
  state = {
    selectedRows: [],
    operationKey: 'tab1',
    visibleChoose: false,
  };

  render() {
    let { detailLoading, detail: { title } } = this.props;
    let { operationKey } = this.state;
    return (<PageHeaderWrapper wrapperClassName={styles.page}
                               title={`组名称: ${title}`}
                               content={this.renderPageHeaderContent()}
                               loading={detailLoading}
                               tabActiveKey={operationKey}
                               tabList={tabList}>
      <Card bordered={false}>
        {this.renderCardContent(operationKey)}
      </Card>
    </PageHeaderWrapper>);
  }

  renderPageHeaderContent = () => {
    const { detail } = this.props;
    let {
      createdAt, groupTypeName, memberSourceName, creatorName, lastUpdatedAt, lastUpdaterName, remark,
    } = detail;
    return (<DescriptionList size="small" col="2">
      <Description term="组类型">{groupTypeName}</Description>
      <Description term="组员来源">{memberSourceName}</Description>
      <Description term="描述">{remark}</Description>
      <Description term="创建人">{creatorName}</Description>
      <Description term="创建时间">{DateFormatter.timestampAs(createdAt)}</Description>
      <Description term="最后更新人">{lastUpdaterName || 'N/A'}</Description>
      <Description term="最后更新时间">{DateFormatter.timestampAs(lastUpdatedAt)}</Description>
    </DescriptionList>);
  };

  renderCardContent = (key) => {
    return {
      'tab1': this.renderTab1,
    }[key]();
  };

  renderTab1 = () => {
    const { pagingWithMemberLoading, pagingMembers, detail: { id } } = this.props;
    const tableColumns = [{
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      fixed: 'left',
      render: (avatar) => <Avatar alt="头像" src={avatar}/>,
    }, {
      title: '成员名',
      dataIndex: 'accountName',
      key: 'accountName',
    }, {
      title: '登录名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '邮箱号',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '启用状态',
      dataIndex: 'enabledName',
      key: 'enabledName',
      render: (val, { enabled }) => EnumFormatter.enabledStatus(enabled, val),
    }, {
      title: '过期状态',
      dataIndex: 'expiredName',
      key: 'expiredName',
      render: (val, { expired }) => EnumFormatter.expiredStatus(expired, val),
    }, {
      title: '锁定状态',
      dataIndex: 'lockedName',
      key: 'lockedName',
      render: (val, { locked }) => EnumFormatter.lockedStatus(locked, val),
    }, {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        const onClickOperateRow = (record, e) => {
          this.setState({
              operateRow: record.accountId,
            },
            () => {
              this.onClickMenuRowItem(e, record);
            });
        };
        return <>
          <a href={null}
             rel="noopener noreferrer"
             onClick={onClickOperateRow.bind(this, record, { key: 'rowDelete' })}>移出分组</a>
        </>;
      },
    }];
    let { selectedRows, visibleChoose } = this.state;
    const BatchMenus = (
      <Menu onClick={this.onClickMenuRowItem}>
        <Menu.Item key="rowsDelete">批量移出</Menu.Item>
      </Menu>
    );
    return (<>
      <ComplexTable toolbarTitle={'组员'}
                    rowKey={'accountId'}
                    selectedRows={selectedRows}
                    searchBarEnabled={false}
                    toolbarMenu={BatchMenus}
                    onSelectRow={this.onChangeSelectRow}
                    toolbarChildren={<Button htmlType="button" icon={<PlusOutlined/>} type="primary"
                                             onClick={this.onShowChooseAccountModal}>新建</Button>}
                    tableLoading={pagingWithMemberLoading}
                    tableData={{
                      list: UiUtils.fastGetPagingList(pagingMembers),
                      pagination: UiUtils.fastPagingPagination(pagingMembers),
                    }}
                    onChangeStandardTable={this.onChangeStandardTable}
                    tableColumns={tableColumns}/>
      <ChooseAccountModal visible={visibleChoose} id={id}
                          onClose={this.onCloseChooseAccountModal}/>
    </>);
  };

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    switch (key) {
      case 'rowDelete': {
        this.onShowDeleteConfirm([this.state.operateRow]);
        break;
      }
      case 'rowsDelete': {
        this.onShowDeleteConfirm([...this.state.selectedRows]);
        break;
      }
      default: {
        Modal.error({
          content: '无效操作',
        });
      }
    }
  };

  onShowDeleteConfirm = (members = []) => {
    let { detail: { id }, $deleteWithMember } = this.props;
    let pagingWithMember = this.pagingWithMember;
    Modal.confirm({
      content: '确定移除组员?',
      okText: '确定',
      cancelText: '取消',
      onCancel() {
        Modal.destroyAll();
      },
      onOk() {
        $deleteWithMember({ payload: { groupId: id, members: [...members] }, callback: pagingWithMember });
      },
    });
  };

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ accountId }) => accountId);
    this.setState({
      selectedRows: rowsId,
    });
  };

  onChangeStandardTable = ({ pageSize, current }, filtersArg, sorter) => {
    let { searchValue } = this.state;
    this.setState({
      searchValue: {
        ...searchValue,
        size: pageSize,
        page: current,
      },
    }, this.pagingWithMember);
  };

  pagingWithMember = () => {
    let { searchValue } = this.state;
    let { detail: { id }, $pagingWithMember } = this.props;
    $pagingWithMember({
      payload: { ...searchValue, groupId: id },
    });
  };

  onCloseChooseAccountModal = () => this.setState({
    visibleChoose: false,
  }, this.pagingWithMember);

  onShowChooseAccountModal = () => this.setState({
    visibleChoose: true,
  });

}

export default index;
