import React from 'react';
import styles from './index.less';
import { Button, Tabs } from 'antd';
import { connect } from 'dva';
import NotifyList from './components/NotifyList';
import UiUtils from '@/utils/UiUtils';
import { history } from 'umi';
import SendModal from '@/pages/Profile/Notifications/Modal/SendModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

let { TabPane } = Tabs;

@connect(({ notify: { privateLetter }, notifications: { query }, loading, ...rest }) => {
  return {
    notifyType: query.type || 'privateLetter',
    getNotificationsLoading: loading.effects['notify/getNotifications'],
  };
}, dispatch => ({
  $getNotifications: (args = {}) => dispatch({ type: 'notify/getNotifications', ...args }),
}))
class index extends React.Component {
  state = {
    // 私信
    privateLetter: [],
    hasMorePrivateLetterLoading: true,
    privateLetterLoading: false,
    // 订阅
    subscription: [],
    hasMoreSubscriptionLoading: true,
    subscriptionLoading: false,
    // 公告
    announcement: [],
    hasMoreAnnouncementLoading: true,
    announcementLoading: false,
    visibleSend: false,
  };

  render() {
    let {
      privateLetter, hasMorePrivateLetterLoading, privateLetterLoading,
      subscription, hasMoreSubscriptionLoading, subscriptionLoading,
      announcement, hasMoreAnnouncementLoading, announcementLoading,
      visibleSend,
    } = this.state;
    let { notifyType } = this.props;

    return (<PageHeaderWrapper hiddenBreadcrumb={true}
                               className={styles.page}>
      <div className={styles.content}>
        <Tabs size="large"
              tabBarExtraContent={<Button type="primary" onClick={this.onClickShowSendModal}>发送消息</Button>}
              onChange={this.onChange}
              tabBarStyle={{ paddingLeft: 20, paddingRight: 20 }}
              className={styles.tabsBody}
              defaultActiveKey={notifyType}>
          <TabPane tab="私信" key="privateLetter">
            <NotifyList dataSource={privateLetter}
                        loading={privateLetterLoading}
                        hasMore={hasMorePrivateLetterLoading}
                        onLoadMore={this.onLoadMorePrivateLetter}/>
          </TabPane>
          <TabPane tab="通知" key="subscription">
            <NotifyList dataSource={subscription}
                        loading={subscriptionLoading}
                        hasMore={hasMoreSubscriptionLoading}
                        onLoadMore={this.onLoadMoreSubscription}/>
          </TabPane>
          <TabPane tab="公告" key="announcement">
            <NotifyList dataSource={announcement}
                        loading={announcementLoading}
                        hasMore={hasMoreAnnouncementLoading}
                        onLoadMore={this.onLoadMoreAnnouncement}/>
          </TabPane>
        </Tabs>
        {visibleSend && <SendModal visible={visibleSend}
                                   onClose={this.onClickCloseSendModal}/>}
      </div>
    </PageHeaderWrapper>);
  }

  onChange = (key) => {
    let { location: { pathname } } = this.props;
    history.push({
      pathname: pathname,
      query: {
        type: key,
      },
    });
  };

  onLoadMorePrivateLetter = (page) => {
    let { $getNotifications } = this.props;
    this.setState({
      privateLetterLoading: true,
    });
    $getNotifications({
      payload: {
        notifyType: 0,
        page,
      },
      callback: (paging) => {
        let data = UiUtils.getPagingList(paging.data);
        this.setState(({ privateLetter }) => ({
          hasMorePrivateLetterLoading: data.length !== 0,
          privateLetter: [...privateLetter, ...data],
          privateLetterLoading: false,
        }));
      },
    });
  };

  onLoadMoreSubscription = (page) => {
    let { $getNotifications } = this.props;
    this.setState({
      subscriptionLoading: true,
    });
    $getNotifications({
      payload: {
        notifyType: 100,
        page,
      },
      callback: (paging) => {
        let data = UiUtils.getPagingList(paging.data);
        this.setState(({ subscription }) => ({
          hasMoreSubscriptionLoading: data.length !== 0,
          subscription: [...subscription, ...data],
          subscriptionLoading: false,
        }));
      },
    });
  };

  onLoadMoreAnnouncement = (page) => {
    let { $getNotifications } = this.props;
    this.setState({
      announcementLoading: true,
    });
    $getNotifications({
      payload: {
        notifyType: 1,
        page,
      },
      callback: (paging) => {
        let data = UiUtils.getPagingList(paging.data);
        this.setState(({ announcement }) => {
          return {
            hasMoreAnnouncementLoading: data.length !== 0,
            announcement: [...announcement, ...data],
            announcementLoading: false,
          };
        });
      },
    });
  };

  onClickCloseSendModal = () => {
    this.setState({
      visibleSend: false,
    });
  };

  onClickShowSendModal = () => {
    this.setState({
      visibleSend: true,
    });
  };

}

export default index;
