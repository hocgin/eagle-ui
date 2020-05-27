import memoizeOne from 'memoize-one';
import React from 'react';
import { message, Modal, Tree, TreeSelect } from 'antd';
import isEqual from 'lodash/isEqual';

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

    if (result.code !== 503) {
      message.error(result.message);
    }

    console.error('业务失败，响应内容::', result);
    return false;
  }

  /**
   * 弹窗确认
   * @param ids
   * @param dispatch
   * @param callback
   * @param title
   */
  static showConfirmModal({ ids = [],
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
    if (errors.errorFields && errors.errorFields.length > 0) {
      return errors.errorFields[0].errors[0];
    }

    console.log(errors);
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


  /**
   * <Tree.Select/>
   * @param data
   * @return {unknown[]}
   */
  static renderTreeSelectNodes(data) {
    return (data || []).map(item => {
      if (item.children && item.children.length > 0) {
        return (<TreeSelect.TreeNode key={`${item.id}`} value={item.id} title={item.title} dataRef={item}>
          {this.renderTreeSelectNodes(item.children)}
        </TreeSelect.TreeNode>);
      }
      return <TreeSelect.TreeNode value={item.id} key={`${item.id}`} title={item.title} dataRef={item}/>;
    });
  };

  /**
   * <Tree/>
   * @param data
   * @return {unknown[]}
   */
  static renderTreeNodes(data) {
    return (data || []).map(item => {
      if (item.children && item.children.length > 0) {
        return (<Tree.TreeNode key={`${item.id}`} value={item.id} title={item.title} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </Tree.TreeNode>);
      }
      return <Tree.TreeNode value={item.id} key={`${item.id}`} title={item.title} dataRef={item}/>;
    });
  };



};
