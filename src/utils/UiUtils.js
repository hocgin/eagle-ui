import memoizeOne from 'memoize-one';

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

};