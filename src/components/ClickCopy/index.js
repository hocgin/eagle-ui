import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyOutlined from '@ant-design/icons/lib/icons/CopyOutlined';
import { Tooltip } from 'antd';

class Index extends React.PureComponent {
  render() {
    let { text } = this.props;
    return (<span className={styles.component}>
      <CopyToClipboard text={text} onCopy={this.onClickCopy}>
        <Tooltip placement="topLeft" title="点击复制">
          <CopyOutlined className={styles.icon}/>
        </Tooltip>
      </CopyToClipboard>
    </span>);
  }

  onClickCopy = () => {
    message.success('复制成功 🎉');
  };

  static propTypes = {
    children: PropTypes.node,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: <></>,
  };
}

export default Index;
