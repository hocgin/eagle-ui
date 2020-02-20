import React from 'react';
import styles from './index.less';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }


  render() {
    let {} = this.props;
    return (
      <div className={styles.page}>
      </div>
    );
  }
}

export default index;
