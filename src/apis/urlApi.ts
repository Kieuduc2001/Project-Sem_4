import { IResponse } from '../types/response';
import mainAxios from './main-axios';

enum URL {
  // teacher
  GET_TEACHER = '/api/v1/teacher',
  POST_TEACHER = '/api/v1/teacher',
  PUT_TEACHER = '/api/v1/teacher',
  DELETE_TEACHER = '/api/v1/teacher',
  CREATE_TEACHER_SCHOOL_YEAR = '/api/v1/school/creat-teacher-school-year',
  //school
  CREATE_SCHOOL_YEAR_SUBJECT = '/api/v1/school/creat-school-year_subject',
  CREATE_SCHOOL_YEAR = '/api/v1/school/creat-school-year',
  CREATE_SCHOOL_YEAR_CLASS = '/api/v1/school/creat-school-year-class',
  CREATE_SCHOOL_YEAR_SUBJECT_GRADE = '/api/v1/school/creat-school-year-subject-grade',
  CREATE_TEACHER_CLASS_SUBJECT = '/api/v1/school/creat-teacher-school-year-class-subject',
  GET_TEACHER_SCHOOL_YEAR = '/api/v1/school/teacher-school-year',
  GET_SCHOOL_YEAR_SUBJECT = '/api/v1/school/school-year-subject',
  GET_SCHOOL_YEAR = '/api/v1/school/school-year',
  GET_SCHOOL_YEAR_CLASS = '/api/v1/school/school-year-class',
  GET_SCHOOL_YEAR_TEACHER_SUBJECT = '/api/v1/school/teacher-school-year-class-subject',
  GET_SUBJECTS = '/api/v1/school/subject',
  GET_GRADES = '/api/v1/school/get-grades',
  GET_ROOMS = '/api/v1/school/get-rooms',
  //students
  GET_STUDENTS_YEARS = '/api/v1/student/get-student-year-info-by',
  CREATE_ATENDENCE = '/api/v1/student/mark',
  //Schedule
  GET_SCHEDULE = '/api/v1/schedule/get-schedule-by',
  GET_SCHEDULE_SUBJECTS = '/api/v1/schedule/get-teacher-class-subject',
  //Fee
  GET_FEE_LIST = '/api/v1/school-year-fee/getBy',
  CREATE_FEE = '/api/v1/school-year-fee/create',
  GET_FEE_PERIOD = '/api/v1/fee-period/getBy',
  CREATE_FEE_PERIOD = '/api/v1/fee-period/create',
  GET_SCOPES = '/api/v1/school-year-fee/getUnitScopePaymentMethod',
  //Homework
  GET_HOMEWORK = '/api/v1/getHomeWorksByTeacherSchoolYearClassSubject',
  GET_HOMEWORK_DETAILS = '/api/v1/getHomeWorkDetail',
  GET_TEACHER_FOR_HOMEWROK = '/api/v1/school/teacher-school-year-class-subject-by-teacher',
  CREATE_HOMEWORK = '/api/v1/createHomeWork',
}

const teacherApi = {
  getTeacher: (): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_TEACHER}`);
  },
  getTeacherById: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_TEACHER}/${id}`);
  },
  postTeacher: (payload: { slug: string }): Promise<IResponse<any>> => {
    return mainAxios.post(`${URL.POST_TEACHER}?userId=${payload.slug}`);
  },
  putTeacher: (id: number): Promise<IResponse<any>> => {
    return mainAxios.post(`${URL.POST_TEACHER}/${id}`);
  },
  deleteTeacher: (id: number): Promise<IResponse<any>> => {
    return mainAxios.post(`${URL.POST_TEACHER}/${id}`);
  },
  postCreateTeacherSchoolYear: (payload: {
    teacherIds: number[];
    schoolYear: number;
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_TEACHER_SCHOOL_YEAR, payload);
  },
  postCreateSchoolYearSubject: (payload: {
    subjectIds: number[];
    schoolYearId: number;
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_SCHOOL_YEAR_SUBJECT, payload);
  },
  postCreateSchoolYear: (payload: {
    startSem1: string;
    startSem2: string;
    end: string;
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_SCHOOL_YEAR, payload);
  },
  postCreateSchoolYearSubjectGrade: (payload: {
    gradeId: number;
    schoolYearSubjectId: number;
    number: number;
    sem: string;
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_SCHOOL_YEAR_SUBJECT_GRADE, payload);
  },
  postCreateSchoolYearClass: (payload: {
    className: string;
    classCode: string;
    gradeId: number;
    roomId: number;
    teacherSchoolYear: number;
    schoolYear: number;
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_SCHOOL_YEAR_CLASS, payload);
  },
  postTeacherClassSubject: (payload: {
    teacherSchoolYearId: number;
    subjectClassList: {
      schoolYearSubjectId: number;
      schoolYearClassId: number[];
    }[];
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_TEACHER_CLASS_SUBJECT, payload);
  },
  postAtendence: (studentYearInfoId: number, status: boolean, note: string): Promise<IResponse<any>> => {
    return mainAxios.post(`${URL.CREATE_ATENDENCE}?studentYearInfoId=${studentYearInfoId}&status=${status}${note ? `&note${note}` : ''}`);
  },
  getSchoolYear: (): Promise<IResponse<any>> => {
    return mainAxios.get(URL.GET_SCHOOL_YEAR);
  },
  getSchoolYearById: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHOOL_YEAR}/${id}`);
  },
  getTeacherSchoolYear: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_TEACHER_SCHOOL_YEAR}?schoolYearId=${id}`);
  },
  getSchoolYearSubject: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHOOL_YEAR_SUBJECT}?schoolYearId=${id}`);
  },
  getSchoolYearClass: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHOOL_YEAR_CLASS}?schoolYearId=${id}`);
  },
  getTeacherSchoolYearClassSubject: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHOOL_YEAR_TEACHER_SUBJECT}?schoolYearId=${id}`)
  },
  getGrades: (): Promise<IResponse<any>> => {
    return mainAxios.get(URL.GET_GRADES);
  },
  getRooms: (): Promise<IResponse<any>> => {
    return mainAxios.get(URL.GET_ROOMS);
  },
  getSubjectById: (id?: number): Promise<IResponse<any>> => {
    const url = id ? `${URL.GET_SUBJECTS}?id=${id}` : URL.GET_SUBJECTS;
    return mainAxios.get(url);
  },
  getStudents: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_STUDENTS_YEARS}?bySchoolYearId=${id}`);
  },
  getStudentByClass: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_STUDENTS_YEARS}?bySchoolYearClassId=${id}`);
  },
  getSchedule: (): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHEDULE}`)
  },
  getScheduleSubject: (): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCHEDULE_SUBJECTS}`)
  },
  getFeeList: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_FEE_LIST}?schoolYearId=${id}`)
  },
  postFeeList: (payload: {
    title: string;
    term: string;
    compel: boolean;
    status: boolean;
    refund: boolean;
    paymentTimeId: number;
    schoolYearId: number;
    feePriceList: {
      price: number;
      gradeId: number;
      unitId: number;
    }[];
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_FEE, payload);
  },
  getFeePeriod: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_FEE_PERIOD}?schoolYearId=${id}`);
  },
  getScope: (): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_SCOPES}`);
  },
  postFeePeriod: (payload: {
    title: string;
    content: string;
    schoolYearId: number;
    endDate: string;
    feePeriodScope: {
      objectIdList: number[];
      scopeId: number;
    };
    schoolYearFeePeriodCreateList: {
      amount: number;
      schoolYearFeeId: number;
    }[];
  }): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_FEE_PERIOD, payload);
  },
  getHomework: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_HOMEWORK}?teacherSchoolYearClassSubjectId=${id}`)
  },
  getHomeworkDetails: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_HOMEWORK_DETAILS}?homeWorkId=${id}`)
  },
  getHomeworkTeacher: (id: number): Promise<IResponse<any>> => {
    return mainAxios.get(`${URL.GET_TEACHER_FOR_HOMEWROK}?schoolYearId=${id}`)
  },
  postCreateHomework: (formData: FormData): Promise<IResponse<any>> => {
    return mainAxios.post(URL.CREATE_HOMEWORK, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};
export default teacherApi;
