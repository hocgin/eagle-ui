import React from 'react';
import PropTypes from 'prop-types';
import Config from '@/config';
import LocalStorage from '@/utils/LocalStorage';
import { Upload } from 'antd';

class Index extends React.PureComponent {
  render() {
    let { children, ...rest } = this.props;
    return (<Upload {...rest}
                    action={`${Config.host()}/api/file/upload`}
                    headers={{ Token: `Bearer ${LocalStorage.getToken()}` }}>
      {children}
    </Upload>);
  }

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: <></>,
  };
}

export default Index;
