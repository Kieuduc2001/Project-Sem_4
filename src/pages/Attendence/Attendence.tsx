import { useContext, useEffect, useState } from 'react';
import { DatePicker, Select, Space, Table, Button, Checkbox, Form, message, Steps } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import mainAxios from '../../apis/main-axios';
import Loader from '../../common/Loader';
import {
  AttendenceData,
<<<<<<< HEAD
=======
  DataTypeAttendence,
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
  SchoolYearClassData,
  Student,
} from '../../types/response';
import { YearContext } from '../../context/YearProvider/YearProvider';
import teacherApi from '../../apis/urlApi';
import TextArea from 'antd/es/input/TextArea';
<<<<<<< HEAD
import { AttendanceRequestDto, StudentRequestDto } from 'types/request';
import axios from 'axios';
import { PlusCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
=======
import { data } from 'jquery';
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a

const { Step } = Steps;
const { Option } = Select;
const Attendences = () => {
  const [student, setStudent] = useState<Student[]>([]);
  const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassData[]>([]);
  const { idYear } = useContext(YearContext);
<<<<<<< HEAD
  const [classId, setClassId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendenceClass, setAttendenceClass] = useState('attendance-by-day');
  const [form] = Form.useForm();
  const [dayOff, setDayOff] = useState(dayjs());
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    fetchStudents(true);
  }, [classId]);
=======
  const [classId, setClassId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [attendenceClass, setAttendenceClass] = useState('attendance-by-day');
  const [form] = Form.useForm();
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: string }>({});
  const [attendanceData, setAttendenceData] = useState<AttendenceData[]>([])
  const [dayOff, setDayOff] = useState(dayjs());
  useEffect(() => {
    fetchStudents();
    getAttendence();
  }, [classId]);
  const fetchStudents = async () => {
    if (classId === null) return;
    setIsLoading(true);
    try {
      const res = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
      setStudent(res?.data);
      // const initialStatus = res?.data.reduce((acc: any, student: any) => {
      //   if(attendanceData){
      //     attendanceData.map((data)=>{
      //       return acc[data.studentInfo.studentYearInfoId] = data.attendanceStatus
      //     })
      //   }else{
      //     acc[student.id] = "CO_MAT";
      //     return acc;
      //   }
        
        
      // }, {});
      // setAttendanceStatus(initialStatus);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };
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
  const getAttendence = async () => {

    const res = await teacherApi.getAttendence(classId,form.getFieldValue("dayOff")??dayOff);
    console.log(res);

    setAttendenceData(res.data);
  }

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
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a

  useEffect(() => {
    fetchSchoolYearClassData();
  }, [idYear])

  useEffect(() => {
    if (schoolYearClass.length > 0) {
      setClassId(schoolYearClass[0].id);
    }
    else {
      setClassId(null);
    }
  }, [schoolYearClass]);

  useEffect(() => {
    fetchStudents(false);
  }, [dayOff]);

  const fetchStudents = async (getStudents: boolean = false): Promise<void> => {
    form.resetFields(["attendanceStatus", "note"]);
    try {
      if (schoolYearClass !== null && classId !== null) {
        if (getStudents) {
          const studentRes = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
          if (studentRes.status === 200) {
            const attendanceRes = await teacherApi.getAttendence(classId, dayOff.format("MM/DD/YYYY"));
            if (attendanceRes.status === 200) {
              const studentData = studentRes.data;
              const attendanceData = attendanceRes.data;
              setStudent(studentData.map((sd: Student) => {
                const std: Student = sd;
                const att = attendanceData.find((att: AttendenceData) => att.studentInfo.studentYearInfoId === sd.id);
                if (att) {
                  const attData: AttendenceData = {
                    attendanceStatus: att?.attendanceStatus,
                    id: att?.id,
                    note: att?.note,
                    studentInfo: att?.studentInfo,
                    createdAt: att?.createdAt
                  };
                  std.students.attendenceData = attData;
                } else {
                  std.students.attendenceData = undefined;
                }
                return std;
              }));
            }
            setCurrentStep(2)
          }
        }
      }
    }
    catch (error) {
      setStudent([])
    }
  };

  const fetchSchoolYearClassData = async () => {
    if (idYear === null) return;
    try {
      const res = await teacherApi.getSchoolYearClass(idYear);
      setSchoolYearClass(res?.data);
      if (res.status === 200) {
        setCurrentStep(1)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setSchoolYearClass([]);
        setStudent([]);
        setCurrentStep(0)
      } else if (error instanceof Error) {
        console.error('Failed to fetch school year classes:', error.message);
      } else {
        console.error('An unknown error occurred.');
      }
    }
    finally {
      setIsLoading(false);
    }
  };


  const handleChange = (value: number) => {
    setClassId(value);
  };
<<<<<<<<< Temporary merge branch 1

=========
  const handleChangeDay = (value:any) => {
    if (value) {
      form.setFieldValue("dayOff", value);
      setDayOff(value);
      getAttendence();
    }
  }
>>>>>>>>> Temporary merge branch 2
  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

<<<<<<< HEAD
  const handleCheckboxChange = (studentId: number, status: string) => {
    setStudent(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          if (status === "CO_MAT")
            return {
              ...student,
              students: {
                ...student.students,
                attendenceData: {
                  ...student.students.attendenceData,
                  attendanceStatus: "CO_MAT"
                }
              }
            };
          else if (status === "NGHI_KHONG_PHEP")
            return {
              ...student,
              students: {
                ...student.students,
                attendenceData: {
                  ...student.students.attendenceData,
                  attendanceStatus: "NGHI_KHONG_PHEP"
                }
              }
            };
          else (status === "NGHI_CO_PHEP")
          return {
            ...student,
            students: {
              ...student.students,
              attendenceData: {
                ...student.students.attendenceData,
                attendanceStatus: "NGHI_CO_PHEP"
              }
            }
          };
        }
        return student;
      }) as Student[]
    );
=======
  const handleCheckboxChange = (id: number, type: string) => {
    setAttendanceStatus(prevState => {
      const newStatus = { ...prevState };

      if (type === 'CO_MAT') {
        newStatus[id] = prevState[id] === 'CO_MAT' ? '' : 'CO_MAT';
      } else if (type === 'NGHI_CO_PHEP') {
        newStatus[id] = prevState[id] === 'NGHI_CO_PHEP' ? '' : 'NGHI_CO_PHEP';

      }
      else {
        newStatus[id] = prevState[id] === 'NGHI_KHONG_PHEP' ? '' : 'NGHI_KHONG_PHEP';
      }

      return newStatus;
    });
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
  };



  const columnsAttendenceByDay: TableColumnsType<Student> = [
    {
      title: 'Stt',
      dataIndex: 'Stt',
      key: 'Stt',
      width: '5%',
      align: 'center',
      render: (_, __, index) => (<>{index + 1}</>),
    },
    {
      title: 'Họ tên',
      dataIndex: 'students',
      key: 'Ho_Ten',
      width: '25%',
      align: 'center',
      render: (item) => (
        <>{item.firstName} {item.lastName}</>
      )
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'students',
      key: 'Ngay_sinh',
      width: '14%',
      align: 'center',
      render: (item) => (
        <>{formatDate(item.birthday)}</>
      )
    }
    , {
      title: 'Có mặt',
      dataIndex: 'students',
      width: '10%',
      key: 'Co_Mat',
      align: 'center',
      render: (_, record) => (
        <Checkbox
<<<<<<< HEAD
          checked={dayjs(dayOff).isSame(dayjs(), 'day') && !record.students.attendenceData ? true : record.students.attendenceData?.attendanceStatus === "CO_MAT"}
          onChange={() => handleCheckboxChange(record.id, 'CO_MAT')}
=======
          checked={attendanceStatus[record.key] === 'CO_MAT'}
          onChange={() => handleCheckboxChange(record.key, 'CO_MAT')}
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
        />
      ),
    },
    {
      title: 'Nghỉ có phép',
<<<<<<< HEAD
      dataIndex: 'students',
=======
      dataIndex: 'Nghi_Co_Phep',
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
      width: '10%',
      key: 'Nghi_Co_Phep',
      align: 'center',
      render: (_, record) => (
        <Checkbox
<<<<<<<<< Temporary merge branch 1
          checked={attendanceStatus[record.key] === 'NGHI_HOC'}
          onChange={() => handleCheckboxChange(record.key, 'NGHI_HOC')}
=========
          checked={attendanceStatus[record.key] === 'NGHI_CO_PHEP'}
          onChange={() => handleCheckboxChange(record.key, 'NGHI_CO_PHEP')}
>>>>>>>>> Temporary merge branch 2
        />
      ),
    },
    {
      title: 'Nghỉ không phép',
      dataIndex: 'Nghi_Khong_Phep',
      width: '10%',
      key: 'Nghi_Khong_Phep',
      align: 'center',
      render: (_, record) => (
        <Checkbox
<<<<<<< HEAD
          checked={record.students.attendenceData?.attendanceStatus === "NGHI_KHONG_PHEP"}
          onChange={() => handleCheckboxChange(record.id, 'NGHI_KHONG_PHEP')}
=======
          checked={attendanceStatus[record.key] === 'NGHI_KHONG_PHEP'}
          onChange={() => handleCheckboxChange(record.key, 'NGHI_KHONG_PHEP')}
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
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
<<<<<<< HEAD
        <Form.Item name={['note', record.id]} key={record.id}>
          <TextArea defaultValue={record.students.attendenceData ? record.students.attendenceData.note : ""} autoSize />
=======
        <Form.Item name={['note', record.key]} key={record.key}>
          <TextArea autoSize />
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
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

<<<<<<< HEAD
  const columnsAttendenceByMonth: TableColumnsType<Student> = [
=======
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
    Nghi_Co_Phep: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'NGHI_CO_PHEP'}
        onChange={() => handleCheckboxChange(data.id, 'NGHI_CO_PHEP')}
      />
    ),
    Nghi_Khong_Phep: (
      <Checkbox
        checked={attendanceStatus[data.id] === 'NGHI_KHONG_PHEP'}
        onChange={() => handleCheckboxChange(data.id, 'NGHI_KHONG_PHEP')}
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
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
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
      dataIndex: 'students',
      key: 'Ho_Ten',
      width: '25%',
      align: 'center',
      render: (item) => (
        <>{item.firstName} {item.lastName}</>
      )
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'students',
      key: 'Ngay_sinh',
      width: '14%',
      align: 'center',
      render: (item) => (
        <>{formatDate(item.birthday)}</>
      )
    }
    , 
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
<<<<<<<<< Temporary merge branch 1

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
=========

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
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
<<<<<<< HEAD
      const students: StudentRequestDto[] = student.map((student, index: number) => {
        const attendanceStatus = student.students.attendenceData?.attendanceStatus || 'CO_MAT';
        const studentReq: StudentRequestDto = {
          studentYearInfoId: student.id,
          status: attendanceStatus,
          note: values.note[index]!
        };
        return studentReq;
      });

      const attendanceRequest: AttendanceRequestDto = {
        dayOff: values.dayOff,
        listStudent: students,
        classId: classId!
      }
      const res = await teacherApi.postAtendence(attendanceRequest);
      console.log(res);
      await fetchStudents();
=======
      values["classId"] = classId,
        values["listStudent"] = Object.keys(attendanceStatus).map(studentId => ({
          studentYearInfoId: parseInt(studentId),
          status: attendanceStatus[studentId],
          note: values.note[studentId] || '', // Giả sử note là một object có key là studentId
        }));
      const res = await teacherApi.postAtendence(values)
      console.log(res);
      getAttendence();
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
      message.success("Điểm danh thành công");
    } catch (errorInfo) {
      message.error('Điểm danh thất bại');
    }
  };

  const submitUpdateAtendence = async () => {
    try {
      const values = form.getFieldsValue();
      const students: StudentRequestDto[] = student.map((student, index: number) => {
        const attendanceStatus = student.students.attendenceData?.attendanceStatus || 'CO_MAT';
        const id = student.students.attendenceData?.id
        const studentReq: StudentRequestDto = {
          studentYearInfoId: student.id,
          status: attendanceStatus,
          note: values.note[index]!,
          id: id
        };
        return studentReq;
      });

      const attendanceRequest: AttendanceRequestDto = {
        dayOff: values.dayOff,
        listStudent: students,
        classId: classId!
      }
      const res = await teacherApi.postAtendence(attendanceRequest)
      console.log(res)
      await fetchStudents();
      message.success("Chỉnh sửa thành công");
    } catch (errorInfo) {
      message.error('Chỉnh Sửa thất bại');
    }
  }

  const CountStudentpresent = student.filter((st) => {
    return (st.students.attendenceData?.attendanceStatus === "CO_MAT")
  }).length

  const CountStudentSuspectedPermission = student.filter((st) => {
    return (st.students.attendenceData?.attendanceStatus === "NGHI_CO_PHEP")
  }).length

  const CountStudentSuspectedNotPermission = student.filter((st) => {
    return (st.students.attendenceData?.attendanceStatus === "NGHI_KHONG_PHEP")
  }).length

  return (

    <div className="attendances">
<<<<<<< HEAD
      {schoolYearClass.length !== 0 && student.length !== 0 ?
        <>
          <div className="attendanceItem">
            <div
              className={`attendance ${attendenceClass === 'attendance-by-day' ? 'actives' : ''}`}
              onClick={() => setAttendenceClass('attendance-by-day')}
            >
              Điểm danh theo ngày
            </div>
            <div
              className={`attendance ${attendenceClass === 'attendance-by-month' ? 'actives' : ''}`}
              onClick={() => setAttendenceClass('attendance-by-month')}
            >
              Điểm danh theo tháng
=======
      <div className="attendanceItem">
        <div
          className={`attendance ${attendenceClass === 'attendance-by-day' ? 'actives' : ''}`}
          onClick={() => setAttendenceClass('attendance-by-day')}
        >
          Điểm danh theo ngày
        </div>
        <div
          className={`attendance ${attendenceClass === 'attendance-by-month' ? 'actives' : ''}`}
          onClick={() => setAttendenceClass('attendance-by-month')}
        >
          Điểm danh theo tháng
        </div>
      </div>
      <Form form={form}>
        <div className={`${attendenceClass !== 'attendance-by-day' ? 'hiddens' : 'attendance-by-day'}`}>
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
            <Form.Item className="dayOff" name="dayOff" > {/* Thêm name cho Form.Item */}
              <DatePicker
              defaultValue={dayOff}
                className="h-10 w-30" onChange={handleChangeDay}
                format={'M/D/YYYY'}
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
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
            </div>
          </div>
          <Form form={form}>
            <div className={`${attendenceClass !== 'attendance-by-day' ? 'hiddens' : 'attendance-by-day'}`}>
              <div style={{ display: 'flex', padding: '16px' }}>
                <Form.Item className="classId" style={{ marginRight: '14px' }}>
                  <Select placeholder="Chọn lớp học"
                    value={classId || undefined} style={{ width: 150 }} onChange={handleChange}>
                    {schoolYearClass.map((classData) => (
                      <Option key={classData.id} value={classData.id}>
                        {classData.className}
                      </Option>
                    ))} 
                  </Select>
                </Form.Item>
                <Form.Item className="dayOff" name="dayOff" initialValue={dayOff}> {/* Thêm name cho Form.Item */}
                  <DatePicker
                    defaultValue={dayOff}
                    className="h-10 w-30" onChange={handleChangeDay}
                    format={'M/D/YYYY'}
                    maxDate={dayjs()}
                  />
                </Form.Item>

                <div className="mx-4 border border-solid border-green-500 w-36 flex items-center justify-center rounded-md h-10">
                  Tất cả: {student.length}
                </div>
                <div className="border border-solid border-gray-300 w-40 flex justify-center items-center rounded-md h-10">
                  Có mặt: {`${CountStudentpresent}`}
                </div>
                <div className="mx-4 border border-solid border-gray-300 w-45 rounded-md flex items-center justify-center h-10">
                  Có phép: {`${CountStudentSuspectedPermission}`}
                </div>
                <div className="border border-solid border-gray-300 w-52 rounded-md flex justify-center items-center h-10">
                  Không phép: {`${CountStudentSuspectedNotPermission}`}
                </div>
                <div style={{ width: '560px' }}>
                  <Button type="primary" style={{ float: 'right', background: '#349634' }} onClick={submitUpdateAtendence}>
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
                    dataSource={student}
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
          <div className={`${attendenceClass !== 'attendance-by-month' ? 'hiddens' : 'attendance-by-month'}`}>
            <div style={{ display: 'flex', padding: '16px' }}>
              <div style={{ marginRight: '14px' }}>
                <Select style={{ width: 150 }} onChange={handleChange} value={schoolYearClass[0].id}>
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
<<<<<<< HEAD
                columns={columnsAttendenceByMonth}
                dataSource={student}
=======
                columns={columnsAttendenceByDay}
                dataSource={dataAttendenceByDay}
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
                pagination={false}
                bordered
              />
            </div>
<<<<<<< HEAD
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
        </> : <>
          <div>
            <h1>Thầy cô vui lòng hoàn thành các bước để điểm danh </h1>
            <div className="p-4">
              <Steps current={currentStep}>
                <Step title="Tạo lớp học" />
                <Step title="Tạo học sinh" />
                <Step title="Hoàn thành" />
              </Steps>

              {currentStep === 0 && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className={`flex items-center space-x-2 ${schoolYearClass.length !== 0 ? 'bg-green-500' : ''}`}
                  >
                    <NavLink to="/classes">
                      Tạo lớp học
                    </NavLink>
                  </Button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    className={`flex items-center space-x-2 ${student.length !== 0 ? 'bg-green-500' : ''}`}
                  >
                    <NavLink to='/students'>
                      Tạo học sinh
                    </NavLink>
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="mt-4">
                  <div className="attendanceItem">
                    <div
                      className={`attendance ${attendenceClass === 'attendance-by-day' ? 'actives' : ''}`}
                      onClick={() => setAttendenceClass('attendance-by-day')}
                    >
                      Điểm danh theo ngày
                    </div>
                    <div
                      className={`attendance ${attendenceClass === 'attendance-by-month' ? 'actives' : ''}`}
                      onClick={() => setAttendenceClass('attendance-by-month')}
                    >
                      Điểm danh theo tháng
                    </div>
                  </div>
                  <Form form={form}>
                    <div className={`${attendenceClass !== 'attendance-by-day' ? 'hiddens' : 'attendance-by-day'}`}>
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
                        <Form.Item className="dayOff" name="dayOff" initialValue={dayOff}> {/* Thêm name cho Form.Item */}
                          <DatePicker
                            defaultValue={dayOff}
                            className="h-10 w-30" onChange={handleChangeDay}
                            format={'M/D/YYYY'}
                            maxDate={dayjs()}
                          />
                        </Form.Item>

                        <div className="mx-4 border border-solid border-green-500 w-36 flex items-center justify-center rounded-md h-10">
                          Tất cả: {student.length}
                        </div>
                        <div className="border border-solid border-gray-300 w-40 flex justify-center items-center rounded-md h-10">
                          Có mặt: {`${CountStudentpresent}`}
                        </div>
                        <div className="mx-4 border border-solid border-gray-300 w-45 rounded-md flex items-center justify-center h-10">
                          Có phép: {`${CountStudentSuspectedPermission}`}
                        </div>
                        <div className="border border-solid border-gray-300 w-52 rounded-md flex justify-center items-center h-10">
                          Không phép: {`${CountStudentSuspectedNotPermission}`}
                        </div>
                        <div style={{ width: '560px' }}>
                          <Button type="primary" style={{ float: 'right', background: '#349634' }} onClick={submitUpdateAtendence}>
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
                            dataSource={student}
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
                  <div className={`${attendenceClass !== 'attendance-by-month' ? 'hiddens' : 'attendance-by-month'}`}>
                    <div style={{ display: 'flex', padding: '16px' }}>
                      <div style={{ marginRight: '14px' }}>
                        <Select style={{ width: 150 }} onChange={handleChange} value={schoolYearClass[0].id}>
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
                        dataSource={student}
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
                  </div>                </div>
              )}
            </div>
          </div>

        </>}

=======
          )}
          <div className="submit">
            <Button type="primary" className="btn-submit" onClick={handleSubmit}>
              Lưu Lại
            </Button>
          </div>
        </div>
      </Form>
      <div className={`${attendenceClass !== 'attendance-by-month' ? 'hiddens' : 'attendance-by-month'}`}>
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
>>>>>>> 9bcb39d09395e0284bef4f69424d4247c2c7fe1a
    </div>
  );
};

export default Attendences;


