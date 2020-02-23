import React from 'react';
import styles from './index.less';
import { Button, Card, Menu, Tree } from 'antd';
import { connect } from 'dva';
import Toolbar from '@/components/Toolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { TreeNode } = Tree;

@connect(({ global, authority: { result = [] }, loading, ...rest }) => {
  return {
    result: result,
  };
}, dispatch => ({
  $searchAuthority: (args = {}) => dispatch({ type: 'authority/search', ...args }),
}))
class index extends React.Component {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    let { $searchAuthority } = this.props;
    $searchAuthority();
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
    let { selectedRows } = this.state;
    let { result } = this.props;
    const BatchMenus = (
      <Menu onClick={null}>
        <Menu.Item>新增节点</Menu.Item>
        <Menu.Item>修改节点</Menu.Item>
        <Menu.Item>赋予角色</Menu.Item>
        <Menu.Divider/>
        <Menu.Item>删除节点</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper className={styles.page}>
        <Card bordered={false}>
          {/*工具条*/}
          <Toolbar menu={BatchMenus}
                   selectedRows={selectedRows}>
            <Button htmlType="button"
                    icon="plus"
                    type="primary">
              新建
            </Button>
          </Toolbar>
          <Tree
            onSelect={this.onSelectRows}>
            {this.renderTreeNodes(result)}
          </Tree>
        </Card>
      </PageHeaderWrapper>
    );
  }

  // 选择树节点
  onSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

}

export default index;
