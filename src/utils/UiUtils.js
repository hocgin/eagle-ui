import memoizeOne from 'memoize-one';
import React from 'react';
import { Badge, message, Modal, TreeSelect } from 'antd';

export default class UiUtils {

  /**
   * 请求是否成功
   * @param result
   * @returns {boolean}
   */
  static isSuccess(result) {
    return result && result.success;
  }

  static showErrorMessageIfExits(result) {
    if (this.isSuccess(result)) {
      return true;
    }
    console.error('业务失败，响应内容::', result);
    message.error(result.message);
    return false;
  }

  /**
   * 弹窗确认
   * @param ids
   * @param dispatch
   * @param callback
   * @param title
   */
  static showConfirmModal({
                            ids = [],
                            dispatch = () => {
                            },
                            callback = () => {
                            },
                            title = '请确认正在进行的操作?',
                          }) {
    let props = {
      content: title,
      okText: '确定',
      cancelText: '取消',
      onCancel() {
        Modal.destroyAll();
      },
    };

    if (ids.length > 1) {
      props = {
        ...props,
        onOk() {
          dispatch({ payload: { id: ids }, callback: callback });
        },
      };
    } else {
      props = {
        ...props,
        content: title,
        onOk() {
          dispatch({ payload: { id: ids[0] }, callback: callback });
        },
      };
    }
    Modal.confirm(props);
  }

  /**
   * 加载中
   */
  static isLoading(isLoading) {
    return isLoading === undefined || isLoading === true;
  }

  /**
   * 自动输出第一条错误信息
   * @param errors
   */
  static getErrorMessage(errors) {
    let keys = Object.keys(errors || {});
    if (keys.length > 0) {
      return errors[keys[0]].message;
    }
  }

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

  static renderEnabled(enabled, enabledName) {
    return <Badge status={['error', 'success'][enabled]} text={enabledName}/>;
  }
};
