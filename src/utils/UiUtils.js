import memoizeOne from 'memoize-one';
import React from 'react';
import { TreeSelect } from 'antd';

export default class UiUtils {

  /**
   * 获取 paging 对象的列表数据
   * @param paging
   * @return {*|*[]}
   */
  static getPagingList(paging) {
    if (!paging) {
      return [];
    }
    return paging.records || [];
  }

  static fastGetPagingList = memoizeOne(this.getPagingList);

  /**
   * 获取分页的设置对象
   * @param paging
   * @return {{}}
   */
  static getPagingPagination(paging) {
    if (!paging) {
      return {};
    }
    return {
      total: paging.total,
      pageSize: paging.size,
      current: paging.current,
    };
  }

  static fastPagingPagination = memoizeOne(this.getPagingPagination);


  static renderTreeSelectNodes(data) {
    return (data || []).map(item => {
      if (item.children && item.children.length > 0) {
        return (<TreeSelect.TreeNode value={item.id} title={item.title} dataRef={item}>
          {this.renderTreeSelectNodes(item.children)}
        </TreeSelect.TreeNode>);
      }
      return <TreeSelect.TreeNode value={item.id} key={item.authorityCode} title={item.title} dataRef={item}/>;
    });
  };
};