import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';


@connect(({
            global,
            order: { detail },
            loading, ...rest
          }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['order/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'order/getOne', ...args }),
}))
class index extends React.Component {

  render() {
    const { detailLoading, detail } = this.props;
    if (detailLoading) {
      return <></>;
    }


    return (<PageHeaderWrapper className={styles.page}
                               logo={<span>LOGO</span>}
                               action={<span>action</span>}
                               content={<span>content</span>}
                               extraContent={<span>extraContent</span>}
                               tabBarExtraContent={<span>extraContent</span>}
                               title="退费详情">
      退费详情
    </PageHeaderWrapper>);
  }

}

export default index;
