import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';

interface ModalDialogProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Operation completed successfully!');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Operation failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quick Settings"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="quick-settings-modal"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        
        <Form.Item
          name="value"
          label="Value"
          rules={[{ required: true, message: 'Please enter a value' }]}
        >
          <Input placeholder="Enter value" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};