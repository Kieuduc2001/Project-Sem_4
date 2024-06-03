import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Row, Col, Select } from 'antd';
import './Timetable.css';
import teacherApi from '../../apis/urlApi';
import { Schedule, SchoolYearClassData } from '../../types/response';
import mainAxios from '../../apis/main-axios';
import Loader from '../../common/Loader';
import { YearContext } from '../../context/YearProvider/YearProvider';
import axios from 'axios';

const { Option } = Select;

type Day = 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

const Timetable: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassData[]>([]);
  const { idYear } = useContext(YearContext);
  const [classId, setClassId] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (classId === null) return;
      setIsLoading(true);
      try {
        const res = await mainAxios.get(`/api/v1/schedule/get-schedule-by?classId=${classId}`);
        setSchedule(res?.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 2000) {
          setSchedule([]);
        } else {
          console.error('Failed to fetch school year classes:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchScheduleData();
  }, [classId]);

  useEffect(() => {
    const fetchSchoolYearClassData = async () => {
      if (idYear === null) return;
      setIsLoading(true);
      try {
        const res = await teacherApi.getSchoolYearClass(idYear);
        setSchoolYearClass(res?.data);
      } catch (error) {
        console.error('Failed to fetch school year class data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchoolYearClassData();
  }, [idYear]);

  const transformScheduleData = (schedule: Schedule[], shift: 'morning' | 'afternoon'): any[] => {
    const transformedData: any[] = [];
    const days: Day[] = ['T2', 'T3', 'T4', 'T5', 'T6'];

    const shiftOffset = shift === 'morning' ? 0 : 4;

    for (let i = 1; i <= 4; i++) {
      const row: any = { indexLesson: `<b>Tiết ${i > 4 ? i - 4 : i}</b>` };
      days.forEach(day => {
        const lesson = schedule[i - 1 + shiftOffset]?.[day];
        row[day.toLowerCase()] = lesson ? `<b>${lesson.subjectName}</b><br />(${lesson.teacherName})` : '';
      });
      transformedData.push(row);
    }

    return transformedData;
  };

  const columns = [
    {
      title: 'Lịch',
      dataIndex: 'indexLesson',
      key: 'indexLesson',
      width: 80,
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Thứ 2',
      dataIndex: 't2',
      key: 't2',
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Thứ 3',
      dataIndex: 't3',
      key: 't3',
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Thứ 4',
      dataIndex: 't4',
      key: 't4',
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Thứ 5',
      dataIndex: 't5',
      key: 't5',
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
    {
      title: 'Thứ 6',
      dataIndex: 't6',
      key: 't6',
      align: 'center' as 'center',
      render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />
    },
  ];

  const handleClassChange = (value: number) => {
    setClassId(value);
  };

  const morningData = transformScheduleData(schedule, 'morning');
  const afternoonData = transformScheduleData(schedule, 'afternoon');

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
              <Button className='bg-bodydark2' type="primary">Tạo mới</Button>
              <Button className='ml-5' type="primary">Thông báo</Button>
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
