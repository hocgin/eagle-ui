import React from 'react';
import styles from './index.less';
import Toolbar from '@/components/Toolbar';
import { Button, Card, DatePicker, Form } from 'antd';
import StandardTable from '@/components/StandardTable';
import SearchBar from '@/components/SearchBar';

class ComplexTable extends React.PureComponent {
  render() {
    let {
      toolbarEnabled = true, toolbarTitle = null, toolbarMenu = null, toolbarSelectedRows = [],
      tableColumns = [], tableData = [], tableSelectedRows = [],
    } = this.props;
    return (<Card className={styles.component} bordered={false} bodyStyle={{ padding: 0 }}>
        {/*搜索栏*/}
        <SearchBar className={styles.searchBar} onSubmit={null}>
          {form => [
            <Form.Item label="创建日期">
              {form.getFieldDecorator('createdAt')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请输入更新日期"
                />,
              )}
            </Form.Item>,
          ]}
        </SearchBar>
        {/*工具条*/}
        <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>{toolbarTitle}</div>
          <Toolbar menu={toolbarMenu}
                   selectedRows={toolbarSelectedRows}>
            <Button htmlType="button"
                    icon="plus"
                    type="primary">新建</Button>
            {/*<Divider type="vertical"/>*/}
          </Toolbar>
        </div>
        {/*数据展示*/}
        <StandardTable
          selectedRows={tableSelectedRows}
          data={tableData}
          columns={tableColumns}/>
      </Card>
    );
  }
}

export default ComplexTable;
