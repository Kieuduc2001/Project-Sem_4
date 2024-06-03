
import { FC, LazyExoticComponent, lazy } from 'react'

type LazyComponent = LazyExoticComponent<FC<any>>

interface RouteConfig {
  path: string
  component: LazyComponent
  title: string
  roles: string[]
}

const Attendence = lazy(() => import('../pages/Attendence/Attendence'))
const Students = lazy(() => import('../pages/Students/Student-list'))
const SchoolYears = lazy(() => import('../pages/School-years/School-years'))
const ClassesList = lazy(() => import('../pages/Category/School-year-class'))
const Teachers = lazy(() => import('../pages/Teachers/Teachers'))
const SchoolYearSubject = lazy(() => import('../pages/Category/School-year-subjects'));
const SchoolYearTeacher = lazy(() => import('../pages/Category/Teacher-school-year'));
const SubjectProgram = lazy(() => import('../pages/Category/Subject-program'));
// const Profile = lazy(() => import('../pages/Profile'));
const NoSchedule = lazy(() => import('../pages/Teaching/No-schedule'))
const CreateCalendarRl = lazy(() => import('../pages/Teaching/calendar-release'))
const CreateSchedule = lazy(() => import('../pages/Teaching/Create-schedule'))
const Schedule = lazy(() => import('../pages/Teaching/Schedules'))
const TeachingAssign = lazy(() => import('../pages/Teaching/Teaching-assignment'))
const AssignmentList = lazy(() => import('../pages/Teaching/Teaching-assign-list'))
const Acknowledge = lazy(() => import('../pages/Acknowledge'))
const Evaluate = lazy(() => import('../pages/Evaluate'))
const FeeList = lazy(() => import('../pages/Fee/Fee-list'))

export const coreRoutes: RouteConfig[] = [
  {
    path: '/students',
    component: Students,
    title: 'Students',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/school-years',
    component: SchoolYears,
    title: 'School Years',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/classes',
    component: ClassesList,
    title: 'Classes',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/teachers',
    component: Teachers,
    title: 'Teachers',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/school-year-subjects',
    component: SchoolYearSubject,
    title: 'Subject',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/school-year-teachers',
    component: SchoolYearTeacher,
    title: 'School Year Teacher',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/subject-program',
    component: SubjectProgram,
    title: 'Subject Program',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/assignment-list',
    component: AssignmentList,
    title: 'Assignment List',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/assignment',
    component: TeachingAssign,
    title: 'Assignment',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/schedule',
    component: Schedule,
    title: 'Schedule',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/create-schedule',
    component: CreateSchedule,
    title: 'Create Schedule',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/no-schedule',
    component: NoSchedule,
    title: 'Schedule',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/calendar-rl',
    component: CreateCalendarRl,
    title: 'Calenadar Release',
    roles: ['ROLE_BGH'],
  },
  {
    path: '/acknowledge',
    component: Acknowledge,
    title: 'Acknowledge',
    roles: ['ROLE_GV', 'ROLE_BGH'],
  },
  {
    path: '/evaluate',
    component: Evaluate,
    title: 'Evaluate',
    roles: ['ROLE_GV', 'ROLE_BGH'],
  },
  {
    path: '/attendence',
    component: Attendence,
    title: 'Attendance',
    roles: ['ROLE_GV', 'ROLE_BGH'],
  },
  {
    path: '/fee-list',
    component: FeeList,
    title: 'Fee',
    roles: ['ROLE_BGH'],
  }
]
export default coreRoutes
