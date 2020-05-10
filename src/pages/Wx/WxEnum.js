import { Badge } from 'antd';
import React from 'react';

/**
 * success
 * error
 * default
 * processing
 * warning
 */
export class WxEnum {

  static sex(int) {
    return this.titles(['未知', '男', '女'], int);
  }

  static subscribe(bool) {
    let int = bool ? 1 : 0;
    return this.status(['warning', 'success'], ['已取关', '关注中'], int);
  }

  static subscribeScene(str) {
    let map = {
      'ADD_SCENE_SEARCH': '公众号搜索',
      'ADD_SCENE_ACCOUNT_MIGRATION': '公众号迁移',
      'ADD_SCENE_PROFILE_CARD': '名片分享',
      'ADD_SCENE_QR_CODE': '扫描二维码',
      'ADD_SCENE_PROFILE_LINK': '图文页内名称点击',
      'ADD_SCENE_PAID': '支付后关注',
      'ADD_SCENE_OTHERS': '其他',
    };

    return map[str] || 'N/A';
  }


  static titles(titles = [], int) {
    if (int === null || int === undefined) {
      return 'N/A';
    }
    return [...titles][int];
  }

  static status(enums = [], titles = [], int) {
    if (int === null || int === undefined) {
      return 'N/A';
    }
    return (<Badge status={[...enums][int]} text={this.titles(titles, int)}/>);
  }
}
