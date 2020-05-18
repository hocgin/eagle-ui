import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { Button, Divider, Form, Input, message, Switch, Upload } from 'antd';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import Config from '@/config';
import LocalStorage from '@/utils/LocalStorage';
import UiUtils from '@/utils/UiUtils';

let { TextArea } = Input;
let MAX_ITEM_LENGTH = 8;

class Index extends React.PureComponent {
  createForm = React.createRef();

  state = {
    clickIndex: 0,
    newsItems: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      newsItems: props.newsItems,
    };
  }

  render() {
    let { confirmLoading } = this.props;
    let { newsItems, clickIndex } = this.state;
    return (<div className={styles.component}>
      <div className={styles.wxMpPage}>
        <div className={styles.wxMpNews}>
          {(newsItems || []).map(({ title, thumbMediaId, originalUrl }, index) => {
            let isFirst = index === 0;
            let imageUrl = thumbMediaId ?? originalUrl;
            let style = {
              backgroundImage: `url(${imageUrl})`,
            };

            let newsItemClassName = {
              [styles.active]: index === clickIndex,
            };

            if (isFirst) {
              return (<div className={classnames(styles.wxMpNewsFirst, newsItemClassName)}
                           onClick={this.onClickNewsItem.bind(this, index)}
                           style={style}>
                <div className={styles.title}>{title}</div>
              </div>);
            }

            return (<div className={classnames(styles.wxMpNewsItem, newsItemClassName)}
                         onClick={this.onClickNewsItem.bind(this, index)}>
              <div className={styles.title}>{title}</div>
              <div className={styles.wxMpNewsItemImage}
                   style={style}/>
            </div>);
          })}
          {newsItems.length < MAX_ITEM_LENGTH ?
            (<div className={styles.addWxMpNewsItem} onClick={this.onClickAppendNewsItem.bind(this)}>
              <span className={styles.title}>+ 新建消息</span></div>)
            : null}
        </div>
        {clickIndex !== null && <div className={styles.wxMpToolbar}>
          <Button shape="circle" icon={<DeleteOutlined/>}
                  onClick={this.onClickDeleteItem}
                  danger/>
        </div>}
      </div>
      <div className={classnames(styles.wxMpMenuPanel, {})}>
        <Form ref={this.createForm} onValuesChange={this.onValuesChangeWithNewsItems}>
          <div className={styles.wxMpEditorWrapper}>
            <div className={styles.wxMpEditor}>
              <Form.Item name="title"
                         rules={[{ required: true, message: '请输入标题' }]} noStyle>
                <Input className={styles.title} placeholder="请在这里输入标题"/>
              </Form.Item>
              <Form.Item name="author"
                         rules={[{ required: true, message: '请输入作者' }]} noStyle>
                <Input className={styles.author} placeholder="请输入作者"/>
              </Form.Item>
              <Form.Item name="content"
                         rules={[{ required: true, message: '请输入正文' }]} noStyle>
                <TextArea className={styles.textArea}
                          placeholder="从这里开始写正文"
                          allowClear/>
              </Form.Item>
            </div>
            {this.renderCoverAndDigest()}
            {this.renderSettings()}
          </div>
          <div className={styles.bottomToolbar}>
            <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
                    onClick={this.onDone}>保存</Button>
          </div>
        </Form>
      </div>
    </div>);
  }

  renderSettings() {
    return (<>
      <Divider orientation="left">文章设置</Divider>
      <Form.Item name="contentSourceUrl" label="原文链接"
                 rules={[{ required: true, message: '请输入原文链接' }]}>
        <Input className={styles.author} placeholder="请输入原文链接"/>
      </Form.Item>
      <Form.Item name="needOpenComment" label="开启评论">
        <Switch checkedChildren="开" unCheckedChildren="关"/>
      </Form.Item>
      <Form.Item name="onlyFansCanComment" label="仅粉丝评论">
        <Switch checkedChildren="开" unCheckedChildren="关"/>
      </Form.Item>
    </>);
  }

  renderCoverAndDigest() {
    let { clickIndex, newsItems } = this.state;
    let imageUrl = null;
    if (clickIndex !== null) {
      imageUrl = newsItems[clickIndex]?.originalUrl;
    }

    let loading = null;

    const button = (<div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div>选择封面</div>
    </div>);
    return (<>
      <Divider orientation="left">封面和摘要</Divider>
      <div className={styles.coverAndDigest}>
        <Form.Item name="originalUrl" noStyle>
          <Upload className={styles.cover} name="file"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={this.handleChange}
                  action={`${Config.host()}/api/file/upload`}
                  headers={{
                    Token: `Bearer ${LocalStorage.getToken()}`,
                  }}>
            {imageUrl ? <img src={imageUrl} alt="图片" style={{ width: '100%' }}/> : button}
          </Upload>
        </Form.Item>
        <Form.Item name="digest" noStyle>
          <TextArea className={styles.digest} placeholder="摘要" allowClear/>
        </Form.Item>
      </div>
    </>);
  }


  handleChange = ({ file, fileList }) => {
    let result = file.response;
    if (result) {
      if (UiUtils.showErrorMessageIfExits(result)) {
        file.url = result.data;
        this.setState(({ clickIndex, newsItems }) => {
          newsItems[clickIndex].originalUrl = file.url;
          return {
            newsItems,
          };
        }, this.forceUpdate);
      }
    }
  };

  onValuesChangeWithNewsItems = (changedValues, allValues) => {
    this.setState(({ newsItems, clickIndex }) => {
      newsItems[clickIndex] = {
        ...newsItems[clickIndex],
        ...changedValues,
      };
      return {
        newsItems: newsItems,
      };
    }, this.forceUpdate);
  };

  onDone = () => {
    let { id, newsItems } = this.state;
    let { onDone } = this.props;
    this.createForm.current.validateFields()
      .then(values => {
        onDone({
          id,
          newsItems: [...newsItems],
        });
      })
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
  };

  onClickAppendNewsItem = () => {
    this.setState(({ newsItems }) => {
      return {
        newsItems: [...newsItems, {
          title: '标题',
        }],
      };
    }, this.forceUpdate);
  };

  onClickDeleteItem = () => {
    this.setState(({ newsItems, clickIndex }) => {
      (newsItems || []).splice(clickIndex, 1);
      return ({
        newsItems: newsItems,
        clickIndex: null,
      });
    }, this.forceUpdate);
  };

  /**
   * 标记点击的项目
   * @param index
   * @param e
   */
  onClickNewsItem = (index, e) => {
    e.preventDefault();
    this.setState(({ clickIndex }) => ({
      clickIndex: index,
    }), this.updateActiveItem);
  };

  updateActiveItem = () => {
    let { newsItems = [], clickIndex } = this.state;
    let data = clickIndex === null ? {} : newsItems[clickIndex];
    this.createForm.current.setFieldsValue({
      ...data,
    });
  };

  static propTypes = {
    onDone: PropTypes.func,
    confirmLoading: PropTypes.bool,
    newsItems: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.number,
  };

  static defaultProps = {
    onDone: () => {
    },
    confirmLoading: false,
    newsItems: [{}],
  };
}

export default Index;
