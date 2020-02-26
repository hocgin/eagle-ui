import React from 'react';
import styles from './index.less';
import { Button, Card, Menu, Modal, Tree } from 'antd';
import { connect } from 'dva';
import Toolbar from '@/components/Toolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import classnames from 'classnames';
import CreateModal from './Modal/CreateModal';
import UpdateModal from './Modal/UpdateModal';
import DetailModal from './Modal/DetailModal';
import GrantModal from './Modal/GrantModal';

const { TreeNode } = Tree;

@connect(({ global, authority: { authorityTree = [] }, loading, ...rest }) => {
  return {
    data: authorityTree,
  };
}, dispatch => ({
  $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
  $deleteAuthority: (args = {}) => dispatch({ type: 'authority/delete', ...args }),
}))
class index extends React.Component {
  state = {
    selectedRows: [],
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
    visibleGrant: false,
  };

  componentDidMount() {
    let { $getAuthorityTree } = this.props;
    $getAuthorityTree();
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }

  renderTreeNodes = data => {
    return (data || []).map(item => {
      if (item.children) {
        return (
          <TreeNode key={`${item.authorityCode}`} title={item.title} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={`${item.authorityCode}`} title={item.title} dataRef={item}/>;
    });
  };

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleGrant } = this.state;
    let { data } = this.props;
    const toolbarMenus = (
      <Menu onClick={this.onClickMenuItem}>
        <Menu.Item key="add">新增节点</Menu.Item>
        <Menu.Item key="update">修改节点</Menu.Item>
        <Menu.Item key="grant">赋予角色</Menu.Item>
        <Menu.Item key="detail">查看详情</Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="delete">删除节点</Menu.Item>
        <Menu.Item key="forceDelete">删除节点子树</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper className={styles.page}>
        <Card bordered={false}>
          {/*搜索栏*/}
          {/*<SearchBar className={styles.searchBar} onSubmit={null}>*/}
          {/*  {form => [*/}
          {/*    <Form.Item label="创建日期">*/}
          {/*      {form.getFieldDecorator('createdAt')(*/}
          {/*        <DatePicker*/}
          {/*          style={{ width: '100%' }}*/}
          {/*          placeholder="请输入更新日期"*/}
          {/*        />,*/}
          {/*      )}*/}
          {/*    </Form.Item>,*/}
          {/*  ]}*/}
          {/*</SearchBar>*/}
          {/*工具条*/}
          <div className={classnames(styles.toolbar, styles.toolbarExt)}>
            <div className={styles.toolbarTitle}>权限树</div>
            <Toolbar menu={toolbarMenus}
                     selectedRows={selectedRows}>
              <Button htmlType="button"
                      icon="plus"
                      onClick={this.onClickShowCreateModal}
                      type="primary">新建</Button>
              {/*<Divider type="vertical"/>*/}
            </Toolbar>
          </div>
          <Tree
            onSelect={this.onSelectRows}>
            {this.renderTreeNodes(data)}
          </Tree>
        </Card>
        <CreateModal visible={visibleCreate}
                     onClose={this.onClickCloseCreateModal}
                     parentId={selectedRows[0]}/>
        {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                       onClose={this.onClickCloseUpdateModal}
                                       id={selectedRows[0]}/>}
        {visibleDetail && <DetailModal visible={visibleDetail}
                                       onClose={this.onClickCloseDetailModal}
                                       id={selectedRows[0]}/>}
        {visibleGrant && <GrantModal visible={visibleGrant}
                                     onClose={this.onClickCloseGrantModal}
                                     id={selectedRows[0]}/>}
      </PageHeaderWrapper>
    );
  }

  // 选择树节点
  onSelectRows = (rows, target) => {
    let selectedRows = [];
    if (target.selected) {
      let selectNodeId = target.node.props.dataRef.id;
      selectedRows = [selectNodeId];
    }
    this.setState({
      selectedRows: selectedRows,
    });
  };

  /**
   * 点击菜单
   * @param rest
   */
  onClickMenuItem = ({ key }) => {

    switch (key) {
      case 'update': {
        this.onClickShowUpdateModal();
        break;
      }
      case 'delete': {
        this.onClickShowDeleteModal();
        break;
      }
      case 'forceDelete': {
        this.onClickShowDeleteModal();
        break;
      }
      case 'detail': {
        this.onClickShowDetailModal();
        break;
      }
      case 'grant': {
        this.onClickShowGrantModal();
        break;
      }
      case 'add':
      default: {
        this.onClickShowCreateModal(true);
      }
    }
  };

  onClickShowDeleteModal = (isForce = false) => {
    let { $deleteAuthority, $getAuthorityTree } = this.props;
    let { selectedRows } = this.state;
    const id = selectedRows[0];
    Modal.confirm({
      content: `确认${isForce ? '强制' : ''}删除选中权限?`,
      onOk() {
        $deleteAuthority({
          payload: {
            id,
            force: isForce,
          },
          callback: $getAuthorityTree,
        });
      },
      onCancel() {
        Modal.destroyAll();
      },
    });

  };

  onClickShowCreateModal = () => this.setState({
    visibleCreate: true,
  });

  onClickShowUpdateModal = () => this.setState({
    visibleUpdate: true,
  });

  onClickCloseCreateModal = () => {
    let { $getAuthorityTree } = this.props;
    $getAuthorityTree();
    this.setState({
      visibleCreate: false,
    });
  };

  onClickCloseUpdateModal = () => {
    let { $getAuthorityTree } = this.props;
    $getAuthorityTree();
    this.setState({
      visibleUpdate: false,
    });
  };

  onClickShowDetailModal = () => {
    this.setState({
      visibleDetail: true,
    });
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };

  onClickShowGrantModal = () => {
    this.setState({
      visibleGrant: true,
    });
  };

  onClickCloseGrantModal = () => {
    this.setState({
      visibleGrant: false,
    });
  };

}

export default index;
