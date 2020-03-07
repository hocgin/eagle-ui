import React from 'react';
import { Tabs } from 'antd';

let { TabPane } = Tabs;

class Index extends React.PureComponent {
  render() {
    let { children } = this.props;
    return (<Tabs defaultActiveKey="1">
      <TabPane tab="全部" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="私信" key="2">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="通知" key="3">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="公告" key="4">
        Content of Tab Pane 2
      </TabPane>
    </Tabs>);
  }
}

export default Index;
