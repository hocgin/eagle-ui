import React from 'react';
import styles from './index.less';
import * as classnames from 'classnames';
import PropTypes from 'prop-types';
import PageHeader from '@/components/PageHeader';
import MenuContext from '@/layouts/BasicLayout/MenuContext';

class Index extends React.PureComponent {
  render() {
    let { children, contentWidth, wrapperClassName, top, ...restProps } = this.props;
    return (<div className={classnames(styles.component, wrapperClassName)}>
      {top}
      <MenuContext.Consumer>{value => (<PageHeader {...value} {...restProps}/>)}</MenuContext.Consumer>
      {children ? (<div className={styles.content}>
        {children}
      </div>) : null}
    </div>);
  }

  static propTypes = {
    children: PropTypes.node,
    top: PropTypes.node,
    wrapperClassName: PropTypes.string,
  };

  static defaultProps = {
    children: <></>,
    top: null,
    wrapperClassName: null,
  };
}

export default Index;
