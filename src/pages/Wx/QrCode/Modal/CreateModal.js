import React, { PureComponent } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import UiUtils from '@/utils/UiUtils';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

let defaultValue = {
  useExpireQrCode: true,
  useSceneId: true,
};

@connect(({ global, wxMpConfig: { all }, dataDict: { allPlatform, allEnabled }, loading, ...rest }) => {
  return {
    allMpConfig: all,
    confirmLoading: loading.effects['wxMpQrcode/insert'],
  };
}, dispatch => ({
  $insertOne: (args = {}) => dispatch({ type: 'wxMpQrcode/insert', ...args }),
  $getAllWithWxMpConfig: (args = {}) => dispatch({ type: 'wxMpConfig/getAll', ...args }),
}))
class CreateModal extends PureComponent {
  createForm = React.createRef();

  componentDidMount() {
    let { $getAllWithWxMpConfig } = this.props;
    $getAllWithWxMpConfig();
  }

  render() {
    const { visible, onClose, allMpConfig, appid } = this.props;
    return (
      <Modal width={640}
             bodyStyle={{ padding: '32px 40px 48px' }}
             title="新增二维码"
             visible={visible}
             onCancel={onClose}
             maskClosable
             footer={this.renderFooter()}>
        <Form ref={this.createForm} initialValues={{ appid: appid, ...defaultValue }}>
          <Form.Item {...formLayout} label="APP ID"
                     rules={[{ required: true, message: '请选择APP ID' }]}
                     name="appid">
            <Select>
              {(allMpConfig || []).map(({ appid, title }, index) =>
                <Select.Option key={index} value={`${appid}`}>{title}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* 二维码类型 */}
          <Form.Item {...formLayout} label="二维码类型"
                     rules={[{ required: true, message: '请选择二维码类型' }]}
                     name="useExpireQrCode">
            <Radio.Group>
              <Radio.Button value={true}>临时</Radio.Button>
              <Radio.Button value={false}>永久</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              let useExpireQrCode = getFieldValue('useExpireQrCode');
              return (<>
                {useExpireQrCode
                  ? <>
                    <Form.Item {...formLayout} label="过期时长(秒)"
                               rules={[{ required: true, message: '请输入过期时长' }]}
                               name="expireSeconds">
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入过期时长"/>
                    </Form.Item>
                  </>
                  : null}
              </>);
            }}
          </Form.Item>
          {/* 场景值 */}
          <Form.Item {...formLayout} label="场景值类型"
                     rules={[{ required: true, message: '请选择场景值类型' }]}
                     name="useSceneId">
            <Radio.Group>
              <Radio.Button value={true}>整型</Radio.Button>
              <Radio.Button value={false}>字符型</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              let useSceneId = getFieldValue('useSceneId');
              return (<>
                {useSceneId
                  ? <>
                    <Form.Item {...formLayout} label="场景值"
                               rules={[{ required: true, message: '请输入场景值' }]}
                               name="sceneId">
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入场景值"/>
                    </Form.Item>
                  </>
                  : <>
                    <Form.Item {...formLayout} label="场景值"
                               rules={[{ required: true, message: '请输入场景值' }]}
                               name="sceneStr">
                      <Input style={{ width: '100%' }} placeholder="请输入场景值"/>
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

  /**
   * 完成
   */
  onDone = (e) => {
    e.preventDefault();
    const {
      onClose,
      $insertOne,
    } = this.props;
    let form = this.createForm.current;
    form.validateFields()
      .then(({ enabled, ...values }) => {
        $insertOne({
          payload: {
            ...values,
          },
          callback: () => {
            message.success('新增成功');
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
    appid: PropTypes.string,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };
}

export default CreateModal;
