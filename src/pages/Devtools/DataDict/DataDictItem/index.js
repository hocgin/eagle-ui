import React from 'react';
import { Divider, Modal, Table } from 'antd';
import UiUtils from '@/utils/UiUtils';
import { DateFormatter } from '@/utils/formatter/DateFormatter';
import { connect } from 'dva';
import UpdateModal from './Modal/UpdateModal';
import PropTypes from 'prop-types';
import { EnumFormatter } from '@/utils/formatter/EnumFormatter';

@connect(({ global, dataDict: { paging }, loading, ...rest }) => {
  return {
  };
}, dispatch => ({
  $deletes: (args = {}) => dispatch({ type: 'dataDictItem/deletes', ...args }),
}))
class index extends React.Component {
  state = {
    operateRow: null,
    visibleUpdate: false,
  };

  columns = [{ title: '字典名称', dataIndex: 'title', key: 'title' },
    { title: '标识', dataIndex: 'code', key: 'code' },
    {
      title: '启用状态',
      dataIndex: 'enabledName',
      key: 'enabledName',
      render: (val, { enabled }) => EnumFormatter.enabledStatus(enabled, val),
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
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

        return <>
          <a href={null}
             rel="noopener noreferrer"
             onClick={onClickOperateRow.bind(this, record, { key: 'rowUpdate' })}>修改</a>
          <Divider type="vertical"/>
          <a href={null}
             rel="noopener noreferrer"
             onClick={onClickOperateRow.bind(this, record, { key: 'rowDelete' })}>删除</a>
        </>;
      },
    }];

  render() {
    let { record: { items } } = this.props;
    let { visibleUpdate, operateRow } = this.state;
    return (<>
      <Table columns={this.columns} dataSource={items} pagination={false}/>
      {visibleUpdate && <UpdateModal visible={visibleUpdate}
                                     id={operateRow}
                                     onClose={this.onClickCloseUpdateModal}/>}
    </>);
  }

  /**
   * 每行的【更多操作】
   * @param key
   */
  onClickMenuRowItem = ({ key }) => {
    switch (key) {
      case 'rowDelete': {
        this.onClickShowDeleteModal([this.state.operateRow]);
        break;
      }
      case 'rowUpdate': {
        this.setState({
          visibleUpdate: true,
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

  onClickShowDeleteModal = (ids = []) => {
    let { $deletes, paging } = this.props;
    let props = {
      content: `确认删除选中数据字典项?`,
      onOk() {
        $deletes({
          payload: {
            id: ids,
          },
          callback: paging,
        });
      },
      onCancel() {
        Modal.destroyAll();
      },
    };
    Modal.confirm(props);
  };

  onClickCloseUpdateModal = () => {
    this.setState({
      visibleUpdate: false,
    }, this.props.paging);
  };

  static propTypes = {
    paging: PropTypes.func,
    record: PropTypes.array,
  };

  static defaultProps = {
    paging: () => {
    },
    record: [],
  };
}

export default index;
