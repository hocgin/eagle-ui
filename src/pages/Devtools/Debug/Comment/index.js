import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Comments from '@/components/Comments';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import { message } from 'antd';

@connect(({ comment: { rootPaging, childPaging }, apps: { currentAccount }, loading }) => {
  let { nickname, avatar } = currentAccount;
  return {
    rootPaging: rootPaging,
    avatar: avatar,
    childPaging: childPaging,
    isLoading: loading.effects['comment/pagingWithRootPaging'],
  };
}, dispatch => ({
  $submit: (args = {}) => dispatch({ type: 'comment/insert', ...args }),
  $pagingWithChildPaging: (args = {}) => dispatch({ type: 'comment/pagingWithChildPaging', ...args }),
  $pagingWithRootPaging: (args = {}) => dispatch({ type: 'comment/pagingWithRootPaging', ...args }),
}))
class index extends React.Component {

  state = {
    refId: 1,
    refType: 0,
  };

  componentDidMount() {
    let { $pagingWithRootPaging } = this.props;
    let { refId, refType } = this.state;
    $pagingWithRootPaging({ payload: { refId, refType } });
  }

  render() {
    let { rootPaging, childPaging, isLoading, avatar } = this.props;
    if (isLoading) {
      return (<></>);
    }
    let pagingList = UiUtils.fastGetPagingList(rootPaging);
    let dataSource = (pagingList || []).map(({ id, content, createdAt, commenter, pcommenter, childrenTotal }) => {
      let pageable = childPaging[`ID_${id}`] || { records: [], current: 1, total: childrenTotal, size: 10 };

      return {
        id, content, createdAt,
        commenter: {
          nickname: commenter.nickname,
          avatar: commenter.avatar,
        },
        pcommenter: {
          nickname: pcommenter ? pcommenter.nickname : null,
          avatar: pcommenter ? pcommenter.avatar : null,
        },
        //
        children: pageable.records,
        total: pageable.total,
        pageSize: pageable.size,
        current: pageable.current,
      };
    });
    let { current, total, pageSize } = UiUtils.fastPagingPagination(rootPaging);

    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <div className={styles.container}>
        <Comments current={current}
                  total={total}
                  user={{
                    avatar: avatar,
                  }}
                  pageSize={pageSize}
                  onSubmit={this.onSubmit}
                  onPageChange={this.onPageChange}
                  dataSource={dataSource || []}/>
      </div>
    </PageHeaderWrapper>);
  }

  onSubmit = (rootId, parentId, values, page, pageSize) => {
    let { refId, refType } = this.state;
    let { $submit, $pagingWithChildPaging, $pagingWithRootPaging } = this.props;
    let pageable = { page: page, size: pageSize };
    $submit({
      payload: { ...values, parentId, refType, refId }, callback: () => {
        message.success('新增成功');
        if (rootId) {
          if (rootId === parentId) {
            pageable = { page: 1, size: 5 };
          }
          $pagingWithChildPaging({ payload: { parentId: rootId, ...pageable } });
        } else {
          $pagingWithRootPaging({ payload: { refType, refId, page: page, size: pageSize } });
        }
      },
    });
  };

  onPageChange = (rootId, parentId, page, size) => {
    let { refId, refType } = this.state;
    let { $pagingWithChildPaging, $pagingWithRootPaging } = this.props;
    if (rootId) {
      $pagingWithChildPaging({ payload: { parentId: rootId, page: page, size: size } });
    } else {
      $pagingWithRootPaging({ payload: { refType, refId, page: page, size: size } });
    }
  };
}

export default index;
