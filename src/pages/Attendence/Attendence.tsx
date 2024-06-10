import { useContext, useEffect, useState } from 'react';
import { DatePicker, Select, Space, Table, Button, Checkbox, Form, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import dayjs from 'dayjs';
import mainAxios from '../../apis/main-axios';
import Loader from '../../common/Loader';
import {
  DataTypeAttendence,
  SchoolYearClassData,
  Student,
} from '../../types/response';
import { YearContext } from '../../context/YearProvider/YearProvider';
import teacherApi from '../../apis/urlApi';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

type TableRowSelection<T> = TableProps<T>['rowSelection'];

const Attendences = () => {
  const [student, setStudent] = useState<Student[]>([]);
  const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassData[]>([]);
  const { idYear } = useContext(YearContext);
  const [classId, setClassId] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [attendence, setAttendence] = useState('attendance-by-day');
  const [form] = Form.useForm();
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchStudents = async () => {
      if (classId === null) return;
      setIsLoading(true);
      try {
        const res = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
        setStudent(res?.data);

        const initialStatus = res?.data.reduce((acc: any, student: any) => {
          acc[student.id] = 'CO_MAT';
          return acc;
        }, {});
        setAttendanceStatus(initialStatus);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
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

  const handleChange = (value: number) => {
    setClassId(value);
  };

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCheckboxChange = (id: number, type: string) => {
    setAttendanceStatus(prevState => {
      const newStatus = { ...prevState };

      if (type === 'CO_MAT') {
        newStatus[id] = prevState[id] === 'CO_MAT' ? '' : 'CO_MAT';
      } else {
        newStatus[id] = prevState[id] === 'NGHI_HOC' ? '' : 'NGHI_HOC';
      }

      return newStatus;
    });
  };

  const columnsAttendenceByDay: TableColumnsType<DataTypeAttendence> = [
    {
      title: 'Stt',
      dataIndex: 'Stt',
      key: 'Stt',
      width: '5%',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'Ho_Ten',
      key: 'Ho_Ten',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'Ngay_sinh',
      key: 'Ngay_sinh',
      width: '14%',
      align: 'center',
    },
    {
      title: 'Có mặt',
      dataIndex: 'Co_Mat',
      width: '10%',
      key: 'Co_Mat',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={attendanceStatus[record.key] === 'CO_MAT'}
          onChange={() => handleCheckboxChange(record.key, 'CO_MAT')}
        />
      ),
    },
    {
      title: 'Nghỉ học',
      dataIndex: 'Nghi_hoc',
      width: '10%',
      key: 'Nghi_hoc',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={attendanceStatus[record.key] === 'NGHI_HOC'}
          onChange={() => handleCheckboxChange(record.key, 'NGHI_HOC')}
        />
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Ghi_Chu',
      width: '20%',
      key: 'Ghi_Chu',
      align: 'center',
      render: (_, record) => (
        <Form.Item name={['note', record.key]} key={record.key}>
          <TextArea autoSize />
        </Form.Item>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Trang_Thai',
      width: '14%',
      key: 'Trang_Thai',
      align: 'center',
      render: () => 'chưa thông báo',
    },
  ];

  const dataAttendenceByDay = student.map((data, index) => ({
    key: data.id,
    Stt: index + 1,
    Ho_Ten: `${data.students.lastName} ${data.students.firstName}`,
    Ngay_sinh: formatDate(data.students.birthday.substring(0, 10)),
    Co_Mat: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'CO_MAT'}
        onChange={() => handleCheckboxChange(data.id, 'CO_MAT')}
      />
    ),
    Nghi_hoc: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'NGHI_HOC'}
        onChange={() => handleCheckboxChange(data.id, 'NGHI_HOC')}
      />
    ),
    Ghi_Chu: (
      <Form.Item name={['note', data.id]} key={data.id}>
        <TextArea autoSize />
      </Form.Item>
    ),
    Trang_Thai: 0 ? 'Đã thông báo' : 'chưa thông báo',
  }));

  const columnsAttendenceByMonth: TableColumnsType<DataTypeAttendence> = [
    {
      title: 'Stt',
      dataIndex: 'Stt',
      key: 'Stt',
      width: '5%',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'Ho_Ten',
      key: 'Ho_Ten',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'Ngay_sinh',
      key: 'Ngay_sinh',
      width: '14%',
      align: 'center',
    },
    {
      title: 'Số Lượt Muộn',
      dataIndex: 'So_Luot_Muon',
      key: 'So_Luot_Muon',
      width: '14%',
      align: 'center',
    },
    {
      title: 'Tổng Ngày Nghỉ',
      dataIndex: 'Tong_Ngay_nghi',
      width: '10%',
      key: 'Tong_Ngay_nghi',
      align: 'center',
    },
    {
      title: 'Nghỉ Có Phép',
      dataIndex: 'Nghi_Co_Phep',
      width: '10%',
      key: 'Nghi_Co_Phep',
      align: 'center',
    },
    {
      title: 'Nghỉ không phép',
      dataIndex: 'Nghi_Khong_Phep',
      width: '10%',
      key: 'Nghi_Khong_Phep',
      align: 'center',
    },
  ];

  const dataAttendenceByMonth = student.map((data) => ({
    key: data.id,
    Ho_Ten: `${data.students.lastName} ${data.students.firstName}`,
    Ngay_sinh: formatDate(data.students.birthday.substring(0, 10)),
    Stt: data.id,
    So_Luot_Muon: 0,
    Tong_Ngay_nghi: 0,
    Nghi_Co_Phep: 0,
    Nghi_Khong_Phep: 0,
  }));

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
console.log(Form.useForm());
      const payload = {
        dayOff:1,
        classId: classId,
        listStudent: Object.keys(attendanceStatus).map(studentId => ({
          studentYearInfoId: parseInt(studentId),
          status: attendanceStatus[studentId],
          note: values.note[studentId] || '', // Giả sử note là một object có key là studentId
        })),
      };
console.log(payload)
    } catch (errorInfo) {
      console.error('Failed to submit form:', errorInfo);
      message.error('Failed to submit attendance data');
    }
  };

  return (
    <div className="attendances">
      <div className="attendanceItem">
        <div
          className={`attendance ${attendence === 'attendance-by-day' ? 'actives' : ''}`}
          onClick={() => setAttendence('attendance-by-day')}
        >
          Điểm danh theo ngày
        </div>
        <div
          className={`attendance ${attendence === 'attendance-by-month' ? 'actives' : ''}`}
          onClick={() => setAttendence('attendance-by-month')}
        >
          Điểm danh theo tháng
        </div>
      </div>
      <Form form={form}>
        <div className={`${attendence !== 'attendance-by-day' ? 'hiddens' : 'attendance-by-day'}`}>
          <div style={{ display: 'flex', padding: '16px' }}>
            <Form.Item className="classId" style={{ marginRight: '14px' }}>
              <Select defaultValue={classId} style={{ width: 150 }} onChange={handleChange}>
                {schoolYearClass.map((classData) => (
                  <Option key={classData.id} value={classData.id}>
                    {classData.className}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className="dayOff" name="dayOff"> {/* Thêm name cho Form.Item */}
              <DatePicker
                disabledDate={(date) => date.isBefore(dayjs())}
                className="h-10"
              />
            </Form.Item>

            <div className="mx-4 border border-solid border-green-500 w-36 flex items-center justify-center rounded-md h-10">
              Tất cả: {student.length}
            </div>
            <div className="border border-solid border-gray-300 w-40 flex justify-center items-center rounded-md h-10">
              Có mặt: 38
            </div>
            <div className="mx-4 border border-solid border-gray-300 w-45 rounded-md flex items-center justify-center h-10">
              Có phép: 0
            </div>
            <div className="border border-solid border-gray-300 w-52 rounded-md flex justify-center items-center h-10">
              Không phép: 0
            </div>
            <div style={{ width: '560px' }}>
              <Button type="primary" style={{ float: 'right', background: '#349634' }}>
                Sửa Đổi
              </Button>
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="list-student">
              <Table
                columns={columnsAttendenceByDay}
                dataSource={dataAttendenceByDay}
                pagination={false}
                bordered
              />
            </div>
          )}
          <div className="submit">
            <Button type="primary" className="btn-submit" onClick={handleSubmit}>
              Lưu Lại
            </Button>
          </div>
        </div>
      </Form>
      <div className={`${attendence !== 'attendance-by-month' ? 'hiddens' : 'attendance-by-month'}`}>
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select defaultValue={classId} style={{ width: 150 }} onChange={handleChange}>
              {schoolYearClass.map((classData) => (
                <Option key={classData.id} value={classData.id}>
                  {classData.className}
                </Option>
              ))}
            </Select>
          </div>
          <Space direction="vertical">
            <DatePicker disabledDate={(date) => date.isBefore(dayjs())} />
          </Space>
        </div>
        <div className="list-student">
          <Table
            columns={columnsAttendenceByMonth}
            dataSource={dataAttendenceByMonth}
            pagination={false}
            bordered
            scroll={{ y: 385 }}
          />
        </div>
        <div className="submit">
          <Button type="primary" className="btn-submit" onClick={handleSubmit}>
            Lưu Lại
          </Button>
        </div>
        <div className="submit">
          <Button type="primary" className="btn-submit">
            Sửa Đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Attendences;
