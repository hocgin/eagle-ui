import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

class Index extends React.PureComponent {
  render() {
    let { title, children, first } = this.props;
    return (
      <div className={classnames(styles.component, {
        [styles.borderTop]: first
      })}>
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{children}</span>
      </div>
    );
  }
}

export default Index;
