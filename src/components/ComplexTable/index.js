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
    onClickSearch: () => {
    },
  };

  state = {};

  render() {
    let {
      rowKey,
      // Toolbar
      toolbarEnabled = true, toolbarTitle = null, toolbarMenu = null, toolbarChildren = null,
      // SearchBar
      searchBarEnabled = true, searchBarChildren, onClickSearch,
      // Table
      tableColumns = [], tableData = [], tableLoading, selectedRows, onSelectRow, onChangeStandardTable, expandable,
    } = this.props;

    return (<Card className={styles.component} bordered={false} bodyStyle={{ padding: 0 }}>
        {/*搜索栏*/}
        {searchBarEnabled && <SearchBar className={styles.searchBar} onSubmit={onClickSearch}>
          {searchBarChildren}
        </SearchBar>}
        {/*工具条*/}
        {toolbarEnabled && <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>{toolbarTitle}</div>
          <Toolbar menu={toolbarMenu} selectedRows={selectedRows}>
            {toolbarChildren}
          </Toolbar>
        </div>}
        {/*数据展示*/}
        <StandardTable rowKey={rowKey || 'id'} selectedRows={selectedRows}
                       expandable={expandable}
                       loading={tableLoading}
                       data={tableData}
                       columns={tableColumns}
                       onSelectRow={onSelectRow}
                       onChange={onChangeStandardTable}/>
      </Card>
    );
  }
}

export default ComplexTable;
