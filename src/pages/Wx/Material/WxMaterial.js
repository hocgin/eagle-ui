import Config from '@/config';

export class WxMaterial {
  static getMediaUrl(mediaType, appid, mediaId) {
    let host = Config.host();
    switch (mediaType) {
      case 0: // 图片
        return `${host}/api/wx-mp/material/image/${appid}/${mediaId}`;
      case 1: // 音频
        return `${host}/api/wx-mp/material/voice/${appid}/${mediaId}`;
      case 2: // 视频
        return `${host}/api/wx-mp/material/video/${appid}/${mediaId}`;
      case 3: // 缩略图
        return `${host}/api/wx-mp/material/image/${appid}/${mediaId}`;
      case 4:
      default:
        return null;
    }
  }
}
