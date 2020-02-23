import React from 'react';
import { Button, Dropdown, Icon, Menu } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';

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
        const { children, menu, selectedRows } = this.props;
        return (<div className={styles.tableListOperator}>
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
