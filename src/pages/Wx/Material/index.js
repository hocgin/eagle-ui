import React from 'react';
import styles from './index.less';
import VoiceCard from '@/components/VoiceCard';

class index extends React.Component {

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  render() {
    let {} = this.props;
    return (<div className={styles.page}>
      <VoiceCard/>
    </div>);
  }
}

export default index;
