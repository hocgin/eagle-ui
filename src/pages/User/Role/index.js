import React from 'react';
import styles from './index.less';
import { Button, DatePicker, Form, Menu } from 'antd';
import ComplexTable from '@/components/ComplexTable';
import CreateModal from '@/pages/User/Role/Modal/CreateModal';

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
        <CreateModal visible={true}/>
        <ComplexTable toolbarTitle={'角色列表'}
                      toolbarMenu={BatchMenus}
                      selectedRows={selectedRows}
                      toolbarChildren={<Button htmlType="button" icon="plus" type="primary">新建</Button>}
                      searchBarChildren={form => [
                        <Form.Item label="创建日期">
                          {form.getFieldDecorator('createdAt')(
                            <DatePicker
                              style={{ width: '100%' }}
                              placeholder="请输入更新日期"
                            />,
                          )}
                        </Form.Item>,
                      ]}
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
