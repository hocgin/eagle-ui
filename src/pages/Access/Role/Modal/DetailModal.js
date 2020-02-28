import React, { PureComponent } from 'react';
import { Button, Collapse, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Utils from '@/utils/utils';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';

const { Panel } = Collapse;

@connect(({
              global,
              role: { detail },
              dataDict: { allPlatform, allAuthorityType },
              loading, ...rest
          }) => {

    return {
        roleDetail: detail,
        detailLoading: loading.effects['role/getOne'],
    };
}, dispatch => ({
    $getRole: (args = {}) => dispatch({ type: 'role/getOne', ...args }),
}))
class DetailModal extends PureComponent {
    componentDidMount() {
        let { id, $getRole } = this.props;
        $getRole({ payload: { id: id } });
    }

    render() {
        const { roleDetail, detailLoading, visible, onClose, ...rest } = this.props;
        if (detailLoading) {
            return null;
        }
        let { title, createdAt, creatorName, lastUpdatedAt, remark, lastUpdaterName, roleCode, platformName, enabledName, authorities } = roleDetail;
        return (<Modal width={640}
                       bodyStyle={{ padding: '10px 20px 48px' }}
                       title="角色详情"
                       visible={visible}
                       maskClosable
                       onCancel={onClose}
                       footer={this.renderFooter()}>
            <ComplexCollapse defaultActiveKey={['1']}>
                <Panel header="基础信息" key="1">
                    <TextRow first={true} title={'角色名称'}>{title}</TextRow>
                    <TextRow title={'角色码'}>{roleCode}</TextRow>
                    <TextRow title={'平台'}>{platformName}</TextRow>
                    <TextRow title={'角色描述'}>{remark || '暂无'}</TextRow>
                    <TextRow title={'开启状态'}>{enabledName}</TextRow>
                    <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
                    <TextRow title={'创建人'}>{creatorName}</TextRow>
                    <TextRow title={'最后更新时间'}>{DateFormatter.timestampAs(lastUpdatedAt)}</TextRow>
                    <TextRow title={'最后更新人'}>{lastUpdaterName || '暂无'}</TextRow>
                </Panel>
                <Panel header="拥有的权限" key="2">
                    {(authorities || []).map(({ title, authorityCode }, index) =>
                      <TextRow first={index === 0}
                               title={'权限名称'}>{title}({authorityCode})</TextRow>)}
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