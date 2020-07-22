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

  /**
   * 退款申请状态
   * @param int
   * @param title
   * @return {*}
   */
  static refundApplyStatus(int, title = '无') {
    return this.status(['processing', 'warning', 'success', 'error'], int, title);
  }

  /**
   * 开启状态
   */
  static enabledStatus(int, title = '无') {
    return this.status(['error', 'success'], int, title);
  }

  /**
   * 过期状态
   */
  static expiredStatus(int, title = '无') {
    return this.status(['error', 'success'], int, title);
  }

  /**
   * 锁定状态
   */
  static lockedStatus(int, title = '无') {
    return this.status(['error', 'success'], int, title);
  }

  /**
   * 优惠券状态
   */
  static couponUseStatus(int, title = '无') {
    return this.status(['warning', 'success', 'default', 'error'], int, title);
  }

  /**
   * 发布状态
   */
  static publishStatus(int, title = '无') {
    return this.status(['error', 'success'], int, title);
  }

  static status(enums = [], int, title = 'N/A') {
    if (int === null || int === undefined) {
      return 'N/A';
    }
    return (<Badge status={[...enums][int]} text={title}/>);
  }
}
