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
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchStudents = async () => {
      if (classId === null) return;
      setIsLoading(true);
      try {
        const res = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
        setStudent(res?.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [classId]);

  const handleChange = (value: number) => {
    setClassId(value);
  };

  const rowSelection = {
    onSelect: (record: DataTypeAttendence, selected: boolean, selectedRows: DataTypeAttendence[]) => { },
    onSelectAll: (selected: boolean, selectedRows: DataTypeAttendence[], changeRows: DataTypeAttendence[]) => { },
  };

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCheckboxChange = (id: number, type: string) => {
    setAttendanceStatus(prevState => ({
      ...prevState,
      [id]: type
    }));
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
    },
    {
      title: 'Nghỉ học',
      dataIndex: 'Nghi_hoc',
      width: '10%',
      key: 'Nghi_hoc',
      align: 'center',
    },
    {
      title: 'ghi chú',
      dataIndex: 'Ghi_Chu',
      width: '20%',
      key: 'Ghi_Chu',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Trang_Thai',
      width: '14%',
      key: 'Trang_Thai',
      align: 'center',
    },
  ];

  const dataAttendenceByDay = student.map((data, index) => ({
    key: data.id,
    Stt: index + 1,
    Ho_Ten: data.students.lastName + ' ' + data.students.firstName, // Assuming s contains the name of the student
    Ngay_sinh: formatDate(data.students.birthday.substring(0, 10)),
    Co_Mat: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'Co_Mat'}
        onChange={() => handleCheckboxChange(data.id, 'Co_Mat')}
      />
    ),
    Nghi_hoc: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'Nghi_Co_Phep'}
        onChange={() => handleCheckboxChange(data.id, 'Nghi_Co_Phep')}
      />
    ),
    Ghi_Chu: <Form.Item name={['note', data.id]} key={data.id}>
      <TextArea autoSize />
    </Form.Item>,
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
    Ho_Ten: data.students.lastName + data.students.firstName, // Assuming `s` contains the name of the student
    Ngay_sinh: data.students.birthday.substring(0, 10),
    Stt: data.id,
    So_Luot_Muon: 10,
    Tong_Ngay_nghi: 10,
    Nghi_Co_Phep: 5,
    Nghi_Khong_Phep: 5,
  }));

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

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      const { note } = values;
      const updatedValues = {
        ...values,
        attendanceStatus
      };

      for (const studentId in updatedValues.attendanceStatus) {
        const status = updatedValues.attendanceStatus[studentId] === 'Co_Mat';
        const studentNote = note ? note[studentId] : '';
        await teacherApi.postAtendence(Number(studentId), status, studentNote)
          ;
      }
      message.success('Attendance data submitted successfully!');
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
      <Form
        form={form}>
        <div className={`${attendence !== 'attendance-by-day' ? 'hiddens' : 'attendance-by-day'}`}>
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
              <DatePicker
                disabledDate={(date) => date.isBefore(dayjs())}
                className="h-10"
              />
            </Space>
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
                Thông báo cho PH
              </Button>
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="list-student">
              <Table
                rowSelection={{ ...rowSelection }}
                columns={columnsAttendenceByDay}
                dataSource={dataAttendenceByDay}
                pagination={false}
                bordered
                scroll={{ y: 385 }}
              />
            </div>
          )}
          <div className="submit">
            <Button type="primary" className="btn-submit">
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
          <Button type="primary" className="btn-submit">
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
