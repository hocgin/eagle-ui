import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Comment, Dropdown, Menu } from 'antd';
import styles from './index.less';
import SubComments from './SubComments';
import CommentEditor from '../Editor';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { MoreOutlined } from '@ant-design/icons';

export const ToolBar = ({ onClickReply, id, nickname }) => {
  return (<div className={styles.actionsWrapper}>
    <span onClick={onClickReply.bind(this, { id, nickname })}>回复</span>
    <Dropdown overlay={(<Menu>
      <Menu.Item key="0">举报</Menu.Item>
    </Menu>)}>
      <a href={null}><MoreOutlined/></a>
    </Dropdown>
  </div>);
};

const ControlComment = ({ total, current, pageSize, dataSource, defaultVisible, onPageChange, onClickReply }) => {
  const [visible, setVisible] = useState(dataSource.length && defaultVisible);
  if (total <= 0) {
    return (<></>);
  }
  let onClickToggleShow = () => {
    if (!visible) {
      setVisible(true);
      if (!dataSource.length) {
        onPageChange();
      }
    } else {
      setVisible(false);
    }
  };

  let title = visible
    ? (<span className={styles.tips} onClick={onClickToggleShow}>隐藏回复</span>)
    : (<span className={styles.tips} onClick={onClickToggleShow}>查看 {total} 条回复</span>);

  let content = visible
    ? (<SubComments total={total} pageSize={pageSize} dataSource={dataSource} current={current}
                    onClickReply={onClickReply} onPageChange={onPageChange}/>)
    : (<></>);

  return (<>
    {title}
    {content}
  </>);
};

/**
 * 根评论
 */
class Index extends React.PureComponent {
  state = {
    replyVisible: false,
    // 被评论的评论: {id, nickname}
    pComment: null,
    page: 1,
    pageSize: 10,
  };

  render() {
    let { id, user, dataSource, current, pageSize, nickname, avatar, content, createdAt, total } = this.props;
    let { replyVisible } = this.state;
    return (<Comment key={`${id}`} className={styles.component}
                     actions={[<ToolBar onClickReply={this.onClickReply} nickname={nickname} id={id}/>]}
                     author={nickname} avatar={avatar} content={content}
                     datetime={DateFormatter.relativeFromNow(createdAt)}>
      <ControlComment key={`${id}`} total={total} dataSource={dataSource} pageSize={pageSize} current={current}
                      onClickReply={this.onClickReply} onPageChange={this.onPageChange} defaultVisible={false}/>
      {replyVisible && <CommentEditor placeholder={this.getPlaceholder()} user={user} onSubmit={this.onSubmit}/>}
    </Comment>);
  }

  getPlaceholder = () => {
    let { pComment } = this.state;
    if (pComment) {
      return `回复 ${pComment.nickname}:`;
    }
    return ``;
  };

  onSubmit = (values) => {
    let { id: rootId, onSubmit } = this.props;
    let { pComment, page, pageSize } = this.state;
    if (onSubmit) {
      let { id } = pComment || {};
      onSubmit(rootId, id, values, page, pageSize);
    }
  };

  onPageChange = (page = 1, pageSize = 5) => {
    console.log('onPageChange', page, pageSize);
    let { id: rootId, parentId, onPageChange } = this.props;
    this.setState({ page, pageSize }, () => {
      if (onPageChange) {
        parentId = rootId;
        onPageChange(rootId, parentId, page, pageSize);
      }
    });
  };

  onClickReply = (pComment) => {
    this.setState(({ pComment: oldPComment, replyVisible }) => {
      let oid = (oldPComment || {}).id;
      let newState = {
        pComment: pComment,
      };
      if (oid !== pComment.id) {
        newState = {
          ...newState,
          replyVisible: true,
        };
      } else {
        newState = {
          ...newState,
          replyVisible: !replyVisible,
        };
      }

      return newState;
    });
  };

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    pageSize: PropTypes.number,
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    user: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.number,
    total: PropTypes.number,
    onPageChange: PropTypes.func,
  };

  static defaultProps = {
    dataSource: [],
    pageSize: 5,
    user: {
      avatar: null,
    },
  };
}

export default Index;
