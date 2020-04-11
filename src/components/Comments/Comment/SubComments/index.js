import React from 'react';
import PropTypes from 'prop-types';
import { transform } from '../../index';
import { Comment, List, Pagination } from 'antd';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { ToolBar } from '@/components/Comments/Comment';

const SubComment = ({ id, nickname, avatar, content, pnickname, createdAt, onClickReply }) => {
  return (<Comment avatar={avatar}
                   actions={[<ToolBar onClickReply={onClickReply}
                                      nickname={nickname}
                                      id={id}/>]}
                   author={nickname}
                   content={<div> 回复 <a href={null}>@{pnickname}</a>: {content} </div>}
                   datetime={DateFormatter.relativeFromNow(createdAt)}/>);
};

class Index extends React.PureComponent {
  render() {
    let { dataSource, pageSize, total, current, onPageChange, onClickReply } = this.props;
    return (<List itemLayout="horizontal"
                  locale={{ emptyText: '加载中' }}
                  dataSource={dataSource}
                  footer={[<Pagination hideOnSinglePage key={`1`} size="small" pageSize={pageSize}
                                       current={current}
                                       onChange={onPageChange} total={total}
                                       showTotal={total => `共 ${total} 条`}/>]}
                  renderItem={(item) => {
                    let props = transform(item);
                    return (<SubComment {...props} onClickReply={onClickReply}/>);
                  }}/>);
  }

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    pageSize: PropTypes.number,
    current: PropTypes.number,
    total: PropTypes.number,
    onClickReply: PropTypes.func,
    onPageChange: PropTypes.func,
  };

  static defaultProps = {
    dataSource: [],
  };
}

export default Index;
