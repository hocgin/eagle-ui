import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Radio, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';
import MinusCircleOutlined from '@ant-design/icons/lib/icons/MinusCircleOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { Data } from '@/pages/Wx/WxConsts';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const { Option } = Select;

let defaultValue = {
  pageType: `url`,
};

@connect(({ global, wxMpUser: { complete }, wxMpMessageTemplate: { detail }, loading, ...rest }) => {
  return {
    detail: detail,
    completeUser: complete,
    confirmLoading: loading.effects['wxMpMessage/sendTemplateMessageToUser'],
  };
}, dispatch => ({
  $getOne: (args = {}) => dispatch({ type: 'wxMpMessageTemplate/getOne', ...args }),
  $getCompleteUser: (args = {}) => dispatch({ type: 'wxMpUser/getComplete', ...args }),
  $sendTemplateMessageToUser: (args = {}) => dispatch({ type: 'wxMpMessage/sendTemplateMessageToUser', ...args }),
}))
class index extends PureComponent {
  createForm = React.createRef();

  componentDidMount() {
    let { id, $getOne, $getCompleteUser } = this.props;
    $getOne({
      payload: { id }, callback: ({ appid }) => {
        $getCompleteUser({ payload: { appid } });
      },
    });
  }

  render() {
    const { visible, onClose, completeUser, detail } = this.props;
    if (!detail) {
      return null;
    }
    let { content } = detail;

    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="发送模版消息"
             visible={visible}
             onCancel={onClose}
             maskClosable
             footer={this.renderFooter()}>
        <Form ref={this.createForm} initialValues={{ ...defaultValue }}>
          <Form.Item {...formLayout} label="接收人"
                     rules={[{ required: true, message: '请输入编号或关键词搜索' }]}
                     name="toUsers">
            <Select allowClear showSearch
                    mode="multiple"
                    labelInValue
                    filterOption={false}
                    onSearch={this.onSearchWithUser}
                    notFoundContent="暂无数据"
                    placeholder="请输入编号或关键词搜索">
              {(completeUser || []).map(({ id, nickname, openid }) => <Option
                value={id}>{nickname} - {openid}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item {...formLayout} label="模版内容">
            {content}
          </Form.Item>
          <Form.List name="data">
            {(fields, { add, remove }) => {
              return <>
                {fields.map((field, index) => {
                  return (<Form.Item  {...formLayout} label={`参数-${index}`}
                                      required={false} key={field.key} shouldUpdate>
                    <Form.Item rules={[{ required: false, message: '请输入变量名称' }]}
                               name={[field.name, 'name']}
                               noStyle>
                      <Input style={{ width: '100%' }} placeholder="变量名称"/>
                    </Form.Item>
                    <Form.Item rules={[{ required: false, message: '请输入值' }]} name={[field.name, 'value']}
                               noStyle>
                      <Input style={{ width: '100%' }} placeholder="值"/>
                    </Form.Item>
                    <Form.Item rules={[{ required: false, message: '请输入颜色' }]} name={[field.name, 'color']}
                               noStyle>
                      <Input style={{ width: '100%' }} placeholder="颜色"/>
                    </Form.Item>
                    {fields.length > 1 ? (<MinusCircleOutlined onClick={() => {
                      remove(field.name);
                    }}/>) : null}
                  </Form.Item>);
                })}

                <Form.Item {...{ wrapperCol: { span: 13, push: 7 } }}>
                  <Button type="dashed" onClick={add}>
                    <PlusOutlined/> 添加变量
                  </Button>
                </Form.Item>
              </>;
            }}
          </Form.List>
          <Form.Item  {...formLayout} label="打开方式"
                      rules={[{ required: true, message: '请选择打开方式' }]}
                      name="pageType">
            <Radio.Group>
              {(Data.getTemplateMessagePageType() || []).map(({ key, value }) =>
                <Radio.Button value={value}>{key}</Radio.Button>)}
            </Radio.Group>
          </Form.Item>
          <Form.Item shouldUpdate>
            {({ getFieldValue }) => {
              let msgType = getFieldValue('pageType');
              return (<>
                {msgType === `url`
                  ? <Form.Item {...formLayout} label="url"
                               rules={[{ required: false, message: '请输入url' }]}
                               name="url">
                    <Input style={{ width: '100%' }} placeholder="请输入url"/>
                  </Form.Item>
                  : <>
                    <Form.Item {...formLayout} label="跳转小程序方式"
                               name={['miniProgram', 'usePath']}
                               valuePropName={'checked'}>
                      <Switch checkedChildren="Page Path" unCheckedChildren="APP ID"/>
                    </Form.Item>
                    <Form.Item shouldUpdate>
                      {({ getFieldValue }) => {
                        let usePath = getFieldValue(['miniProgram', 'usePath']);
                        return (<>
                          {usePath ? <Form.Item {...formLayout} label="Page Path"
                                                rules={[{ required: true, message: '请输入pagePath' }]}
                                                name={['miniProgram', 'pagePath']}>
                              <Input style={{ width: '100%' }} placeholder="请输入pagePath"/>
                            </Form.Item>
                            : <Form.Item {...formLayout} label="APP ID"
                                         rules={[{ required: true, message: '请输入APP ID' }]}
                                         name={['miniProgram', 'appid']}>
                              <Input style={{ width: '100%' }} placeholder="请输入APP ID"/>
                            </Form.Item>}
                        </>);
                      }}
                    </Form.Item>
                  </>}
              </>);
            }}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  renderFooter = () => {
    let { confirmLoading } = this.props;
    return ([<Button key="cancel" htmlType="button" onClick={this.onCancel}>取消 </Button>,
      <Button loading={confirmLoading} key="submit" htmlType="button" type="primary"
              onClick={this.onDone}>完成</Button>]);
  };

  onSearchWithUser = (val) => {
    let { $getCompleteUser, detail: { appid } } = this.props;
    $getCompleteUser({ payload: { appid, keyword: val } });
  };

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const {
      detail: { templateId },
      onClose,
      $sendTemplateMessageToUser,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, toUsers, ...values }) => {
        $sendTemplateMessageToUser({
          payload: {
            toUsers: (toUsers || []).map(({ key }) => key),
            templateId: templateId,
            ...values,
          },
          callback: () => {
            message.success('发送成功');
            form.resetFields();
            onClose();
          },
        });
      })
      .catch(err => message.error(UiUtils.getErrorMessage(err)));
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
    id: PropTypes.number.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };
}

export default index;
