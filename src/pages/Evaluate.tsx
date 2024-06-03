import { useEffect, useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import axios from 'axios';
import { Select } from 'antd';
import { Button } from 'antd';
import type {
  Acknowledge,
  DataAllClass,
  DataTypeEvaluate,
  Student,
} from '../types/response';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

const Evaluate = () => {
  const AllClasses: DataAllClass[] = [
    {
      classId: 1,
      className: '1a1',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 2,
      className: '1a2',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 3,
      className: '1a3',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 4,
      className: '1a4',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 5,
      className: '1a5',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 6,
      className: '1a6',
      SchoolBlock: {
        schoolBlockId: 1,
        schoolBlockName: 1,
      },
    },
    {
      classId: 7,
      className: '2a1',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },
    {
      classId: 8,
      className: '2a2',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },
    {
      classId: 9,
      className: '2a3',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },
    {
      classId: 10,
      className: '2a4',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },

    {
      classId: 11,
      className: '2a5',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },
    {
      classId: 12,
      className: '2a6',
      SchoolBlock: {
        schoolBlockId: 2,
        schoolBlockName: 2,
      },
    },
    {
      classId: 13,
      className: '3a1',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 14,
      className: '3a2',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 15,
      className: '3a3',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 16,
      className: '3a4',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 17,
      className: '3a5',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 18,
      className: '3a6',
      SchoolBlock: {
        schoolBlockId: 3,
        schoolBlockName: 3,
      },
    },
    {
      classId: 19,
      className: '4a1',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 20,
      className: '4a2',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 21,
      className: '4a3',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 22,
      className: '4a4',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 23,
      className: '4a5',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 24,
      className: '4a6',
      SchoolBlock: {
        schoolBlockId: 4,
        schoolBlockName: 4,
      },
    },
    {
      classId: 25,
      className: '5a1',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
    {
      classId: 26,
      className: '5a2',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
    {
      classId: 27,
      className: '5a3',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
    {
      classId: 28,
      className: '5a4',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
    {
      classId: 29,
      className: '5a5',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
    {
      classId: 30,
      className: '5a6',
      SchoolBlock: {
        schoolBlockId: 5,
        schoolBlockName: 5,
      },
    },
  ];
  const Acknowledge: Acknowledge[] = [
    {
      id: 1,
      Acknowledge: 'Học sinh hăng hái phát xây dựng biểu bài',
    },
    {
      id: 2,
      Acknowledge: 'Biết giúp đỡ bạn bè trong học tập',
    },
    {
      id: 3,
      Acknowledge: 'Học sinh hay mất trật tự',
    },
    {
      id: 4,
      Acknowledge: 'Biết cách đánh vần to,dõng dạc',
    },
    {
      id: 5,
      Acknowledge: 'Biết cách làm việc theo nhóm',
    },
    {
      id: 6,
      Acknowledge:
        'Tích cực tham gia phát biểu xây dựng bài,hăng hái các hoạt động lớp',
    },
  ];
  const [student, setStudent] = useState<Student[]>([]);
  const [evaluate, setEvaluate] = useState('semester_once');

  const acknowledge = Acknowledge.map((a) => ({
    value: a.Acknowledge,
    label: a.Acknowledge,
  }));
  // cont
  const getStudents = async () => {
    const s = await axios.get(
      'http://14.248.97.203:4869/api/v1/student/students'
    );
    setStudent(s.data);
  };
  useEffect(() => {
    getStudents();
  }, [student]);
  const rowSelection: TableRowSelection<DataTypeEvaluate> = {
    onSelect: (record, selected, selectedRows) => {},
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  const handleChange = (value: string) => {};

  const options = AllClasses.map((c) => ({
    value: c.className,
    label: c.className,
  }));
  const columnEvaluate: TableColumnsType<DataTypeEvaluate> = [
    {
      title: 'Stt',
      dataIndex: 'Stt',
      key: 'Stt',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Họ tên',
      dataIndex: 'Ho_Ten',
      key: 'Ho_Ten',
      width: '30%',
      align: 'center',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'Ngay_sinh',
      key: 'Ngay_sinh',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Toán',
      dataIndex: 'Toan',
      key: 'Toan',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Tiếng Việt',
      dataIndex: 'Tieng_viet',
      width: '25%',
      key: 'Tieng_viet',
      align: 'center',
    },
    {
      title: 'Tiếng anh',
      dataIndex: 'Tieng_anh',
      width: '25%',
      key: 'Tieng_anh',
      align: 'center',
    },
    {
      title: 'Đạo đức',
      dataIndex: 'Dao_duc',
      width: '25%',
      key: 'Dao_duc',
      align: 'center',
    },
    {
      title: 'Tự nhiên và xã hội',
      dataIndex: 'Tu_nhien_va_xa_hoi',
      key: 'Tu_nhien_va_xa_hoi',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Lịch sử',
      dataIndex: 'Lich_su',
      key: 'Lich_su',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Địa lý',
      dataIndex: 'Dia_ly',
      key: 'Dia_ly',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Khoa học',
      dataIndex: 'Khoa_hoc',
      key: 'Khoa_hoc',
      width: '25%',
      align: 'center',
    },
    {
      title: 'Tin học và công nghệ',
      dataIndex: 'Tin_hoc_va_cong_nghe',
      width: '25%',
      key: 'Tin_hoc_va_cong_nghe',
      align: 'center',
    },
    {
      title: 'Thể dục',
      dataIndex: 'The_duc',
      width: '25%',
      key: 'The_duc',
      align: 'center',
    },
    {
      title: 'Mĩ thuật',
      dataIndex: 'Mi_thuat',
      width: '25%',
      key: 'Mi_thuat',
      align: 'center',
    },
    {
      title: 'Âm nhac',
      dataIndex: 'Am_nhac',
      width: '25%',
      key: 'Am_nhac',
      align: 'center',
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'Tong',
      width: '25%',
      key: 'Tong',
      align: 'center',
    },
    {
      title: 'Hạnh kiểm',
      dataIndex: 'Hanh_kiem',
      width: '25%',
      key: 'Hanh_kiem',
      align: 'center',
    },
    {
      title: 'Nhận xét',
      dataIndex: 'Nhan_Xet',
      width: '35%',
      key: 'Nhan_Xet',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Trang_Thai',
      width: '25%',
      key: 'Trang_Thai',
      align: 'center',
    },
  ];
  const dataEvaluate = student.map((data) => ({
    key: data.id,
    Ho_Ten: data.lastName + data.firstName, // Assuming `s` contains the name of the student
    Ngay_sinh: data.birthday ? data.birthday.split('T'[0]) : '',
    Stt: data.id,
    Nhan_Xet: (
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Nhập nhận xét"
        onChange={handleChange}
        options={acknowledge}
      />
    ),
    Trang_Thai: 0 ? 'Đã thông báo' : 'chưa thông báo',
    Hanh_kiem: 'Khá',
    Toan: 6,
    Tieng_viet: 7,
    Tieng_anh: 8,
    Dao_duc: 9,
    Tu_nhien_va_xa_hoi: 10,
    Lich_su: 9,
    Dia_ly: 8,
    Khoa_hoc: 7,
    Tin_hoc_va_cong_nghe: 6,
    The_duc: 10,
    Mi_thuat: 8,
    Am_nhac: 8,
    Tong: 8,
    // Tong:(Toan+ Tieng_viet+Tieng_anh+Dao_duc+Tu_nhien_va_xa_hoi+Lich_su+Dia_ly+Khoa_hoc+Tin_hoc_va_cong_nghe+The_duc+Mi_thuat+Am_nhac)/12
  }));
  return (
    <div className="evaluate ">
      <div className="bg-gray-200 h-10 flex">
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'semester_once' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('semester_once')}
        >
          Học Kỳ 1
        </div>
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'semester_two' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('semester_two')}
        >
          Học Kỳ 2
        </div>
        <div
          className={`flex items-center justify-center px-14 cursor-context-menu ${evaluate === 'the_whole_school_year' ? 'border-t-2 border-green-500 bg-white w-189 px-0' : ''}`}
          onClick={() => setEvaluate('the_whole_school_year')}
        >
          Cả năm
        </div>
      </div>
      <div
        className={`${evaluate !== 'semester_once' ? 'hidden' : 'semester_once'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select
              style={{ width: '100px', height: '38px' }}
              options={options}
              defaultValue={options[0].value}
            />
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
            >
              Thông báo cho PH
            </Button>
          </div>
        </div>
        <div>
          {}
          <Table
            rowSelection={{
              ...rowSelection,
            }}
            columns={columnEvaluate}
            dataSource={dataEvaluate}
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
        className={`${evaluate !== 'semester_two' ? 'hidden' : 'semester_two'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select
              style={{ width: '100px', height: '38px' }}
              options={options}
              defaultValue={options[0].value}
            />
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
            >
              Thông báo cho PH
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowSelection={{
              ...rowSelection,
            }}
            columns={columnEvaluate}
            dataSource={dataEvaluate}
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
        className={`${evaluate !== 'the_whole_school_year' ? 'hidden' : 'the_whole_school_year'}`}
      >
        <div style={{ display: 'flex', padding: '16px' }}>
          <div style={{ marginRight: '14px' }}>
            <Select
              style={{ width: '100px', height: '38px' }}
              options={options}
              defaultValue={options[0].value}
            />
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
            >
              Thông báo cho PH
            </Button>
          </div>
        </div>
        <div>
          <Table
            rowSelection={{
              ...rowSelection,
            }}
            columns={columnEvaluate}
            dataSource={dataEvaluate}
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
    </div>
  );
};
export default Evaluate;
