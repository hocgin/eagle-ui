import React from 'react';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ComplexTable from '@/components/ComplexTable';
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Select } from 'antd';
import UiUtils from '@/utils/UiUtils';
import DetailModal from '@/pages/Wx/Material/Modal/DetailModal';
import { connect } from 'dva';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { DownOutlined } from '@ant-design/icons';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import Goto from '@/utils/Goto';
import ValidUtils from '@/utils/ValidUtils';
import { WxMaterial } from '@/pages/Wx/Material/WxMaterial';

@connect(({ global, wxMpMaterial: { paging }, dataDict: { allWxMpMaterialType }, wxMpConfig: { all }, loading, ...rest }) => {
  return {
    paging: paging,
    allMpConfig: all,
    allWxMpMaterialType: allWxMpMaterialType,
    pagingLoading: loading.effects['wxMpMaterial/paging'],
  };
}, dispatch => ({
  $paging: (args = {}) => dispatch({ type: 'wxMpMaterial/paging', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
  $getAllWxMpMaterialType: (args = {}) => dispatch({ type: 'dataDict/getAllWxMpMaterialType', ...args }),
}))
class index extends React.Component {
  state = {
    searchValue: {},
    selectedRows: [],
    operateRow: null,
    visibleCreate: false,
    visibleUpdate: false,
    visibleDetail: false,
  };

  componentDidMount() {
    let { $getAllWithWxMpConfig, $getAllWxMpMaterialType } = this.props;
    $getAllWithWxMpConfig();
    $getAllWxMpMaterialType();
    this.paging();
  }

  tableColumns = [{
    title: 'Media ID',
    dataIndex: 'materialResult',
    key: 'materialResult',
    fixed: 'left',
    render: ({ mediaId }) => <span>{mediaId}</span>,
  }, {
    title: 'APP ID',
    dataIndex: 'appid',
    key: 'appid',
  }, {
    title: '素材类型',
    dataIndex: 'materialTypeName',
    key: 'materialTypeName',
    render: (val, { materialType }) => <span>{val}</span>,
  }, {
    title: '素材URL',
    dataIndex: 'materialType',
    key: 'materialType',
    render: (val, { materialType, appid, materialResult: { mediaId } }) => {
      let mediaUrl = WxMaterial.getMediaUrl(materialType, appid, mediaId);
      return mediaUrl ? <a href={`${mediaUrl}`} target="_blank">下载</a> : `暂无`;
    },
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '最后更新时间',
    dataIndex: 'lastUpdatedAt',
    key: 'lastUpdatedAt',
    render: val => <span>{DateFormatter.timestampAs(val)}</span>,
  }, {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    render: (text, record) => {
      const onClickOperateRow = (record, e) => {
        this.setState({
            operateRow: record.id,
          },
          () => {
            this.onClickMenuRowItem(e, record);
          });
      };

      const MoreMenus = (<Menu onClick={onClickOperateRow.bind(this, record)}>
        <Menu.Item key="rowRefresh">
          <del>下载</del>
        </Menu.Item>
      </Menu>);

      return <>
        <a href={null}
           rel="noopener noreferrer"
           onClick={onClickOperateRow.bind(this, record, { key: 'rowDetail' })}>查看详情</a>
        <Divider type="vertical"/>
        <Dropdown overlay={MoreMenus}>
          <a href={null}
             rel="noopener noreferrer">
            更多操作 <DownOutlined/>
          </a>
        </Dropdown>
      </>;
    },
  }];

  render() {
    let { selectedRows, visibleCreate, visibleUpdate, visibleDetail, operateRow } = this.state;
    let { paging, pagingLoading, allWxMpMaterialType } = this.props;
    const BatchMenus = null;
    const CreateMenus = (<Menu onClick={this.onClickToolbarButton}>
      <Menu.Item key="createNews">创建图文素材</Menu.Item>
      <Menu.Item key="createVoice">创建音频素材</Menu.Item>
      <Menu.Item key="createVideo">创建视频素材</Menu.Item>
      <Menu.Item key="createImage">创建图片素材</Menu.Item>
    </Menu>);

    let toolbarChildren = (<Dropdown overlay={CreateMenus}>
      <Button type="primary" icon={<PlusOutlined/>} htmlType="button">创建素材 <DownOutlined/></Button>
    </Dropdown>);
    return (<PageHeaderWrapper wrapperClassName={styles.page}>
      <ComplexTable toolbarTitle={<>素材管理 {this.renderAppIdWithSelect()}</>}
                    toolbarMenu={BatchMenus}
                    toolbarChildren={toolbarChildren}
                    searchBarChildren={[
                      <Form.Item key="0" label="关键词搜索"
                                 name="keyword">
                        <Input style={{ width: '100%' }} placeholder="请输入关键词"/>
                      </Form.Item>,
                      <Form.Item key="1" label="素材类型"
                                 name="materialType">
                        <Select defaultValue={null}>
                          <Select.Option>全部</Select.Option>
                          {(allWxMpMaterialType || []).map(({ key, value }) =>
                            <Select.Option value={value}>{key}</Select.Option>)}
                        </Select>
                      </Form.Item>,
                    ]}
                    tableLoading={pagingLoading}
                    tableData={{
                      list: UiUtils.fastGetPagingList(paging),
                      pagination: UiUtils.fastPagingPagination(paging),
                    }}
                    selectedRows={selectedRows}
                    onSelectRow={this.onChangeSelectRow}
                    onClickSearch={this.onClickSearch}
                    onChangeStandardTable={this.onChangeStandardTable}
                    tableColumns={this.tableColumns}/>
      {visibleDetail && <DetailModal visible={visibleDetail}
                                     id={operateRow}
                                     onClose={this.onClickCloseDetailModal}/>}
    </PageHeaderWrapper>);
  }

  renderAppIdWithSelect() {
    let { allMpConfig = [] } = this.props;

    return (<Select defaultValue={null} onSelect={this.onSelectAppId}>
      <Select.Option>全部</Select.Option>
      {(allMpConfig || []).map(({ appid, title }) => <Select.Option value={appid}>{title}</Select.Option>)}
    </Select>);
  }

  onSelectAppId = (value) => {
    this.setState(({ searchValue }) => ({
      searchValue: { ...searchValue, appid: value },
    }));
  };

  /**
   * 条件变更
   * @param pageSize
   * @param current
   * @param filtersArg
   * @param sorter
   */
  onChangeStandardTable = ({ pageSize, current }, filtersArg, sorter) => {
    this.setState(({ searchValue }) => ({
      searchValue: {
        ...searchValue,
        size: pageSize,
        page: current,
      },
    }), this.paging);
  };

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    switch (key) {
      case 'rowDetail': {
        this.setState({
          visibleDetail: true,
        });
        break;
      }
      default: {
        Modal.error({
          content: '无效操作',
        });
      }
    }
  };

  onClickToolbarButton = ({ key }) => {
    let { searchValue: { appid } } = this.state;
    switch (key) {
      case `createNews`: {
        if (ValidUtils.isTrue(!!appid, '请选择公众号')) {
          Goto.wxMaterialCreateNews(appid);
        }
        break;
      }
      case `createVoice`: {
        if (ValidUtils.isTrue(!!appid, '请选择公众号')) {
          Goto.wxMaterialCreateVoice(appid);
        }
        break;
      }
      case `createImage`: {
        if (ValidUtils.isTrue(!!appid, '请选择公众号')) {
          Goto.wxMaterialCreateImage(appid);
        }
        break;
      }
      case `createVideo`: {
        if (ValidUtils.isTrue(!!appid, '请选择公众号')) {
          Goto.wxMaterialCreateVideo(appid);
        }
        break;
      }
      default: {
        Modal.error({ content: '无效操作' });
      }
    }
  };

  /**
   * 点击查询按钮
   * @param values
   */
  onClickSearch = (values) => {
    this.setState(({ searchValue }) => ({
      searchValue: {
        ...searchValue,
        ...values,
      },
    }), this.paging);
  };

  /**
   * 分页搜索
   */
  paging = () => {
    let { searchValue } = this.state;
    let { $paging } = this.props;
    $paging({
      payload: {
        ...searchValue,
      },
    });
  };

  onChangeSelectRow = (rows) => {
    let rowsId = rows.map(({ id }) => id);
    this.setState({
      selectedRows: rowsId,
    });
  };

  onClickCloseDetailModal = () => {
    this.setState({
      visibleDetail: false,
    });
  };
}

export default index;
