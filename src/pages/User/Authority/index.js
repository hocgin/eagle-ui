import React from 'react';
import styles from './index.less';
import { Tree } from 'antd';
import { connect } from 'dva';

const { TreeNode } = Tree;

@connect(({ global, authority: { result = [] }, loading, ...rest }) => {
  return {
    result: result,
  };
}, dispatch => ({
  $searchAuthority: (args = {}) => dispatch({ type: 'authority/search', ...args }),
}))
class index extends React.Component {

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
    let { result } = this.props;
    return (
      <div className={styles.page}>
        <Tree>
          {this.renderTreeNodes(result)}
        </Tree>
      </div>
    );
  }
}

export default index;
