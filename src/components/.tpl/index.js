import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';

class Index extends React.PureComponent {
  render() {
    let {} = this.props;
    return (
      <div className={styles.component}>
        <div>tpl</div>
      </div>
    );
  }

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: <></>,
  };
}

export default Index;
