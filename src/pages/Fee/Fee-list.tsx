import { useContext, useEffect, useState } from 'react';
import {
    Button,
    Col,
    Row,
    Form,
    Table,
    Modal,
    message,
    Input,
} from 'antd';
import teacherApi from '../../apis/urlApi';
import {
    FeeList,
} from '../../types/response';
import { YearContext } from '../../context/YearProvider/YearProvider';
import Loader from '../../common/Loader';

export default function SchoolYearClass() {
    const [fee, setFee] = useState<FeeList[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { idYear } = useContext(YearContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (idYear === null) return;
            setIsLoading(true);
            try {
                const res = await teacherApi.getFeeList(idYear);
                setFee(res?.data);
            } catch (error) {
                console.error('Failed to fetch fee list:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [idYear]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const formData = await form.validateFields();

            formData['schoolYear'] = idYear;
            const res = await teacherApi.postCreateSchoolYearClass(formData);
            setIsModalOpen(false);
            message.success('Data submitted successfully!');
        } catch (error: any) {
            console.error('Error:', error);
            message.error('Failed to submit data. Please try again later.');
        }
    };

    return (
        <div className="p-4 md:p-6 2xl:p-10">
            <Row className="mb-6">
                <Col>
                    <Button type="default" onClick={showModal}>
                        Thêm
                    </Button>
                </Col>
                <Col>
                    <Modal
                        title="Thêm lớp"
                        visible={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Hủy
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleSubmit}>
                                Gửi
                            </Button>,
                        ]}
                    >
                        <Form
                            form={form}
                            name="addSchoolYearTeacherForm"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                        >
                            <Form.Item
                                label="Tên lớp"
                                name="className"
                                rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Mã lớp"
                                name="classCode"
                                rules={[{ required: true, message: 'Vui lòng nhập mã lớp!' }]}
                            >
                                <Input />
                            </Form.Item>
                            {/* Adjusted labels for the following form items */}
                        </Form>
                    </Modal>
                </Col>
            </Row>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Row justify="space-between" className="mb-6">
                        <Table dataSource={fee} rowKey="id" scroll={{ y: 450 }} className="w-full">
                            <Table.Column title="Tên khoản thu" dataIndex="title" />
                            <Table.Column
                                title="Đơn giá"
                                dataIndex="feePrices"
                                render={(feePrices: { price: number, unit: { name: string } }[]) =>
                                    feePrices.map((price, index) => (
                                        <div key={index}>
                                            {price.price}/{price.unit.name}
                                        </div>
                                    ))
                                }
                            />
                            <Table.Column title="Kỳ thu" dataIndex="termName" />
                            <Table.Column
                                title="Thời điểm thu"
                                dataIndex="paymentTime"
                                render={(paymentTime: { name: string }) => paymentTime.name}
                            />
                        </Table>
                    </Row>
                </div>
            )}
        </div>
    );
}
