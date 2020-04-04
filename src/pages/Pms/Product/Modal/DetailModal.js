import React, { PureComponent } from 'react';
import { Button, Carousel, Collapse, Modal, Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Img from 'react-image';
import TextRow from '@/components/TextRow';
import ComplexCollapse from '@/components/ComplexCollapse';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

const { Panel } = Collapse;

@connect(({
            global,
            product: { detail },
            loading, ...rest
          }) => {
  return {
    detail: detail,
    detailLoading: loading.effects['product/getOne'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'product/getOne', ...args }),
}))
class DetailModal extends PureComponent {

  componentDidMount() {
    let { id, $getOne } = this.props;
    $getOne({ payload: { id: id } });
  }


  columns = [{
    title: '规格值',
    dataIndex: 'spec',
    fixed: 'left',
  }, {
    title: '库存数量',
    dataIndex: 'stock',
  }, {
    title: '价格',
    dataIndex: 'price',
  }, {
    title: 'SKU 编码',
    dataIndex: 'skuCode',
  }, {
    title: '图片',
    dataIndex: 'imageUrl',
  }];

  render() {
    const { visible, detailLoading, onClose, detail } = this.props;
    if (detailLoading) {
      return <></>;
    }
    let {
      title, createdAt, creatorName, lastUpdatedAt, lastUpdaterName,
      publishStatus, publishStatusName, productCategoryName, photos, sku,
      procurement,
      unit,
      weight,
    } = detail;


    if (sku.length > 0) {
      let spec = (sku[0].spec || []).map(({ key }, index) => ({
        title: `${key}`,
        dataIndex: 'spec',
        key: 'spec',
        render: (val) => {
          return val[index].value;
        },
      }));
      this.columns[0].children = spec;
    }


    return (<Modal width={640}
                   bodyStyle={{ padding: '10px 20px 48px' }}
                   title="商品详情"
                   visible={visible}
                   maskClosable
                   onCancel={onClose}
                   footer={this.renderFooter()}>
      <ComplexCollapse defaultActiveKey={['1']}>
        <Panel header="基础信息" key="1">
          <TextRow first={true}
                   title={'商品名称'}>{title}</TextRow>
          <TextRow title={'商品品类'}>{productCategoryName}</TextRow>
          <TextRow title={'产地'}>{procurement}</TextRow>
          <TextRow title={'单位'}>{unit}</TextRow>
          <TextRow title={'商品重量(克)'}>{weight}</TextRow>
          <TextRow title={'上架状态'}>{EnumFormatter.publishStatus(publishStatus, publishStatusName)}</TextRow>
          <TextRow title={'创建时间'}>{DateFormatter.timestampAs(createdAt)}</TextRow>
          <TextRow title={'创建人'}>{creatorName}</TextRow>
          <TextRow title={'最后更新时间'}>{DateFormatter.timestampAs(lastUpdatedAt)}</TextRow>
          <TextRow title={'最后更新人'}>{lastUpdaterName || '暂无'}</TextRow>
        </Panel>
        <Panel header="商品图片列表" key="2">
          <Carousel>
            {(photos || []).map(({ url }, index) => <Img src={url}/>)}
          </Carousel>
        </Panel>
        <Panel header="商品规格" key="3">
          <Table key="specTable" bordered
                 dataSource={sku} columns={this.columns} pagination={false} scroll={{
            x: 500,
            y: 300,
          }}/>
        </Panel>
      </ComplexCollapse>
    </Modal>);
  }

  renderFooter = () => {
    return ([<Button key="cancel" htmlType="button" type="primary" onClick={this.onCancel}>退出</Button>]);
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
