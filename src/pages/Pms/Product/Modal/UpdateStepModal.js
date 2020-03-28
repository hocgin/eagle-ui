import React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Steps,
  Switch,
  Table,
  TreeSelect,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import memoizeOne from 'memoize-one';
import PicturesWall from '@/components/PicturesWall';
import isEqual from 'lodash/isEqual';
import Utils from '@/utils/Utils';
import UiUtils from '@/utils/UiUtils';


function getTreePath(parentPath = [], childrenList = []) {
  let result = [];
  for (let i = 0; i < childrenList.length; i++) {
    let { children = [], ...rest } = childrenList[i];
    let path = [...parentPath, { ...rest }];
    if (children && children.length > 0) {
      result.push(...getTreePath(path, children));
    } else {
      result.push(path);
    }
  }
  return result;
}

const memoizeOneGetTreePath = memoizeOne(getTreePath, isEqual);


let labelStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  color: 'rgba(0, 0, 0, 0.85)',
  fontSize: '14px',
  margin: '0 8px 0 2px',
};
let rowStyle = {
  marginBottom: 10,
};

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let defaultValue = {
  publishStatus: true,
};

@connect(({ global, loading, productCategory: { tree }, product: { detail }, ...rest }) => {
  let detailLoading = loading.effects['role/getOne'];
  let itemDetail = detail;
  if (detail) {
    itemDetail = {
      ...detail,
      publishStatus: detail.publishStatus === 1,
    };
  }
  return {
    itemDetail,
    detailLoading,
    productCategoryTree: tree,
    confirmLoading: loading.effects['product/update'],
  };
}, dispatch => ({
  $getProductCategoryTree: (args = {}) => dispatch({ type: 'productCategory/getTree', ...args }),
  $updateOne: (args = {}) => dispatch({ type: 'product/update', ...args }),
  $getOne: (args = {}) => dispatch({ type: 'product/getOne', ...args }),
}))
class index extends React.PureComponent {
  createForm = React.createRef();

  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formValue: defaultValue,
    // 规格树
    specTree: [],
    spec: [],
    specValue: {},
    datasource: [],
  };

  componentWillReceiveProps({ itemDetail }) {
    let sku = itemDetail.sku || [];
    if (sku.length > 0) {
      let spec = (sku[0].spec || []).map(({ key }) => key);
      let specValue = {};
      for (let i = 0; i < sku.length; i++) {
        let spec = sku[i].spec || [];
        for (let j = 0; j < spec.length; j++) {
          let s = spec[j];
          let values = specValue[s.key] || [];
          values.push(s.value);
          specValue[s.key] = Utils.distinct(values);
        }
      }

      console.log(spec, specValue);
      this.setState({
        formValue: itemDetail,
        spec: Utils.distinct(spec || []),
        specValue: specValue,
      }, () => {
        this.updateSpecTree();
      });
    }

  }

  componentDidMount() {
    let { id, $getOne, $getProductCategoryTree } = this.props;
    $getOne({ payload: { id } });
    $getProductCategoryTree({});
  }

  render() {
    const { visible, onClose, detailLoading, itemDetail } = this.props;
    const { step } = this.state;
    if (detailLoading) {
      return <></>;
    }
    return (<Modal width={640}
                   bodyStyle={{ padding: '32px 40px 48px' }}
                   title="新增商品"
                   visible={visible}
                   onCancel={onClose}
                   maskClosable
                   footer={this.Footer()[step]}>
      <Steps size="small" current={step} style={{ marginBottom: 28 }}>
        <Steps.Step title="基本信息"/>
        <Steps.Step title="展示信息"/>
        <Steps.Step title="商品规格"/>
      </Steps>
      <Form ref={this.createForm}
            initialValues={{ ...itemDetail }}>
        {this.Step(step)}
      </Form>
    </Modal>);
  }

  /**
   * 基本信息
   * @return {*[]}
   * @constructor
   */
  Step1 = () => {
    let { productCategoryTree } = this.props;
    return ([
      <Form.Item {...formLayout} label="商品标题"
                 rules={[{ required: true, message: '请输入商品标题' }]}
                 name="title">
        <Input style={{ width: '100%' }} placeholder="请输入商品标题"/>
      </Form.Item>,
      <Form.Item {...formLayout} label="品类"
                 rules={[{ required: true, message: '请输入商品品类' }]}
                 name="productCategoryId">
        <TreeSelect onSelect={this.onSelectRows}
                    allowClear
                    placeholder="请选择商品品类">
          {UiUtils.renderTreeSelectNodes(productCategoryTree)}
        </TreeSelect>
      </Form.Item>,
      <Form.Item {...formLayout} label="采购地"
                 rules={[{ required: false, message: '请输入采购地' }]}
                 name="procurement">
        <Input style={{ width: '100%' }} placeholder="请输入采购地"/>
      </Form.Item>,
      <Form.Item {...formLayout} label="单位"
                 rules={[{ required: false, message: '请输入单位' }]}
                 name="unit">
        <Input style={{ width: '100%' }} placeholder="请输入单位"/>
      </Form.Item>,
      <Form.Item {...formLayout} label="商品重量"
                 rules={[{ required: false, message: '请输入商品重量' }]}
                 name="weight">
        <InputNumber style={{ width: '100%' }} placeholder="请输入商品重量"/>
      </Form.Item>,
      <Form.Item {...formLayout} label="上架状态"
                 name="publishStatus"
                 valuePropName={'checked'}
                 hasFeedback>
        <Switch checkedChildren="上架" unCheckedChildren="下架"/>
      </Form.Item>]);
  };

  /**
   * 展示方案
   * @return {*[]}
   * @constructor
   */
  Step2 = () => {
    let { formValue } = this.state;
    return [
      <Row style={rowStyle}>
        <Col {...formLayout.labelCol} style={labelStyle}>商品展示图:</Col>
      </Row>,
      <Row style={rowStyle}>
        <Col span={21} offset={3}>
          <PicturesWall maxLength={4}
                        defaultFileList={(formValue.photos || []).map(({ url, filename }, index) => ({
                          uid: index,
                          url,
                          status: 'done',
                          name: filename,
                        }))}
                        onChange={this.onChangePhotos}/>
        </Col>
      </Row>];
  };

  /**
   * 商品规格
   * @return {*[]}
   * @constructor
   */
  Step3 = () => {
    const { formValue: { sku }, spec = [], specValue = {} } = this.state;

    const columns = [{
      title: '规格值',
      dataIndex: 'spec',
      fixed: 'left',
      render: (val = [], record, index) => {
        return (val).map(({ value }) => `/${value}`);
      },
    }, {
      title: '库存数量',
      dataIndex: 'stock',
      render: (val, record, index) => <InputNumber placeholder="库存数量" min={0} defaultValue={val}
                                                   onChange={this.onChangeTableValue.bind(this, 'stock', index)}/>,
    }, {
      title: '价格',
      dataIndex: 'price',
      render: (val, record, index) => <InputNumber placeholder="价格" min={0} defaultValue={val}
                                                   onChange={this.onChangeTableValue.bind(this, 'price', index)}/>,
    }, {
      title: 'SKU 编码',
      dataIndex: 'skuCode',
      render: (val, record, index) => {
        console.log(index, val, record);
        return (<Input placeholder="SKU编码" defaultValue={val}
                       onChange={({ target: { value } }) => this.onChangeTableValue('skuCode', index, value)}/>);
      },
    }, {
      title: '图片',
      dataIndex: 'imageUrl',
    }];
    return ([
      <div>
        <Row style={rowStyle}>
          <Col {...formLayout.labelCol} style={labelStyle}>商品规格属性:</Col>
          <Col {...formLayout.wrapperCol}>
            <Select mode="tags" style={{ width: '100%' }}
                    defaultValue={(spec || []).map((item) => item)}
                    onChange={this.onChangeSpec}
                    placeholder="输入新增规格属性"
                    tokenSeparators={[',']}>
            </Select>
          </Col>
        </Row>
        {(spec || []).map((item) => (<Row style={rowStyle}>
          <Col {...formLayout.labelCol} style={labelStyle}>{item}</Col>
          <Col {...formLayout.wrapperCol}>
            <Select mode="tags" style={{ width: '100%' }}
                    placeholder={`请输入 [${item}] 规格值`}
                    defaultValue={(specValue[item] || []).map((item) => item)}
                    onChange={this.onChangeSpecValue.bind(this, item)}
                    tokenSeparators={[',']}/>
          </Col>
        </Row>))}
      </div>,
      <Row>
        <Col span={24}>
          <Table rowKey="_id" bordered
                 style={{ width: '100%' }}
                 dataSource={sku || []} columns={columns} pagination={false}
                 scroll={{
                   x: 500,
                   y: 300,
                 }}/>
        </Col>
      </Row>]);
  };

  Step = (index) => {
    return [this.Step1, this.Step2, this.Step3][index]();
  };

  /**
   * 步骤渲染
   */
  Footer = (index) => {
    let { confirmLoading } = this.props;
    const previousBtn = (
        <Button key="previous" htmlType="button" style={{ float: 'left' }} onClick={this.onPrevious}>上一步 </Button>),
      nextBtn = (<Button key="next" type="primary" htmlType="button" onClick={this.onNextOrDone}>下一步</Button>),
      cancelBtn = (<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消</Button>),
      doneBtn = (<Button key="submit" loading={confirmLoading} htmlType="button" type="primary"
                         onClick={this.onNextOrDone}>完成</Button>);

    return [
      [cancelBtn, nextBtn],
      [previousBtn, cancelBtn, nextBtn],
      [previousBtn, cancelBtn, doneBtn],
    ];
  };

  /**
   * 上一页
   */
  onPrevious = () => {
    this.setState(({ step }) => ({
      step: step - 1,
    }));
  };

  /**
   * 下一页
   */
  onNextOrDone = () => {
    const { $updateOne, onClose } = this.props;
    let { step } = this.state;
    let form = this.createForm.current;
    form.validateFields()
      .then(values => {
        const formValue = {
          ...this.state.formValue,
          ...values,
        };
        this.setState({ formValue }, () => {
          if (step + 1 < this.Footer().length) {
            this.setState({
              step: step + 1,
            });
            return;
          }
          if ((formValue.sku || []).length < 1) {
            message.error('请添加商品规格');
            return;
          }

          $updateOne({
            payload: {
              ...formValue,
              publishStatus: formValue.publishStatus ? 1 : 0,
            },
            callback: () => {
              message.success('提交成功');
              this.setState(({ step }) => ({
                step: 0,
                formValue: {
                  ...defaultValue,
                },
              }), onClose);
              form.resetFields();
            },
          });
        });
      });
  };

  onChangeTableValue = (name, index, value) => {
    let { formValue } = this.state;
    formValue.sku[index][name] = value || [];
    this.setState({
      formValue,
    });
  };

  onChangeSpec = (values) => {
    this.setState({
      spec: [...values],
    }, this.updateSpecTree);
  };

  onChangeSpecValue = (spec, values) => {
    this.setState(({ specValue }) => {
      return {
        specValue: {
          ...specValue,
          [spec]: values,
        },
      };
    }, this.updateSpecTree);
  };

  onChangePhotos = (values) => {
    let photos = (values || []).map(({ url, name }, index) => ({
      filename: name,
      url,
      sort: values.length - index,
    }));
    this.setState(({ formValue }) => {
      formValue.photos = photos;
      return {
        formValue: formValue,
      };
    });
  };

  updateSpecTree = () => {
    let { spec = [], specValue = {} } = this.state;
    let result = [];
    if (spec.length > 1) {
      let key = spec[0];
      let skuValues = specValue[key] || [];
      for (let i = 0; i < skuValues.length; i++) {
        result.push({
          key: key,
          value: skuValues[i],
        });
      }

      let parent = result;
      for (let i = 1; i < spec.length; i++) {
        let key = spec[i];
        let skuValues = specValue[key] || [];
        let items = [];
        for (let i = 0; i < skuValues.length; i++) {
          items.push({
            key: key,
            value: skuValues[i],
          });
        }
        parent = this.getTree(parent, items);
      }
    } else if (spec.length === 1) {
      let key = spec[0];
      let skuValues = specValue[key] || [];
      for (let i = 0; i < skuValues.length; i++) {
        result.push({
          key: key,
          value: skuValues[i],
        });
      }
    }

    this.setState({
      specTree: result,
    }, this.updateTableDatasource);
  };

  getTree = (parents, children) => {
    for (let i = 0; i < parents.length; i++) {
      parents[i].children = children;
    }
    return children;
  };

  updateTableDatasource = () => {
    let { formValue, specTree = [] } = this.state;
    let datasource = formValue.sku || [];
    let treePath = memoizeOneGetTreePath([], specTree) || [];
    let id = (item = []) => `${item.map(({ value }) => value)}`;

    let dataSource = [];
    let ids = datasource.map(({ spec, ...rest }) => ({
      id: id(spec || []),
    }));
    for (let i = 0; i < treePath.length; i++) {
      let item = treePath[i];
      let itemId = id(item);
      let index = ids.findIndex(({ id }) => id === itemId);
      let data = {
        _id: itemId,
      };
      if (index > -1) {
        data = {
          ...data,
          ...datasource[index],
        };
      }
      dataSource.push({
        ...data,
        spec: item,
      });
      console.log('取值', itemId, index, data, datasource);
    }
    formValue.sku = dataSource;
    this.setState({
      formValue: {
        ...formValue,
      },
    }, this.forceUpdate);
  };


  /**
   * 取消
   */
  onCancel = () => {
    let { onClose } = this.props;
    onClose();
  };

  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };
}

export default index;
