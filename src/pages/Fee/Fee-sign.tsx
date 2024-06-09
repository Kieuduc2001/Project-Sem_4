import { useContext, useEffect, useState } from 'react';
import {
    Button,
    Form,
    Table,
    Modal,
    Input,
    Layout,
    Menu,
    Select,
    DatePicker
} from 'antd';
import Loader from '../../common/Loader';
import { FeeList, FeePeriodResponse, GradeData, SchoolYearClassData } from 'types/response';
import teacherApi from '../../apis/urlApi';
import { YearContext } from '../../context/YearProvider/YearProvider';
import axios from 'axios';

const { Sider, Content } = Layout;
const { Option } = Select;

export default function FeeCollection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { idYear } = useContext(YearContext);
    const [feePeriod, setFeePeriod] = useState<FeePeriodResponse[]>([]);
    const [fee, setFee] = useState<FeeList[]>([]);
    const [scope, setScope] = useState<any>();
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [classes, setClasses] = useState<SchoolYearClassData[]>([]);
    const [selectedScopeId, setSelectedScopeId] = useState<number | undefined>();
    const [selectedFeePeriod, setSelectedFeePeriod] = useState<FeePeriodResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (idYear === null) return;
            setIsLoading(true);
            try {
                const res = await teacherApi.getFeePeriod(idYear);
                setFeePeriod(res.data || []);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setFeePeriod([]);
                } else if (error instanceof Error) {
                    console.error('Failed to fetch fee period:', error.message);
                } else {
                    console.error('An unknown error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [idYear]);

    useEffect(() => {
        const fetchFee = async () => {
            if (idYear === null) return;
            setIsLoading(true);
            try {
                const res = await teacherApi.getFeeList(idYear);
                setFee(res?.data || []);
            } catch (error) {
                console.error('Failed to fetch fee list:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFee();
    }, [idYear]);

    useEffect(() => {
        fetchScope();
    }, []);

    const fetchScope = async () => {
        try {
            setIsLoading(true);
            const res = await teacherApi.getScope();
            setScope(res?.data?.scopeList);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching scope:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                setIsLoading(true);
                const res1 = await teacherApi.getGrades();
                setGrades(res1.data.body);
            } catch (error) {
                console.error('Error fetching grades:', error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchGrades();
    }, []);

    useEffect(() => {
        const fetchClass = async () => {
            if (idYear === null) return;
            setIsLoading(true);
            try {
                const res2 = await teacherApi.getSchoolYearClass(idYear);
                setClasses(res2?.data || []);
            } catch (error) {
                console.error('Failed to fetch classes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClass();
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

            if (idYear === null) {
                console.error('schoolYearId is null');
                return;
            }

            const postData = {
                title: formData.title,
                content: formData.content,
                schoolYearId: idYear, // Ensure idYear is not null
                endDate: formData.endDate.format('YYYY-MM-DD'), // Convert endDate to string format if needed
                feePeriodScope: {
                    objectIdList: formData.objectIdList || [],
                    scopeId: formData.scopeId || 0,
                },
                schoolYearFeePeriodCreateList: fee.map(item => ({
                    amount: Number(formData[`amount_${item.id}`]), // Convert to number if needed
                    schoolYearFeeId: item.id,
                })),
            };

            console.log('Post data:', postData);
            await teacherApi.postFeePeriod(postData);
            setIsModalOpen(false);

            // Refresh data after submission
            const res = await teacherApi.getFeePeriod(idYear);
            setFeePeriod(res.data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleScopeChange = (value: number) => {
        setSelectedScopeId(value);
    };

    const getNhomOptions = () => {
        if (selectedScopeId === 2) {
            return (
                <Select mode="multiple">
                    {classes.map((classItem) => (
                        <Select.Option key={classItem.id} value={classItem.id}>
                            {classItem.className}
                        </Select.Option>
                    ))}
                </Select>
            );
        } else if (selectedScopeId === 3) {
            return (
                <Select mode="multiple">
                    {grades.map((gradeItem) => (
                        <Select.Option key={gradeItem.id} value={gradeItem.id}>
                            {gradeItem.name}
                        </Select.Option>
                    ))}
                </Select>
            );
        } else {
            return <Select mode="multiple"></Select>; // Default or initial state
        }
    };

    const handleMenuClick = (feePeriodId: number) => {
        const selectedPeriod = feePeriod.find(period => period.id === feePeriodId);
        setSelectedFeePeriod(selectedPeriod || null);
    };

    const columns = [
        {
            title: "Nhóm lớp",
            dataIndex: 'feePeriodScopes',
            key: 'feePeriodScopes',
            render: (feePeriodScopes: any[]) => {
                // Mapping logic to retrieve class names, grade names, or "Toàn trường" based on scopeId and objectId
                const classGroup = feePeriodScopes
                    ?.map((item) => {
                        if (item.scopeId === 1) {
                            return "Toàn trường";
                        } else if (item.scopeId === 2) {
                            const classItem = classes.find(cls => cls.id === item.objectId);
                            return classItem ? classItem.className : null;
                        } else if (item.scopeId === 3) {
                            const gradeItem = grades.find(grd => grd.id === item.objectId);
                            return gradeItem ? gradeItem.name : null;
                        }
                        return null;
                    })
                    .filter(name => name !== null)
                    .join(', ');

                // Return "Toàn trường" if nothing found for scopeId = 1, otherwise return the joined class group or '-'
                return classGroup || '-';
            },
        },

        {
            title: 'Số thu',
            dataIndex: 'feePeriodScopes',
            key: 'feePeriodScopes',
            render: (feePeriodScopes: any[]) => {
                let totalAmount = 0;
                feePeriodScopes.forEach((item) => {
                    const feeItem = fee.find(feeItem => feeItem.id === item.objectId);
                    if (feeItem) {
                        const amount = item.amount || 1; // Default to 1 if amount is undefined or null
                        totalAmount += feeItem.feePrices.reduce((acc, curr) => acc + (curr.price * amount), 0);
                    }
                });
                return totalAmount;
            },
        },
        {
            title: 'Số đã thu',
            dataIndex: 'amountPaid',
            key: 'amountPaid',
        },
        {
            title: 'Số còn phải thu',
            dataIndex: 'amountDue',
            key: 'amountDue',
        },
        {
            title: 'Thông báo',
            dataIndex: 'notification',
            key: 'notification',
        },
    ];

    return (
        <Layout className="h-screen">
            <Sider width={200} className="site-layout-background">
                <div className="min-h-20 bg-white flex items-center justify-center flex-col">
                    <Button type="default" onClick={showModal} className="w-40">
                        Lập đợt thu
                    </Button>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick={({ key }) => handleMenuClick(Number(key))}
                >
                    {feePeriod.map((period) => (
                        <Menu.Item key={period.id}>{period.title}</Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    className="site-layout-background p-4 md:p-6 2xl:p-10"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Modal
                        title="Lập đợt thu"
                        visible={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Hủy
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleSubmit}>
                                Đồng ý
                            </Button>,
                        ]}
                    >
                        <Form
                            form={form}
                            name="addFeeForm"
                            labelCol={{ flex: '110px' }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{ flex: 1 }}
                            colon={false}
                        >
                            <Form.Item
                                label="Tên đợt thu"
                                name="title"
                                rules={[{ required: true, message: 'Please input the title!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Ngày kết thúc"
                                name="endDate"
                                rules={[{ required: true, message: 'Please select the end date!' }]}
                            >
                                <DatePicker className='w-full' />
                            </Form.Item>
                            <Form.Item
                                label="Phạm vi"
                                name="scopeId"
                                rules={[{ required: true, message: 'Please select the scope!' }]}
                            >
                                <Select onChange={(value) => handleScopeChange(value)}>
                                    {scope?.map((item: any) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Nhóm"
                                name="objectIdList"
                            >
                                {getNhomOptions()}
                            </Form.Item>

                            <Form.Item
                                label="Nội dung"
                                name="content"
                            >
                                <Input />
                            </Form.Item>
                            <Table
                                dataSource={fee}
                                pagination={false}
                                scroll={{ y: 240 }}
                                className='mb-4'
                                rowSelection={{ type: 'checkbox' }}
                                rowKey="id"
                            >
                                <Table.Column title="Khoản thu" dataIndex="title" />
                                <Table.Column
                                    title="Số lượng"
                                    dataIndex="amount"
                                    render={(text, record: FeeList) => (
                                        <Form.Item
                                            name={`amount_${record.id}`}
                                            rules={[{ required: true, message: 'Please input the amount!' }]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                    )}
                                />
                                <Table.Column
                                    title="Đơn vị"
                                    dataIndex="feePrices"
                                    render={(feePrices) => feePrices[0]?.unit?.name || ''}
                                />
                            </Table>
                        </Form>
                    </Modal>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table
                            dataSource={selectedFeePeriod ? [selectedFeePeriod] : []}
                            columns={columns}
                            rowKey="id"
                        />
                    )}
                </Content>
            </Layout>
        </Layout>
    );
}
