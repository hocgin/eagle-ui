import React from 'react';
import styles from './index.less';
import { Menu } from 'antd';
import ComplexTable from '@/components/ComplexTable';

class index extends React.Component {

  state = {
    selectedRows: [],
  };

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let { selectedRows } = this.state;
    let {} = this.props;
    const BatchMenus = (
      <Menu onClick={null}>
        <Menu.Item>修改角色</Menu.Item>
        <Menu.Item>赋予权限</Menu.Item>
        <Menu.Item>查询关联账号</Menu.Item>
        <Menu.Divider/>
        <Menu.Item>删除角色</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.page}>
        <ComplexTable toolbarTitle={'角色列表'}
                      toolbarMenu={BatchMenus}
                      toolbarSelectedRows={selectedRows}
                      tableData={{
                        list: [{ 'name': '超级管理员' }, { 'name': '超级管理员' }],
                        pagination: {
                          current: 1,
                          total: 100,
                          pageSize: 10,
                        },
                      }}
                      tableColumns={[{
                        title: '规则名称',
                        dataIndex: 'name',
                        key: 'name',
                      }]}
        />
      </div>
    );
  }
}

export default index;
