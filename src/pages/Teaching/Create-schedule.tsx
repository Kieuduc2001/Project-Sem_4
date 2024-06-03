import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Row, Col, Select, message, Typography } from 'antd';
import './Timetable.css';
import teacherApi from '../../apis/urlApi';
import { SchoolYearClassData, SubjectForSchedule } from '../../types/response'; // Update import
import Loader from '../../common/Loader';
import { YearContext } from '../../context/YearProvider/YearProvider';
import mainAxios from '../../apis/main-axios';

const { Option } = Select;
const { Paragraph } = Typography;

type Day = 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
type Shift = 'morning' | 'afternoon';
type Type = 'subject' | 'teacher';

interface Schedule {
    [key: string]: {
        subject?: string;
        teacher?: string;
    };
}

const Timetable: React.FC = () => {
    const [schedule, setSchedule] = useState<Schedule>({});
    const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassData[]>([]);
    const [subjectTeacher, setSubjectTeacher] = useState<SubjectForSchedule[]>([]);
    const { idYear } = useContext(YearContext);
    const [classId, setClassId] = useState<number | null>(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchoolYearClassData = async () => {
            if (idYear === null) return;
            setIsLoading(true);
            try {
                const res = await teacherApi.getSchoolYearClass(idYear);
                setSchoolYearClass(res?.data);
            } catch (error) {
                console.error('Failed to fetch school year class data:', error);
                message.error('Failed to fetch school year class data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchoolYearClassData();
    }, [idYear]);

    useEffect(() => {
        const fetchSubjectTeacherData = async () => {
            if (classId === null) return;
            setIsLoading(true);
            try {
                const res = await mainAxios.get(`/api/v1/schedule/get-teacher-class-subject?classId=${classId}`);
                setSubjectTeacher(res?.data || []);
            } catch (error) {
                console.error('Failed to fetch subject data:', error);
                message.error('Failed to fetch subject data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjectTeacherData();
    }, [classId]);

    const handleClassChange = (value: number) => {
        setClassId(value);
    };

    const handleSelectChange = (
        value: string,
        day: Day,
        lesson: number,
        shift: Shift,
        type: Type
    ) => {
        const shiftOffset = shift === 'morning' ? 0 : 4;
        const key = `${day}-${lesson + shiftOffset}`;
        setSchedule(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [type]: value,
            },
        }));
    };

    const renderSelect = (day: Day, lesson: number, shift: Shift, type: Type) => {
        const shiftOffset = shift === 'morning' ? 0 : 4;
        const key = `${day}-${lesson + shiftOffset}`;
        let options: { id: number; name: string }[] = [];

        if (type === 'subject') {
            options = subjectTeacher.map((subject) => ({
                id: subject.subject.id,
                name: subject.subject.name,
            }));
        }

        if (type === 'subject') {
            return (
                <Select
                    style={{ width: 120 }}
                    value={schedule[key]?.[type]}
                    onChange={(value) => handleSelectChange(value, day, lesson, shift, type)}
                >
                    {options.map((option) => (
                        <Option key={option.id} value={option.name}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            );
        } else if (type === 'teacher') {
            const selectedSubjectName = schedule[key]?.subject;
            const selectedSubject = subjectTeacher.find(subject => subject.subject.name === selectedSubjectName);

            return (
                <Paragraph>
                    {selectedSubject ? selectedSubject.teacher.name : ''}
                </Paragraph>
            );
        }

        return null; // Fallback return for unexpected cases
    };

    const transformScheduleData = (shift: Shift): any[] => {
        const transformedData: any[] = [];
        const days: Day[] = ['T2', 'T3', 'T4', 'T5', 'T6'];

        for (let i = 1; i <= 4; i++) {
            const rowSubject: any = { indexLesson: `<b>Tiết ${i}</b> - Môn học` };
            const rowTeacher: any = { indexLesson: `Giáo viên` };
            days.forEach(day => {
                rowSubject[day.toLowerCase()] = renderSelect(day, i, shift, 'subject');
                rowTeacher[day.toLowerCase()] = renderSelect(day, i, shift, 'teacher');
            });
            transformedData.push(rowSubject, rowTeacher);
        }

        return transformedData;
    };

    const columns = [
        {
            title: 'Thứ/Tiết',
            dataIndex: 'indexLesson',
            key: 'indexLesson',
            width: 100,
            align: 'center' as 'center',
            render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
        },
        {
            title: 'Thứ 2',
            dataIndex: 't2',
            key: 't2',
            align: 'center' as 'center',
        },
        {
            title: 'Thứ 3',
            dataIndex: 't3',
            key: 't3',
            align: 'center' as 'center',
        },
        {
            title: 'Thứ 4',
            dataIndex: 't4',
            key: 't4',
            align: 'center' as 'center',
        },
        {
            title: 'Thứ 5',
            dataIndex: 't5',
            key: 't5',
            align: 'center' as 'center',
        },
        {
            title: 'Thứ 6',
            dataIndex: 't6',
            key: 't6',
            align: 'center' as 'center',
        },
    ];

    const morningData = transformScheduleData('morning');
    const afternoonData = transformScheduleData('afternoon');

    return (
        <div className="timetable-container">
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Row justify="space-between" align="middle" className="timetable-selectors" gutter={[16, 16]}>
                        <Col>
                            <Select defaultValue={classId} style={{ width: 150 }} onChange={handleClassChange}>
                                {schoolYearClass.map((classData) => (
                                    <Option key={classData.id} value={classData.id}>
                                        {classData.className}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Button type="primary">Export</Button>
                        </Col>
                    </Row>

                    <h2 className='mb-3 text-lg'>Buổi sáng</h2>
                    <Table
                        columns={columns}
                        dataSource={morningData}
                        pagination={false}
                        bordered
                        rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    />

                    <h2 className='mb-3 mt-3 text-lg'>Buổi chiều</h2>
                    <Table
                        columns={columns}
                        dataSource={afternoonData}
                        pagination={false}
                        bordered
                        rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    />
                </div>
            )}
        </div>
    );
};

export default Timetable;
