export class WxReplyRule {
  static getReplyContent(replyMsgType, replyContent) {
    switch (replyMsgType) {
      case 0: // 文本
        return (replyContent || {}).content ?? ``;
      default:
        return null;
    }
  }
}
