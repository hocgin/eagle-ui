import React from 'react';
import styles from './index.less';
import WxMpNews from '@/pages/Wx/Material/components/WxMpNews';

class index extends React.Component {
  state = {
    newsItems: [],
  };

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
  }

  render() {
    let {} = this.props;
    return (<div className={styles.page}>
      <WxMpNews onDone={(values) => {
        console.log('values', values);
      }}/>
    </div>);
  }
}

export default index;
