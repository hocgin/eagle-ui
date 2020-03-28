import React from 'react';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Menu, Modal, Tree } from 'antd';
import { connect } from 'dva';
import Toolbar from '@/components/Toolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import classnames from 'classnames';
import CreateModal from '@/pages/Pms/ProductCategory/Modal/CreateModal';
import UpdateModal from '@/pages/Pms/ProductCategory/Modal/UpdateModal';
import DetailModal from '@/pages/Pms/ProductCategory/Modal/DetailModal';
import UiUtils from '@/utils/UiUtils';

@connect(({ global, productCategory: { tree = [] }, loading, ...rest }) => {
  return {
    data: tree,
    treeLoading: loading.effects['productCategory/getTree'],
  };
}, dispatch => ({
  $getTree: (args = {}) => dispatch({ type: 'productCategory/getTree', ...args }),
  $delete: (args = {}) => dispatch({ type: 'productCategory/delete', ...args }),
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
    let { $getTree } = this.props;
    $getTree();
  }

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, visibleGrant } = this.state;
    let { data, treeLoading } = this.props;

    const toolbarMenus = (
      <Menu onClick={this.onClickMenuItem}>
        <Menu.Item key="add">新增节点</Menu.Item>
        <Menu.Item key="update">修改节点</Menu.Item>
        <Menu.Item key="detail">查看详情</Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="delete">删除节点</Menu.Item>
        <Menu.Item key="forceDelete">删除节点子树</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper wrapperClassName={styles.page}>
        <Card bordered={false}>
          {/*工具条*/}
          <div className={classnames(styles.toolbar, styles.toolbarExt)}>
            <div className={styles.toolbarTitle}>品类树</div>
            <Toolbar menu={toolbarMenus}
                     selectedRows={selectedRows}>
              <Button htmlType="button"
                      icon={<PlusOutlined/>}
                      onClick={this.onClickShowCreateModal}
                      type="primary">新建</Button>
            </Toolbar>
          </div>
          <Tree onSelect={this.onSelectRows}>
            {UiUtils.renderTreeNodes(data)}
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
      </PageHeaderWrapper>
    );
  }

  refresh = () => {
    let { $getTree } = this.props;
    $getTree();
  };

  // 选择树节点
  onSelectRows = (rows, target) => {
    let selectedRows = [];
    if (target.selected) {
      let selectNodeId = target.node.dataRef.id;
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
      case 'add':
      default: {
        this.onClickShowCreateModal(true);
      }
    }
  };

  onClickShowDeleteModal = (isForce = false) => {
    let { $delete } = this.props;
    let { selectedRows } = this.state;
    const id = selectedRows[0];
    let refresh = this.refresh;
    Modal.confirm({
      content: `确认${isForce ? '强制' : ''}删除选中节点?`,
      onOk() {
        $delete({
          payload: {
            id,
            force: isForce,
          },
          callback: refresh,
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

  onClickCloseCreateModal = () => this.setState({
    visibleCreate: false,
  }, this.refresh);

  onClickCloseUpdateModal = () => this.setState({
    visibleUpdate: false,
  }, this.refresh);

  onClickShowDetailModal = () => this.setState({
    visibleDetail: true,
  });

  onClickCloseDetailModal = () => this.setState({
    visibleDetail: false,
  });

}

export default index;
