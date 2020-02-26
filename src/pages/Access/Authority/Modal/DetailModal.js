import React, { PureComponent } from 'react';
import { Button, Collapse, Form, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';

const { Panel } = Collapse;

@connect(({
              global,
              authority: { authorityTree, detail },
              dataDict: { allPlatform, allAuthorityType },
              loading, ...rest
          }) => {

    return {
        data: authorityTree,
        authorityDetail: detail,
        allPlatform: allPlatform,
        allAuthorityType: allAuthorityType,
        detailLoading: loading.effects['authority/getAuthority'],
    };
}, dispatch => ({
    $getAuthorityTree: (args = {}) => dispatch({ type: 'authority/getAuthorityTree', ...args }),
    $updateOneAuthority: (args = {}) => dispatch({ type: 'authority/updateOne', ...args }),
    $getAuthority: (args = {}) => dispatch({ type: 'authority/getAuthority', ...args }),
    $getAllPlatform: (args = {}) => dispatch({ type: 'dataDict/getAllPlatform', ...args }),
    $getAllAuthorityType: (args = {}) => dispatch({ type: 'dataDict/getAllAuthorityType', ...args }),
}))
@Form.create()
class DetailModal extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        id: PropTypes.number,
    };

    static defaultProps = {
        visible: false,
        detailLoading: true,
        id: null,
        onClose: () => {
        },
    };

    state = {
        // 待提交的值
        formValue: {},
    };

    constructor(props) {
        super(props);
        console.log('Update', this.props);
    }

    componentDidMount() {
        let { id, $getAuthority, $getAuthorityTree, $getAllPlatform, $getAllAuthorityType } = this.props;
        $getAuthority({ payload: { id: id } });
        $getAuthorityTree();
        $getAllPlatform();
        $getAllAuthorityType();
    }

    render() {
        const { form, visible, detailLoading, data, onClose, allPlatform, authorityDetail, allAuthorityType, ...rest } = this.props;
        if (detailLoading) {
            return null;
        }
        let { title, createdAt, creatorName, lastUpdateAt, lastUpdaterName, typeName, authorityCode, platformName, parentName, enabledName, roles } = authorityDetail;
        return (<Modal width={640}
                       bodyStyle={{ padding: '10px 20px 48px' }}
                       title="权限详情"
                       visible={visible}
                       maskClosable
                       onCancel={onClose}
                       footer={this.renderFooter()}>
            <ComplexCollapse defaultActiveKey={['1']}>
                <Panel header="基础信息" key="1">
                    <TextRow first={true} title={'父级名称'}>{parentName || '顶级'}</TextRow>
                    <TextRow title={'权限名称'}>{title}</TextRow>
                    <TextRow title={'权限类型'}>{typeName}</TextRow>
                    <TextRow title={'权限码'}>{authorityCode}</TextRow>
                    <TextRow title={'平台'}>{platformName}</TextRow>
                    <TextRow title={'开启状态'}>{enabledName}</TextRow>
                    <TextRow title={'创建时间'}>{createdAt}</TextRow>
                    <TextRow title={'创建人'}>{creatorName}</TextRow>
                    <TextRow title={'最后更新时间'}>{lastUpdateAt || '暂无'}</TextRow>
                    <TextRow title={'最后更新人'}>{lastUpdaterName || '暂无'}</TextRow>
                </Panel>
                <Panel header="关联角色" key="2">
                    {(roles || []).map(({ title, roleCode }, index) =>
                      <TextRow first={index === 0}
                               title={'角色名称'}>{title}({roleCode})</TextRow>)}
                </Panel>
            </ComplexCollapse>
        </Modal>);
    }

    renderFooter = () => {
        return ([<Button key="cancel" htmlType="button" type="primary" onClick={this.onCancel}>退出 </Button>]);
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
            form: { validateFieldsAndScroll },
            onClose,
            $updateOneAuthority,
        } = this.props;
        validateFieldsAndScroll((err, { enabled, ...values }) => {
            if (err) {
                let text = Utils.getErrorMessage(err);
                message.error(text);
                return;
            }
            $updateOneAuthority({
                payload: {
                    ...values,
                    id: id,
                    enabled: enabled ? 1 : 0,
                },
                callback: () => {
                    message.success('修改成功');
                    onClose();
                },
            });
        });
    };
}

export default DetailModal;