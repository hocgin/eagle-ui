import React from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';
import Utils from '@/utils/utils';
import classnames from 'classnames';

class SearchBar extends React.PureComponent {
    searchBarForm = React.createRef();

    state = {
        isExpand: false,
    };

    render() {
        const { children, className } = this.props;
        let { isExpand } = this.state;
        // let ele = children(this.searchBarForm);
        let ele = children;
        console.log(ele);
        let rowStyle = { width: '100%' };
        return (
          <div className={classnames(styles.tableListForm, className)}>
              <Form ref={this.searchBarForm} onFinish={this.onSubmit} layout="inline">
                  {isExpand ? (Utils.chunk(ele, 3)
                      .map((el, index) => (<Row key={index} style={rowStyle}
                                                gutter={{ md: 24, lg: 24, xl: 24 }}>
                          {el.map((item, index) => (
                            <Col key={index} md={8} sm={24}>
                                {item}
                            </Col>
                          ))}
                      </Row>))
                      .concat(<div key={3} style={{ overflow: 'hidden', width: '100%' }}>
                          <div style={{ float: 'right', marginBottom: 24 }}>
                              <Button type="primary" htmlType="submit">
                                  查询
                              </Button>
                              <Button
                                htmlType="button"
                                style={{ marginLeft: 8 }}
                                onClick={this.onReset}
                              >
                                  重置
                              </Button>
                              <a href={null}
                                 style={{ marginLeft: 8 }}
                                 onClick={this.onClickToggleExpand}>
                                  收起 <UpOutlined/>
                              </a>
                          </div>
                      </div>))
                    : (<Row style={rowStyle} gutter={{ md: 24, lg: 24, xl: 24 }}>
                        {Utils.slice(ele, 2)
                          .map((item, index) => (
                            <Col key={index} md={8} sm={24}>
                                {item}
                            </Col>
                          ))
                          .concat(<Col key={ele.length + 1} md={8} sm={24}>
                                          <span className={styles.submitButtons}>
                                              <Button type="primary" htmlType="submit">
                                                  查询
                                              </Button>
                                              <Button
                                                htmlType="button"
                                                style={{ marginLeft: 8 }}
                                                onClick={this.onReset}
                                              >
                                                  重置
                                              </Button>
                                              <a style={{ marginLeft: 8 }}
                                                 onClick={this.onClickToggleExpand}>
                                                  展开 <DownOutlined/>
                                              </a>
                                          </span>
                          </Col>)}
                    </Row>)}
              </Form>
          </div>
        );
    }

    /**
     * 提交数据
     * - 仅校验通过的会触发上层函数
     * @param values
     */
    onSubmit = values => {
        const { onSubmit } = this.props;
        onSubmit(values);
    };
    /**
     * 重置输入框
     */
    onReset = () => {
        let form = this.searchBarForm.current;
        form.resetFields();
    };

    /**
     * 切换展开状态
     */
    onClickToggleExpand = () => {
        this.setState(({ isExpand }) => ({
            isExpand: !isExpand,
        }));
    };

    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.array,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        children: [],
        onSubmit: fieldsValue => {
        },
    };
}

export default SearchBar;