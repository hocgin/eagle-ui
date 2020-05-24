enum MsgType {
  VOICE = 'voice',
  MPVIDEO = 'mpvideo',
  IMAGE = 'image',
  MPNEWS = 'mpnews',
  TEXT = 'text',
}

enum TemplateMessagePageType {
  MiniProgram = 'miniProgram',
  URL = 'url',
}

export class Data {

  /**
   * 消息类型
   */
  public static getMsgType() {
    return [{
      key: '音频',
      value: MsgType.VOICE,
    }, {
      key: '视频',
      value: MsgType.MPVIDEO,
    }, {
      key: '文本',
      value: MsgType.TEXT,
    }, {
      key: '图片',
      value: MsgType.IMAGE,
    }, {
      key: '图文',
      value: MsgType.MPNEWS,
    }];
  }

  /**
   * 模版消息内容
   */
  public static getTemplateMessagePageType() {
    return [{
      key: '小程序',
      value: TemplateMessagePageType.MiniProgram,
    }, {
      key: 'URL',
      value: TemplateMessagePageType.URL,
    }];
  }

}
