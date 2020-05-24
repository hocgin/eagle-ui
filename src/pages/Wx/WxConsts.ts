enum MsgType {
  VOICE = 'voice',
  MPVIDEO = 'mpvideo',
  IMAGE = 'image',
  MPNEWS = 'mpnews',
  TEXT = 'text',
}

export class Data {

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

}
