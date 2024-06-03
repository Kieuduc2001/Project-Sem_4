import {
  Breadcrumb,
  Col,
  Radio,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { YearContext } from '../../context/YearProvider/YearProvider';
import teacherApi from '../../apis/urlApi';
import { TeacherClassSubjectData } from '../../types/response';
import Loader from '../../common/Loader';
import axios from 'axios';

const App: React.FC = () => {
  const [teacherClassSubject, setTeacherClassSubject] = useState<TeacherClassSubjectData[]>([]);
  const { idYear } = useContext(YearContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (idYear === null) return;
      setIsLoading(true);
      try {
        const res = await teacherApi.getTeacherSchoolYearClassSubject(idYear);
        setTeacherClassSubject(res?.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 2000) {
          setTeacherClassSubject([]);
        } else {
          console.error('Failed to fetch school year classes:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [idYear]);



  return (
    <div className="p-4 md:p-8 2xl:p-10">
      <Row>
        <Col span={6}>
          <Breadcrumb className="mb-10">
            <Breadcrumb.Item className="text-3xl text-black-2">
              Thống kê
            </Breadcrumb.Item>
          </Breadcrumb>
          <Col span={24} className="mb-10">
            <Select
              className="w-full"
              showSearch
              placeholder="Select"
              optionFilterProp="children"
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'tom',
                  label: 'Tom',
                },
              ]}
            />
          </Col>
          <Col span={24} className="mb-10">
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={1}>Tất cả</Radio>
                <Radio value={2}>Đã phân công</Radio>
                <Radio value={3}>Chưa phân công</Radio>
              </Space>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <div className="mt-auto grid justify-items-center  mb-4 w-full  rounded-md">
              <NavLink
                to="/assignment"
                type="default"
                className="text-base text-meta-9 border-2 border-solid bg-form-input w-full text-center p-2 rounded-md grid"
              >
                Thực hiện phân công
              </NavLink>
            </div>
          </Col>
        </Col>
        <Col span={1}></Col>
        <Col span={16}>
          <Row>
            <Col span={24}>
              {isLoading ? (
                <Loader />
              ) : (
                <Table dataSource={teacherClassSubject} loading={isLoading} className="mb-4" scroll={{ y: 500 }}>
                  <Table.Column title="Giáo viên"
                    render={(text, record: TeacherClassSubjectData) =>
                      `${record.teacherSchoolYear.teacher.sortName}`} />
                  <Table.Column title="Phân công giảng dạy"
                    render={(text, record: TeacherClassSubjectData) =>
                      record.subjectClassResList.map((subjectClass) => (
                        <div key={subjectClass.schoolYearSubject.id}>
                          <b>{subjectClass.schoolYearSubject.subject.name}</b> ({subjectClass.schoolYearClassList.map((cls) => cls.className).join(', ')})
                        </div>
                      ))
                    } />
                </Table>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default App; 
