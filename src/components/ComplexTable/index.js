import React from 'react';
import styles from './index.less';
import Toolbar from '@/components/Toolbar';
import { Card } from 'antd';
import StandardTable from '@/components/StandardTable';
import SearchBar from '@/components/SearchBar';
import PropTypes from 'prop-types';

class ComplexTable extends React.PureComponent {
  static propTypes = {
    tableLoading: PropTypes.bool,
  };

  static defaultProps = {
    tableLoading: false,
  };

  render() {
    let {
      // Toolbar
      toolbarEnabled = true, toolbarTitle = null, toolbarMenu = null, toolbarChildren = null,
      // SearchBar
      searchBarEnabled = true, searchBarChildren = (form) => form, onClickSearch = null,
      // Table
      tableColumns = [], tableData = [], tableLoading, selectedRows = [],
    } = this.props;
    return (<Card className={styles.component} bordered={false} bodyStyle={{ padding: 0 }}>
        {/*搜索栏*/}
        {searchBarEnabled && <SearchBar className={styles.searchBar} onSubmit={onClickSearch}>
          {form => searchBarChildren(form)}
        </SearchBar>}
        {/*工具条*/}
        {toolbarEnabled && <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>{toolbarTitle}</div>
          <Toolbar menu={toolbarMenu} selectedRows={selectedRows}>
            {toolbarChildren}
          </Toolbar>
        </div>}
        {/*数据展示*/}
        <StandardTable key="id" selectedRows={selectedRows} loading={tableLoading} data={tableData} columns={tableColumns}
                       onChange={this.onChangeStandardTable}/>
      </Card>
    );
  }

  onChangeStandardTable = (pagination, filtersArg, sorter) => {

  };
}

export default ComplexTable;
