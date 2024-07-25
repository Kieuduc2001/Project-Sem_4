export interface AttendanceRequestDto {
  dayOff: Date;
  classId: number;
  listStudent: StudentRequestDto[];
}

export interface StudentRequestDto {
  studentYearInfoId?: number;
  status?: string;
  note: string;
  id?: number
}
export interface EvaluteRequesDto {
  schoolYearSubjectId?: number,
  schoolYearClassId: number,
  sem: string,
  studentScoreDetails: {
    studentYearInfoId: number,
    scoreDetails: {
      score: string,
      pointType: string
    }[]
  }[]

}