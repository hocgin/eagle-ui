import { Badge } from 'antd';
import React from 'react';

/**
 * success
 * error
 * default
 * processing
 * warning
 */
export class EnumFormatter {

  /**
   * 订单状态
   * @param int
   * @param title
   * @return {*}
   */
  static orderStatus(int, title = '无') {
    return (<Badge status={['warning', 'processing', 'success', 'success', 'default', 'default'][int]} text={title}/>);
  }

  /**
   * 订单确认状态
   * @param int
   * @param title
   * @return {*}
   */
  static confirmStatus(int, title = '无') {
    return (<Badge status={['processing', 'success'][int]} text={title}/>);
  }

}
