import React, { PureComponent } from 'react';
import { Button, Form, message, Modal, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};

@connect(({ global, authority: { authorityTree }, role: { detail }, loading, ...rest }) => {
    console.log(loading.effects['role/detail']);
    return {
        roleDetail: detail,
        authorityTree: authorityTree,
        detailLoading: loading.effects['role/getOne'],
        confirmLoading: loading.effects['role/grantAuthority'],
    };
}, dispatch => ({
    $getRole: (args = {}) => dispatch({ type: 'role/getOne', ...args }),
    $grantAuthority: (args = {}) => dispatch({ type: 'role/grantAuthority', ...args }),
    $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
}))
class GrantModal extends PureComponent {
    grantForm = React.createRef();

    componentDidMount() {
        let { $getRole, $getAuthorityTree, id } = this.props;
        $getRole({ payload: { id } });
        $getAuthorityTree();
    }

    render() {
        const { visible, onClose, roleDetail, detailLoading, authorityTree } = this.props;
        if (detailLoading) {
            return null;
        }

        let authoritiesIds = (roleDetail.authorities || []).map(({ id }) => id);
        return (<Modal width={640}
                       bodyStyle={{ padding: '32px 40px 48px' }}
                       title="角色权限"
                       visible={visible}
                       maskClosable
                       onCancel={onClose}
                       footer={this.renderFooter()}>
            <Form ref={this.grantForm}
                  initialValues={{ authorities: authoritiesIds }}>
                <Form.Item {...formLayout} label="选择权限" hasFeedback
                           rules={[{ required: false, message: '请选择权限' }]}
                           name="authorities">
                    <TreeSelect allowClear
                                treeCheckable
                                multiple={true}
                                placeholder="请选择权限列表"
                                style={{ width: '100%' }}>
                        {UiUtils.renderTreeSelectNodes(authorityTree)}
                    </TreeSelect>
                </Form.Item>
            </Form>
        </Modal>);
    }

    renderFooter = () => {
        let { confirmLoading } = this.props;
        return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
            <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
                    onClick={this.onDone}>完成</Button>]);
    };

    onSearchKeyword = (keyword) => {
        let { $pagingRole } = this.props;
        $pagingRole({
            keyword: keyword,
        });
    };

    /**
     * 取消
     */
    onCancel = () => {
        let { onClose } = this.props;
        onClose();
    };

    /**
     * 完成
     */
    onDone = (e) => {
        e.preventDefault();
        const {
            id,
            onClose,
            $grantAuthority,
        } = this.props;
        let form = this.grantForm.current;
        form.validateFields()
          .then(({ ...values }) => {
              $grantAuthority({
                  payload: {
                      id,
                      ...values,
                  },
                  callback: () => {
                      message.success('授权完成');
                      form.resetFields();
                      onClose();
                  },
              });
          })
          .catch(err => message.error(Utils.getErrorMessage(err)));
    };

    static propTypes = {
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        id: PropTypes.number.isRequired,
    };

    static defaultProps = {
        visible: false,
        authorityTree: [],
        detailLoading: true,
        onClose: () => {
        },
    };

}

export default GrantModal;