import { useState } from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, Table, Checkbox, Row, Col, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const App = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log('Form values:', values);
            setIsModalVisible(false);
        }).catch(errorInfo => {
            console.error('Failed to submit form:', errorInfo);
        });
    };

    const columns = [
        {
            title: 'Nhóm lớp',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Số thu',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Số đã thu',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Số còn phải thu',
            dataIndex: '',
            key: '',
        },
        {
            title: 'Thông báo',
            dataIndex: '',
            key: '',
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={6} className='h-screen border-gray-4 rounded-md bg-gray-3 pt-4'>
                    <div>
                        <h3>Đợt đăng ký</h3>
                        <Select defaultValue="3" style={{ width: '100%', marginBottom: '10px' }}>
                            <Option value="3">Đợt đăng ký tháng 3</Option>
                            <Option value="4">Đợt đăng ký tháng 4</Option>
                        </Select>
                    </div>
                    <div>
                        <h3>Phạm vi <span className='text-meta-7 text-base'>*</span></h3>
                        <Select defaultValue="toanTruong" style={{ width: '100%', marginBottom: '10px' }}>
                            <Option value="toanTruong">Toàn trường</Option>
                            <Option value="lop1">Lớp 1</Option>
                            <Option value="lop2">Lớp 2</Option>
                        </Select>
                    </div>
                    <div>
                        <h3>Khoản thu</h3>
                        <Checkbox>Sửa học đường</Checkbox><br />
                        <Checkbox>Chăm sóc bán trú</Checkbox><br />
                        <Checkbox>Đồng phục mùa đông</Checkbox>
                    </div>
                </Col>
                <Col span={18}>
                    <Row className='mb-4'>
                        <Col span={12} className='pt-'>
                            <p>Khoản đăng ký tháng ...</p>
                        </Col>
                        <Col span={12} className='flex'>
                            <Button className='' type="primary" onClick={showModal} style={{ marginRight: '10px' }}>
                                Lập đợt mới
                            </Button>
                            <Button>
                                Xác nhận
                            </Button>
                        </Col>
                    </Row>
                    <Table columns={columns} pagination={false} bordered />
                </Col>
            </Row>
            <Modal
                title="Lập đợt đăng ký khoản thu"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Lập đợt đăng ký
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        registrationDate: moment(),
                    }}
                >
                    <Form.Item
                        name="registrationDate"
                        label="Hạn đăng ký"
                        rules={[{ required: true, message: 'Vui lòng chọn hạn đăng ký!' }]}
                    >
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item
                        name="releaseName"
                        label="Tên đợt đăng ký"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đợt đăng ký!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="scope"
                        label="Phạm vi"
                        rules={[{ required: true, message: 'Vui lòng chọn phạm vi!' }]}
                    >
                        <Select placeholder="Chọn phạm vi">
                            <Option value="toanTruong">Toàn trường</Option>
                            <Option value="lop1">Lớp 1</Option>
                            <Option value="lop2">Lớp 2</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="fees"
                        label="Danh sách các khoản thu"
                        rules={[{ required: true, message: 'Vui lòng chọn các khoản thu!' }]}
                    >
                        <Table
                            columns={[
                                {
                                    title: '',
                                    dataIndex: 'fee',
                                    key: 'fee',
                                },
                                {
                                    title: 'Nhóm khoản thu',
                                    dataIndex: 'feeGroup',
                                    key: 'feeGroup',
                                },
                                {
                                    title: 'Đơn giá',
                                    dataIndex: 'price',
                                    key: 'price',
                                },
                                {
                                    title: 'Đơn vị',
                                    dataIndex: 'unit',
                                    key: 'unit',
                                },
                            ]}
                            dataSource={[
                                {
                                    key: '1',
                                    fee: <Checkbox>Sửa học đường</Checkbox>,
                                    feeGroup: 'Đường học',
                                    price: '2,954',
                                    unit: 'Ngày',
                                },
                                {
                                    key: '2',
                                    fee: <Checkbox>Chăm sóc bán trú</Checkbox>,
                                    feeGroup: 'Bán trú',
                                    price: '15,000',
                                    unit: 'Ngày',
                                },
                                {
                                    key: '3',
                                    fee: <Checkbox>Đồng phục mùa đông</Checkbox>,
                                    feeGroup: 'Đồng phục',
                                    price: '150,000',
                                    unit: 'Năm',
                                },
                            ]}
                            pagination={false}
                            rowKey="key"
                            bordered
                        />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                </Form>
                <p>Chú ý: Khi lập đợt đăng ký sẽ đồng thời gửi thông báo đến phụ huynh.</p>
            </Modal>
        </div>
    );
};

export default App;
