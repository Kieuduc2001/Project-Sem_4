import { useContext, useEffect, useState } from 'react';
import { DatePicker, Form, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { Select } from 'antd';
import { Button } from 'antd';
import type {
  SchoolYearClassData,
  Student,
  EvaluateData,
  ObjectSchoolYearGrade,
} from '../types/response';
import { YearContext } from '../../src/context/YearProvider/YearProvider';
import teacherApi from '../apis/urlApi';
import axios from 'axios';
import mainAxios from '../apis/main-axios';

const { Option } = Select;
const Evaluate = () => {
  const [student, setStudent] = useState<Student[]>([]);
  const [evaluate, setEvaluate] = useState('HOC_KI_1');
  const [classId, setClassId] = useState<number | null>(null);
  const { idYear } = useContext(YearContext);
  const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [objctGrade, setObjectGrade] = useState<ObjectSchoolYearGrade[]>([])
  const [idGrade, setIdGrade] = useState<number | null>(null)
  useEffect(() => {
    fetchStudents(true);
  }, [classId]);

  useEffect(() => {
    fetchSchoolYearClassData()
    fetObjectSchoolYearGrade();
  }, [idYear])

  useEffect(() => {
    fetObjectSchoolYearGrade();
  }, [idGrade])
  useEffect(() => {
    if (schoolYearClass.length > 0) {
      setClassId(schoolYearClass[0].id);
      setIdGrade(schoolYearClass[0].grade.id)
    }
    else {
      setClassId(null);
      setIdGrade(null);
    }

  }, [schoolYearClass]);
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
  const fetchStudents = async (getStudents: boolean = false): Promise<void> => {
    try {
      if (schoolYearClass !== null && classId !== null) {
        if (getStudents) {
          const studentRes = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
          if (studentRes.status === 200) {
            const evaluateRes = await teacherApi.getEvaluate(classId, evaluate);
            if (evaluateRes.status === 200) {
              const studentData = studentRes.data;
              const evaluateData = evaluateRes.data;
              setStudent(studentData.map((sd: Student) => {
                const std: Student = sd;
                const el = evaluateData.find((evaluate: EvaluateData) => evaluate.studentInfo.studentYearInfoId === sd.id);
                if (el) {
                  const elData: EvaluateData = {
                    studentStudyResults: el?.studentStudyResults,
                    studentInfo: el.studentInfo,
                    
                  };
                  std.students.evaluate = elData;
                } else {
                  std.students.evaluate = undefined;
                }
                return std;
              }));
            }
          }
        }
      }
    }
    catch (error) {
      setStudent([])
    }
  };

  const fetObjectSchoolYearGrade = async () => {
    const res = await teacherApi.getSchoolYearSubjectGrade(idGrade);
    setObjectGrade(res.data);
  }

  const handleClassChange = (value: number, option: any) => {
    setClassId(value);
    setIdGrade(option.IdGrade);
  };
  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const columnEvaluate: TableColumnsType<Student> = [
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

  ];


  const dynamicColumns: TableColumnsType<Student> = student.map((st, index) => {
    const subjectNames: string[] = [];
  
    st.students.evaluate?.studentStudyResults.forEach((sts) => {
      sts.studyResultScores.forEach((gsad) => {
        const subjectId = gsad.schoolYearSubjectId;
        const subjectInfo = objctGrade.find((ob) => ob.subject.id === subjectId);
        if (subjectInfo) {
          subjectNames.push(subjectInfo.subject.name);
        }
      });
    });
  
    return {
      title:`${subjectNames}`, // Combine subject names into a single title
      dataIndex: `students`, // Example dynamic dataIndex
      width: '25%',
      key: `${subjectNames}`, // Unique key for each dynamic column
      align: 'center',
      render: (item: any) => (
        <>
          {item.students.evaluate?.studentStudyResults.map((sts: any) =>
            sts.studyResultScores.map((gsad: any) => (
              <div key={gsad.schoolYearSubjectId}>
                {gsad.score} {/* Example: Display score or other data */}
              </div>
            ))
          )}
        </>
      ),
    };
  });
  
  // Merging static and dynamic columns
  const mergedColumns: TableColumnsType<Student> = [...columnEvaluate, ...dynamicColumns];
  
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="evaluate ">
      <div className="bg-gray-200 h-10 flex">
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'HOC_KI_1' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('HOC_KI_1')}
        >
          Học Kỳ 1
        </div>
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'HOC_KI_2' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('HOC_KI_2')}
        >
          Học Kỳ 2
        </div>
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'CA_NAM' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('CA_NAM')}
        >
          Cả năm
        </div>
      </div>
      <div
        className={`${evaluate !== 'HOC_KI_1' ? 'hidden' : 'HOC_KI_1'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div className="classId" style={{ marginRight: '14px' }}>
            <Select placeholder="Chọn lớp học"
              value={classId || undefined} style={{ width: 150 }} onChange={handleClassChange}>
              {schoolYearClass.map((classData) => (
                <Option key={classData.id} value={classData.id} IdGrade={classData.grade.id}>
                  {classData.className}
                </Option>
              ))}
            </Select>
          </div>
          <Space direction="vertical">
            <DatePicker
              style={{ height: '38px' }}
              disabledDate={(date) => {
                return date.isBefore(
                  dayjs(
                    new Date(
                      `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
                    )
                  )
                );
              }}
            />
          </Space>
          <div style={{ width: '870px' }}>
            <Button
              type="primary"
              style={{ float: 'right', background: '#349634' }}
              onClick={showModal}
            >
              Thêm điểm
            </Button>
          </div>
        </div>
        <div>
          { }
          <Table
            columns={mergedColumns}
            dataSource={student}
            pagination={false}
            bordered
            scroll={{ x: 1500, y: 365 }}
          />
        </div>
        <div className="w-full mt-4">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600 "
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Lưu Lại
          </Button>
        </div>
        <div className="submit">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600"
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Sửa Đổi
          </Button>
        </div>
      </div>
      <div
        className={`${evaluate !== 'HOC_KI_2' ? 'hidden' : 'HOC_KI_2'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select defaultValue={classId} style={{ width: 150 }} onChange={handleClassChange}>
              {schoolYearClass.map((classData) => (
                <Option key={classData.id} value={classData.id}>
                  {classData.className}
                </Option>
              ))}
            </Select>
          </div>
          <Space direction="vertical">
            <DatePicker
              style={{ height: '38px' }}
              disabledDate={(date) => {
                return date.isBefore(
                  dayjs(
                    new Date(
                      `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
                    )
                  )
                );
              }}
            />
          </Space>
          <div style={{ width: '870px' }}>
            <Button
              type="primary"
              style={{ float: 'right', background: '#349634' }}
              onClick={showModal}
            >
              Thêm điểm
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columnEvaluate}
            dataSource={student}
            pagination={false}
            bordered
            scroll={{ x: 1500, y: 365 }}
          />
        </div>
        <div className="w-full mt-4">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600 "
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Lưu Lại
          </Button>
        </div>
        <div className="submit">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600"
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Sửa Đổi
          </Button>
        </div>
      </div>
      <div
        className={`${evaluate !== 'CA_NAM' ? 'hidden' : 'CA_NAM'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select defaultValue={classId} style={{ width: 150 }} onChange={handleClassChange}>
              {schoolYearClass.map((classData) => (
                <Option key={classData.id} value={classData.id}>
                  {classData.className}
                </Option>
              ))}
            </Select>
          </div>
          <Space direction="vertical">
            <DatePicker
              style={{ height: '38px' }}
              disabledDate={(date) => {
                return date.isBefore(
                  dayjs(
                    new Date(
                      `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
                    )
                  )
                );
              }}
            />
          </Space>
          <div style={{ width: '870px' }}>
            <Button
              type="primary"
              style={{ float: 'right', background: '#349634' }}
              onClick={showModal}
            >
              Thêm điểm
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columnEvaluate}
            dataSource={student}
            pagination={false}
            bordered
            scroll={{ x: 1500, y: 365 }}
          />
        </div>
        <div className="w-full mt-4">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600 "
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Lưu Lại
          </Button>
        </div>
        <div className="submit">
          <Button
            type="primary"
            className="float-right mr-4 bg-green-600"
            style={{ background: 'rgb(52, 150, 52)' }}
          >
            Sửa Đổi
          </Button>
        </div>
      </div>
      <Modal
        open={open}
        title="Nhận xét nhanh"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
            style={{ background: 'rgb(52, 150, 52' }}
          >
            Lưu
          </Button>,
        ]}
      >
        <div>
          <p>
            nhập điểm
          </p>

        </div>
        <Form style={{ marginTop: '15px' }}>
          <Form.Item
            name={'studentYearInfoId'}
            rules={[
              { required: true, message: 'Vui lòng chọn học sinh!' },
            ]}
            label="Thêm điểm cho học sinh"
          >
            <Select>
              {student.map((st) => (
                <Select.Option key={st.students.id} value={st.students.id}>
                  {st.students.lastName + st.students.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>

          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Evaluate;
