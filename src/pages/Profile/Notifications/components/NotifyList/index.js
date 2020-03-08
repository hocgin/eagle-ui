import React from 'react';
import styles from './index.less';
import InfiniteScroll from 'react-infinite-scroller';
import { Avatar, List, Spin } from 'antd';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import PropTypes from 'prop-types';


class Index extends React.PureComponent {

  render() {
    let { dataSource, pageStart, loading, hasMore, onLoadMore } = this.props;
    return (<div className={styles.component}>
      <InfiniteScroll initialLoad={true}
                      pageStart={pageStart}
                      loadMore={onLoadMore}
                      hasMore={!loading && hasMore}
                      useWindow={false}>
        <List className={styles.notifyContainer}
              style={{ paddingLeft: 20, paddingRight: 20 }}
              dataSource={dataSource}
              renderItem={this.renderItem}>
          {loading && hasMore && (<div className={styles.loading}><Spin/></div>)}
        </List>
      </InfiniteScroll>
    </div>);
  }


  /**
   * 渲染通知项
   * @param title
   * @param avatar
   * @param content
   * @param createdAt
   * @return {*}
   */
  renderItem = ({ title = '', actor: { avatar }, content, createdAt }) => {
    let datetime = DateFormatter.timestampAs(createdAt);
    let description = content;
    let extra = '';
    const leftIcon = avatar ? (
      typeof avatar === 'string' ? (
        <Avatar className={styles.avatar} src={avatar}/>
      ) : (
        avatar
      )
    ) : null;
    return (<List.Item>
      <List.Item.Meta
        className={styles.meta}
        avatar={<span className={styles.iconElement}>{leftIcon}</span>}
        title={
          <div className={styles.title}>
            {title}
            <div className={styles.extra}>{extra}</div>
          </div>
        }
        description={
          <div>
            <div className={styles.description} title={description}>
              {description}
            </div>
            <div className={styles.datetime}>{datetime}</div>
          </div>
        }
      />
    </List.Item>);
  };


  static propTypes = {
    dataSource: PropTypes.array,
    pageStart: PropTypes.number,
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func,
  };

  static defaultProps = {
    dataSource: [],
    pageStart: 0,
    loading: false,
    hasMore: true,
    onLoadMore: () => {
    },
  };
}

export default Index;
