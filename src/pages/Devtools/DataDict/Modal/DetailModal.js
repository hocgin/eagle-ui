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
              dataDict: { detail, allPlatform, allAuthorityType },
              loading, ...rest
          }) => {

    return {
        dataDictDetail: detail,
        detailLoading: loading.effects['dataDict/getOne'],
    };
}, dispatch => ({
    $getDataDict: (args = {}) => dispatch({ type: 'dataDict/getOne', ...args }),
}))
class DetailModal extends PureComponent {
    componentDidMount() {
        let { id, $getDataDict } = this.props;
        $getDataDict({ payload: { id: id } });
    }

    render() {
        const { dataDictDetail, detailLoading, visible, onClose, ...rest } = this.props;
        if (detailLoading) {
            return null;
        }
        let { title, createdAt, creatorName, lastUpdatedAt, remark, lastUpdaterName, code, enabledName, items } = dataDictDetail;
        return (<Modal width={640}
                       bodyStyle={{ padding: '10px 20px 48px' }}
                       title="数据字典详情"
                       visible={visible}
                       maskClosable
                       onCancel={onClose}
                       footer={this.renderFooter()}>
            <ComplexCollapse defaultActiveKey={['1']}>
                <Panel header="基础信息" key="1">
                    <TextRow first={true} title={'数据字典名称'}>{title}</TextRow>
                    <TextRow title={'数据字典码'}>{code}</TextRow>
                    <TextRow title={'数据字典描述'}>{remark || '暂无'}</TextRow>
                    <TextRow title={'开启状态'}>{enabledName}</TextRow>
                    <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
                    <TextRow title={'创建人'}>{creatorName}</TextRow>
                    <TextRow title={'最后更新时间'}>{DateFormatter.timestampAs(lastUpdatedAt)}</TextRow>
                    <TextRow title={'最后更新人'}>{lastUpdaterName || '暂无'}</TextRow>
                </Panel>
                <Panel header="字典项列表" key="2">
                    {(items || []).map(({ title, code, remark, enabledName }, index) => (<>
                        <span>{title}</span>
                        <TextRow first={true} title={'字典项码'}>{code}</TextRow>
                        <TextRow title={'开启状态'}>{enabledName}</TextRow>
                        <TextRow title={'字典项备注'}>{remark}</TextRow>
                    </>))}
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