import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import CommentEditor from './Editor';
import Comment from './Comment';
import { List, Pagination } from 'antd';

/**
 * 数据转换
 * @param nickname
 * @param avatar
 * @param content
 * @param createdAt
 * @param children
 * @return {{createdAt: *, children, nickname: *, avatar: *, content: *}}
 */
export const transform = ({ id, commenter: { nickname, avatar }, pcommenter: { nickname: pnickname, avatar: pavatar }, content, createdAt, children = [], current, pageSize, total }) => {
  return {
    id: id,
    parentId: null,
    nickname: nickname,
    avatar: avatar,
    content: content,
    createdAt: createdAt,
    pnickname: pnickname || '被评论者名字',

    dataSource: children,
    current: current || 1,
    pageSize: pageSize || 0,
    total: total || 0,
  };
};

class Index extends React.PureComponent {
  state = {
    page: 1,
    pageSize: 1,
  };

  render() {
    let { user, dataSource, current, total, pageSize, onSubmit, onPageChange } = this.props;
    const placeholder = '发表评论..';
    return (<div className={styles.component}>
      <CommentEditor user={user} placeholder={placeholder} onSubmit={this.onSubmit}/>
      <List itemLayout="horizontal"
            locale={{ emptyText: '暂无数据' }}
            renderItem={(item) => {
              let props = transform(item);
              return (<Comment key={props.id} {...props}
                               user={user} onSubmit={onSubmit} onPageChange={onPageChange}/>);
            }}
            dataSource={dataSource}/>
      <Pagination hideOnSinglePage onChange={this.onPageChange} onShowSizeChange={this.onPageChange} size="small"
                  total={total} current={current} pageSize={pageSize}/>
      {total > 3 && <CommentEditor user={user} placeholder={placeholder} onSubmit={this.onSubmit}/>}
    </div>);
  }

  onPageChange = (page, pageSize) => {
    let { onPageChange, parentId } = this.props;
    this.setState({ page, pageSize }, () => {
      if (onPageChange) {
        onPageChange(null, parentId, page, pageSize);
      }
    });
  };

  onSubmit = (values) => {
    let { onSubmit, parentId } = this.props;
    let { page, pageSize } = this.state;
    if (onSubmit) {
      onSubmit(null, parentId, values, page, pageSize);
    }
  };


  static propTypes = {
    dataSource: PropTypes.array,
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    // {avatar}
    user: PropTypes.object,
    onSearch: PropTypes.func,
    // (rootId, parentId, values, page, size)
    onSubmit: PropTypes.func,
    // (rootId, parentId, page, size)
    onPageChange: PropTypes.func,
    useConfig: PropTypes.object,
  };

  static defaultProps = {
    dataSource: [],
    user: {
      avatar: null,
    },
    current: 0,
    total: 0,
    pageSize: 0,
  };
}

export default Index;
