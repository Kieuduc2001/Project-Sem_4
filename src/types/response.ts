import Students from "@pages/Students/Student-list";

export interface IResponse<T> {
  data: T;
  message: string;
  status: number;
  total?: number;
  meta?: {
    nextToken: string;
  };
}

export interface TeacherData {
  id: number;
  officerNumber: string;
  joiningDate: string;
  sortName: string;
  active: boolean,
  user: {
    id: number,
    username: string,
    password: string,
    status: null,
    roles: [
      {
        id: number,
        name: string
      }
    ],
    userDetail: {
      id: number,
      firstname: string,
      lastname: string,
      address: string,
      phone: string,
      email: string,
      gender: string,
      birthday: string,
      citizen_id: string,
      nation: null,
      avatar: string
    }
  }
}

export interface SchoolYearsData {
  id: number;
  startSem1: Date;
  startSem2: Date;
  end: Date;
}

export interface SchoolYearTeacherData {
  id: number;
  teacher: {
    id: number;
    officerNumber: string;
    sortName: string;
    joiningDate: string;
    active: boolean;
    positionId: number | null;
    departments: any[];
    user: {
      id: number;
      username: string;
      password: string;
      realPassword: string;
      token: string | null;
      createdAt: string;
      userDetail: {
        id: number;
        firstname: string;
        lastname: string;
        address: string;
        phone: string;
        email: string;
        gender: boolean;
        birthday: string;
        citizen_id: string;
        nation: string | null;
        avatar: string;
      }[];
    };
  };
  schoolYear: {
    id: number;
    startSem1: string;
    startSem2: string;
    end: string;
  };
}

export interface SubjectProgram {
  id: number;
  number: number;
  sem: string;
  grade: {
    id: number;
    name: string;
  };
  schoolYearSubject: {
    id: number;
    subject: {
      id: number;
      code: string;
      type: string;
      name: string;
    };
    schoolYear: {
      id: number;
      startSem1: string;
      startSem2: string;
      end: string;
    };
  };
}
export interface ObjectSchoolYearGrade{
    subject: {
      id: number,
      code: string,
      name: string
    },
}
export interface SchoolYearClassData {
  id: number;
  className: string;
  classCode: string;
  grade: {
    id: number; 
    name: string;
  };
  room: {
    id: number;
    name: string;
  };
  teacherSchoolYear: {
    id: number;
    teacher: {
      sortName: string;
    }
  }
}

export interface SchoolYearSubjectResponse {
  id: number;
  classId: number;
  subject: {
    id: number;
    code: string;
    type: string;
    name: string;
  };
  schoolYear: {
    id: number;
    startSem1: string;
    startSem2: string;
    end: string;
  };
}

// export interface ProgramData {
//   id: number;
//   schoolYearSubjectId: string;
//   gradeId: string;
//   number: number;
//   sem: string;
// }

export interface GradeData {
  id: number;
  name: string;
}

export interface RoomData {
  id: number;
  name: string;
}

export interface Subjects {
  id: number;
  name: string;
  type: string;
  code: string;
}

export interface DataTypeAcknowledge {
  key: number;
  Stt: number;
  Ho_Ten: string;
  Ngay_sinh: string;
  Nhan_Xet: JSX.Element;
  Trang_Thai: string
}
export interface DataAllClass {
  classId: number,
  className: string,
  SchoolBlock: {
    schoolBlockId: number,
    schoolBlockName: number
  }
}

export interface Acknowledge {
  id: number,
  Acknowledge: string
}
export interface EvaluateData {
  studentStudyResults: [
    {
      id: number,
      studyResultScores: [
        {
          id: number,
          schoolYearSubjectId:number,
          score: string
        }
      ],
      passed: boolean
    }
  ]
  studentInfo: {
    studentYearInfoId?: number,
    fullName: string,
    classId: number,
    birthday: string
  }

}
export interface Student {
  id: number,
  students: {
    id: number,
    gender: boolean,
    firstName: string,
    lastName: string,
    birthday: string,
    address: string,
    studentCode: string,
    studentStatuses: Array<StudentStatus>;
    attendenceData?: AttendenceData;
    evaluate?:EvaluateData;
  }
}

export interface StudentStatus {
  id: number;
  description: string;
  status: Status;
}

export interface Status {
  id: number;
  name: string;
  code: string;
}

export interface TeacherClassSubjectData {
  teacherSchoolYear: {
    id: number;
    teacher: {
      id: number;
      officerNumber: string;
      sortName: string;
      joiningDate: Date;
      active: boolean;
      positionId: number | null;
      departments: string | null;
      user: string | null;
    };
    schoolYear: {
      id: number;
      startSem1: Date;
      startSem2: Date;
      end: Date;
    };
  };
  subjectClassResList: {
    schoolYearSubject: {
      id: number;
      subject: {
        id: number;
        code: string;
        type: string;
        name: string;
      };
      schoolYear: {
        id: number;
        startSem1: Date;
        startSem2: Date;
        end: Date;
      } | null;
    };
    schoolYearClassList: {
      id: number;
      className: string;
      classCode: string;
      grade: {
        id: number;
        name: string;
      };
      room: string | null;
      teacherSchoolYear: {
        id: number;
        teacher: {
          id: number;
          officerNumber: string;
          sortName: string;
          joiningDate: Date;
          active: boolean;
          positionId: number | null;
          departments: string | null;
          user: string | null;
        };
        schoolYear: {
          id: number;
          startSem1: Date;
          startSem2: Date;
          end: Date;
        };
      } | null;
      schoolYear: {
        id: number;
        startSem1: Date;
        startSem2: Date;
        end: Date;
      } | null;
    }[];
  }[];
}

export interface Lesson {
  id: number;
  indexLesson: number;
  studyTime: string;
  dayOfWeek: string;
  note: string | null;
  teacherSchoolYearId: number;
  schoolYearClassId: number;
  schoolYearSubjectId: number;
  subjectName: string;
  teacherName: string;
  teacherId: number;
  className: string;
}

export interface Schedule {
  indexLesson: number;
  studyTime: string;
  dayOfWeek: string;
  note: string | null;
  teacherSchoolYearId: number;
  schoolYearClassId: number;
  schoolYearSubjectId: number;
  calendarReleaseId: number;
  [key: string]: Lesson | any;
}

export interface SubjectForSchedule {
  id: number;
  teacher: {
    teacherSchoolYearId: number;
    name: string;
    email: string;
    phone: string;
    subjects: string | null;
    teacherType: string;
  };
  subject: {
    id: number;
    name: string;
  };
}

export interface FeeList {
  id: number;
  title: string;
  term: string;
  termName: string;
  compel: boolean;
  status: boolean;
  refund: boolean;
  exemption: boolean;
  paymentTime: {
    id: number;
    name: string;
    time: number;
  };
  schoolyear: {
    id: number;
    startSem1: Date;
    startSem2: Date;
    end: Date;
  };
  feePrices: {
    id: number;
    price: number;
    gradeId: number | null;
    unit: {
      id: number;
      name: string;
      code: string;
    };
  }[];
}

export interface CalendarRelease {
  id: number;
  title: string;
  releaseAt: string;
  schoolYear: {
    id: number;
    startSem1: string;
    startSem2: string;
    end: string;
  };
  schedules: {
    id: number;
    indexLesson: number;
    studyTime: 'SANG' | 'CHIEU';
    dayOfWeek: 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
    note: string | null;
    teacherSchoolYearId: number;
    schoolYearClassId: number;
    schoolYearSubjectId: number;
    teacherName: string;
    className: string;
    subjectName: string;
  }[];
}
export interface AttendenceData {
  id: number,
  attendanceStatus: string,
  note: string,
  createdAt: string,
  studentInfo: {
    studentYearInfoId?: number,
    fullName: string,
    classId: number,
    birthday: string
  }
}
