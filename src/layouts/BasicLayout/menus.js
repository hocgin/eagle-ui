export default class MenuUtils {
  /**
   * 根据树级项返回渲染树
   * @param tree
   * @param routes
   * @return [{
   *   "code": "dashboard",
   *   "url": "/dashboard",
   *   "icon": "",
   *   "title: "",
   *   "children": []
   * }]
   */
  static getMenu(tree = [], routes = []) {
    let data = MenuUtils.getRoutes(routes);
    return (tree || []).map(({ title, authorityCode, children = [] }) => {
      let item = MenuUtils.getItem(authorityCode, data);
      console.log(`获取菜单, Code=${authorityCode}, 获取结果: `, item);
      if (!item) {
        return null;
      }
      return {
        ...item,
        title,
        children: MenuUtils.getMenu(children, routes),
      };
    }).filter((v) => v !== null);
  }

  /**
   * 根据 code 返回本地对应的菜单项
   * @param targetCode
   * @param data
   * @return {*}
   */
  static getItem(targetCode, data = []) {
    return (data || []).find(({ code }) => {
      return code === targetCode;
    });
  }

  /**
   * 根据 keyPath 来解析出 keyPathItems
   * @param treeData [{
   *   "code": "dashboard",
   *   "url": "/dashboard",
   *   "icon": "",
   *   "title": "",
   *   "children": []
   * }, ..]
   * @param keyPath ["index", "dashboard"]
   * @return [{
   *   "code": "dashboard",
   *   "url": "/dashboard",
   *   "icon": "",
   *   "title": ""
   *   }]
   */
  static getItems(treeData, keyPath) {
    let results = [];
    let tempData = treeData || [];
    for (let i = 0; i < keyPath.length; i++) {
      let key = keyPath[i];
      let result = tempData.find(({ code }) => code === key);
      if (!result) {
        return null;
      }
      results.push(result);
      tempData = result.children;
    }
    return results;
  }

  /**
   * 从路由中整理出菜单列表
   * - 【必须】路由中含有 `code` 标记
   * - 【可选】提取路由中含有的 `icon` 标记
   */
  static getRoutes(routes = []) {
    let result = [];
    (routes || []).forEach((item = {}) => {
      let { code, routes } = item;
      if (code) {
        result.push(item);
      }

      if (routes && routes.length) {
        result.push(...this.getRoutes(item.routes));
      }
    });
    return result;
  }
}