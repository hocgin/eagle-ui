import styles from './index.less';

function BasicLayout(props) {
  return (
    <div className={styles.component}>
      {props.children}
    </div>
  );
}

export default BasicLayout;
