export default class Config {
  /**
   * 默认配置
   * @type {{}}
   */
  static defaultConfig = {
    // 请求地址
    host: 'http://127.0.0.1:8080',
    // 开发模式
    dev: true,
  };

  /**
   * 是否开发模式
   * @returns {boolean}
   */
  static isDev() {
    return this.defaultConfig.dev;
  }

  /**
   * 服务器地址
   * @returns {string}
   */
  static host() {
    if (Config.isDev()) {
      return `http://127.0.0.1:8080`;
    }
    return 'http://127.0.0.1:9090';
  }

  /**
   * 自定义配置
   * @returns {{}}
   */
  static getCustomConfig() {
    return {};
  }

  /**
   * 当前配置
   * @returns {Config.defaultConfig}
   */
  static getConfigs() {
    return {
      ...Config.defaultConfig,
      ...Config.getCustomConfig(),
    };
  }
}