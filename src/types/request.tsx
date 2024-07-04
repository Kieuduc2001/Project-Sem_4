export interface AttendanceRequestDto {
    dayOff: Date;
    classId: number;
    listStudent: StudentRequestDto[];
}

export interface StudentRequestDto {
    studentYearInfoId?: number;
    status?: string;
    note: string;
    id?:number
}