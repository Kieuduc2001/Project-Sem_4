import { useContext, useEffect, useState } from 'react';
import { Result, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Select } from 'antd';
import type {
  EvaluateData,
  SchoolYearClassAndSubEntrusted,
  SchoolYearClassEntrusted,
  Student,
  SubjectProgram,
} from '../types/response';
import { YearContext } from '../../src/context/YearProvider/YearProvider';
import teacherApi from '../apis/urlApi';
import axios from 'axios';
import mainAxios from '../apis/main-axios';
import { NavLink } from 'react-router-dom';
import { number } from 'yup';

const { Option } = Select;
const optionSemmer = [
  {
    label: "Học kì 1",
    value: "HOC_KI_1"
  },
  {
    label: "Học kì 2",
    value: "HOC_KI_2"
  },
  {
    label: "Cả năm",
    value: "CA_NAM"
  }
]
const Evaluate = () => {
  const [student, setStudent] = useState<Student[]>([]);
  const [classId, setClassId] = useState<number>();
  const { idYear } = useContext(YearContext);
  const [schoolYearClass, setSchoolYearClass] = useState<SchoolYearClassEntrusted[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idGrade, setIdGrade] = useState<number | null>(1);
  const [semester, setSemester] = useState<string>("HOC_KI_1");
  const [subjectIdGrade, setSubjectGrade] = useState<number>()
  const [subbjectGradeSchoolYear, setSubjectGradeSchoolYear] = useState<SubjectProgram[]>([]);
  useEffect(() => {
    fetchStudents(true);
  }, [classId]);
  useEffect(() => {
    fetObjectSchoolYearGrade();
  }, [idYear])
  useEffect(() => {
    fetchSchoolYearClassData();
  }, [subjectIdGrade])
  const fetchSchoolYearClassData = async () => {
    if (idYear === null) return;
    try {
      const res = await teacherApi.getSchoolYearClassEntrusted(idYear, semester);
      const classSchoolYearSubject = res.data;
      let SchoolYearSubjectData = classSchoolYearSubject.filter((clss: SchoolYearClassAndSubEntrusted) => clss.schoolYearSubject.id === subjectIdGrade);
        setSchoolYearClass(cls.classList)
      })
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
      if (schoolYearClass !== undefined && classId !== undefined) {
        if (getStudents) {
          const studentRes = await mainAxios.get(`/api/v1/student/get-student-year-info-by?bySchoolYearClassId=${classId}`);
          if (studentRes.status === 200) {
            const evaluateRes = await teacherApi.getEvaluateSubject(classId, subjectIdGrade, semester);
            if (evaluateRes.status === 200) {
              const newStudent = studentRes.data.map((sd: Student) => {
                sd.students.evaluate = evaluateRes.data.studentScoreSubject.find((el: EvaluateData) => el.studentYearInfo.studentYearInfoId === sd.id);
                return sd;
              });
              setStudent(newStudent);
            }
          }
        }
      }
      console.log(student)
    }

    catch (error) {
      console.log(error);
      setStudent([])
    }
  };

  const fetObjectSchoolYearGrade = async () => {
    if (idGrade !== undefined) {
      const res = await teacherApi.getSchoolYearSubjectGrade(idGrade);
      setSubjectGradeSchoolYear(res.data);
    }
  }

  const handleClassChange = (value: number, option: any) => {
    setClassId(value);
    setIdGrade(option.IdGrade);
    fetchStudents(true);
  };
  const handleSemmerChange = (value: string) => {
    setSemester(value);
    fetchStudents(true)

  };
  const handleSemmerChange = (value: string) => {
    setSemester(value);
  };
  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleSubjectClassChange = (value: number) => {
    setSubjectGrade(value);
  }
  const chooseSubject = async (idSubject: number) => {
    setSubjectGrade(idSubject);
    const res = await teacherApi.getSchoolYearClassEntrusted(idYear, semester);
    const classSchoolYearSubject = res.data;
    let SchoolYearSubjectData = classSchoolYearSubject.filter((clss: SchoolYearClassAndSubEntrusted) => clss.schoolYearSubject.id === idSubject);
    SchoolYearSubjectData.forEach((cls: SchoolYearClassAndSubEntrusted) => {
      setSchoolYearClass(cls.classList)
    })

  }
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
      render: (_, item) => (
        <>{item.students.firstName} {item.students.lastName}</>
      )
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'students',
      key: 'Ngay_sinh',
      width: '14%',
      align: 'center',
      render: (_, item) => (
        <>{formatDate(item.students.birthday)}</>
      )
    },
    {
      dataIndex: 'students',
      key: 'Diem',
      width: '14%',
      align: 'center',
      render: (_, item) => (
        <>{item.students.evaluate?.studentScores.DTB}</>
      )
    },
    {
      title: 'Điểm Kiểm Tra Thường Xuyên',
      dataIndex: 'students',
      key: 'Diem',
      width: '14%',
      align: 'center',
      render: (_, item) => (
        <>{item.students.evaluate?.studentScores.KTTX}</>
      )
    },
    {
      title: 'Điểm Kiểm Tra Cuối Kì ',
      dataIndex: 'students',
      key: 'Diem',
      width: '14%',
      align: 'center',
      render: (_, item) => (
        <>{item.students.evaluate?.studentScores.KT_CUOI_KY}</>
      )
    },
    {
      title: 'Điểm Kiểm Tra Giữa Kì ',
      dataIndex: 'students',
      key: 'Diem',
      width: '14%',
      align: 'center',
      render: (_, item) => (
        <>{item.students.evaluate?.studentScores.DTB}</>
      )
=======
      )
    },
    {
              <div>
          <div style={{ display: 'flex', padding: '16px' }}>
            <div style={{ marginRight: '14px', display: "flex" }}>
              <Select placeholder="Chọn môn học"
                className='mr-1'
                style={{ width: 150 }} onChange={handleSubjectClassChange}>
                {subbjectGradeSchoolYear.map((subData, indexSubject) => (
                  <Option key={indexSubject} value={subData.schoolYearSubject.id}>
                    {subData.schoolYearSubject.subject.name}
                  </Option>
                ))}
              </Select>
              <Select placeholder="Chọn lớp học"
                style={{ width: 150 }} onChange={handleClassChange}>
                {schoolYearClass.map((classData, indextClass) => (
                  <Option key={indextClass} value={classData.classInfo?.id}>
                    {classData.classInfo?.className}
                  </Option>
                ))}
              </Select>
              <Select placeholder="Chọn kì học"
                className='ml-1'
                value={semester}
                onChange={handleSemmerChange}>
                {optionSemmer.map((semesters, index) => (
                  <Option key={index} value={semesters.value}>
                    {semesters.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ width: '100%' }}>
              <NavLink
                to='/evaluteCreate'
                style={{ float: 'right', background: '#1677ff', alignContent: 'center' }}
                className='float-right bg-green-600 text-center text-white h-8 w-24 rounded'
              >
                Thêm điểm
              </NavLink>
            </div>
          </div>
          <div>
          {classId && subjectIdGrade && semester ?

            <Table
              columns={columnEvaluate}
              dataSource={student}
              pagination={false}
              bordered
              scroll={{ x: 1500, y: 365 }}
            /> :
            <Result className='mt-20'
            title="vui lòng chọn môn học và lớp học để xem điểm"
          />
          }
          </div>
        </div>
    </div>
  );
};
export default Evaluate;
