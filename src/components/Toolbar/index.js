import React from 'react';
import { Button, Dropdown, Icon } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Toolbar extends React.PureComponent {
    static propTypes = {
        selectedRows: PropTypes.array,
        menu: PropTypes.node,
        children: PropTypes.node,
    };

    static defaultProps = {
        selectedRows: [],
        menu: null,
        children: null,
    };

    render() {
        const { children, menu, selectedRows, className, style } = this.props;
        return (<div className={classnames(styles.tableListOperator, className)} style={style}>
            {children}
            {selectedRows.length > 0 &&
            menu && (<Dropdown overlay={menu}>
                <Button htmlType="button">
                    更多操作 <Icon type="down"/>
                </Button>
            </Dropdown>)}
        </div>);
    }
}
