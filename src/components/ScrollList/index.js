import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { Avatar, List, Popconfirm } from 'antd';

class Index extends React.PureComponent {

  render() {
    let { height = 200, loading = true, renderItem } = this.props;
    let dataSource = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    return (<div className={styles.component} style={{ height: height }}>
      <InfiniteScroll useWindow={false}
                      hasMore={false}
                      loadMore={null}
                      pageStart={0}
                      initialLoad={true}>
        <List renderItem={this.renderItem}
              loadMore={loading}
              dataSource={dataSource}/>
      </InfiniteScroll>
    </div>);
  }

  renderItem = ({ id, title, description }) => {
    return (<List.Item key={id}>
      <List.Item.Meta
        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
        title={<a href="https://ant.design">{title}</a>}
        description={description}/>
      <Popconfirm arrowPointAtCenter
                  title="确认删除？" okText="确认" cancelText="取消">
        <a href="#">删除</a>
      </Popconfirm>
    </List.Item>);
  };


  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: <></>,
  };
}

export default Index;
