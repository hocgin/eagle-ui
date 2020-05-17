import React from 'react';
import styles from './index.less';
import VoiceCircle from '@/components/VoiceCircle';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  render() {
    let {} = this.props;
    return (<div className={styles.page}>
      <VoiceCircle/>
    </div>);
  }
}

export default index;
