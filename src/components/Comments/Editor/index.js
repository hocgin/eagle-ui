import React from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import { Avatar, Button, Comment, Form, Input } from 'antd';

const TextArea = Input.TextArea;

class Index extends React.PureComponent {
  createForm = React.createRef();

  render() {
    let { user: { avatar }, placeholder, confirmLoading, onSubmit } = this.props;
    return (<Comment className={styles.component}
                     avatar={<Avatar alt="头像" src={avatar}/>}
                     content={<Form ref={this.createForm} onFinish={onSubmit}>
                       <Form.Item name="content">
                         <TextArea rows={4} placeholder={placeholder}/>
                       </Form.Item>
                       <Form.Item>
                         <div className={styles.commentBottom}>
                           <Button htmlType="submit" loading={confirmLoading} type="primary">
                             发表评论
                           </Button>
                         </div>
                       </Form.Item>
                     </Form>}/>);
  }

  static propTypes = {
    user: PropTypes.object,
  };

  static defaultProps = {
    user: {
      avatar: null,
    },
  };
}

export default Index;
