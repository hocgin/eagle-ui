import React, { PureComponent } from 'react';
import { Button, Collapse, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({
              global,
              authority: { authorityTree, detail },
              loading, ...rest
          }) => {

    return {
        authorityDetail: detail,
        detailLoading: loading.effects['authority/getAuthority'],
    };
}, dispatch => ({
    $updateOneAuthority: (args = {}) => dispatch({ type: 'authority/updateOne', ...args }),
    $getAuthority: (args = {}) => dispatch({ type: 'authority/getAuthority', ...args }),
}))
class DetailModal extends PureComponent {

    componentDidMount() {
        let { id, $getAuthority } = this.props;
        $getAuthority({ payload: { id: id } });
    }

    render() {
        const { visible, detailLoading, onClose, authorityDetail } = this.props;
        console.log(detailLoading);
        if (detailLoading) {
            return null;
        }
        let { title, createdAt, creatorName, lastUpdatedAt, lastUpdaterName, typeName, authorityCode, platformName, parentName, enabledName, roles } = authorityDetail;
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
                    <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
                    <TextRow title={'创建人'}>{creatorName}</TextRow>
                    <TextRow title={'最后更新时间'}>{DateFormatter.timestampAs(lastUpdatedAt)}</TextRow>
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

    static propTypes = {
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        id: PropTypes.number.isRequired,
    };

    static defaultProps = {
        visible: false,
        detailLoading: true,
        id: null,
        onClose: () => {
        },
    };
}


export default DetailModal;