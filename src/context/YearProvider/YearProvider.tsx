// src/contexts/SchoolYearContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import teacherApi from '../../apis/urlApi';

export type YearContextType = {
  idYear: number | null;
  setIdYear: (year: number | null) => void;
  schoolYears: any[]; // Consider specifying
};

export const YearContext = createContext<YearContextType>({
  idYear: null,
  setIdYear: () => { },
  schoolYears: [],
});

interface Props {
  children: ReactNode;
}

const YearProvider: React.FC<Props> = ({ children }) => {
  const [idYear, setIdYear] = useState<any>(() => {
    const storedYear = localStorage.getItem('idYear');
    return storedYear ? parseInt(storedYear, 10) : 1;
  });
  const [schoolYears, setSchoolYears] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const res = await teacherApi.getSchoolYear();
        setSchoolYears(res?.data);
        const defaultOption = res?.data.find((year: any) => year.id === id);
        if (defaultOption) {
          setIdYear(defaultOption.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(idYear);
  }, [idYear]);
  const value = useMemo(
    () => ({
      idYear,
      setIdYear,
      schoolYears,
    }),
    [idYear, schoolYears]
  );

  return <YearContext.Provider value={value}>{children}</YearContext.Provider>;
};

export default YearProvider;
