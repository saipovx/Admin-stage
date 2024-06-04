import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import s from './Statistics.module.scss'
import Select from 'react-select';
import { Button, DatePicker } from 'antd';

import setting from './img/setting.svg'
import setbar from './img/setbar.svg'
import setting__title from './img/setting__title.svg'

import title_bar1 from './img/title_bar1.svg'
import title_bar2 from './img/title_bar2.svg'
import title_bar3 from './img/title_bar3.svg'
import array from './img/array.svg'

import Group from './img/Group.svg'
import ExcelJS from 'exceljs';
import { FiSettings } from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

import { Line } from 'react-chartjs-2';
import TableItem from './TableItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import PaginationTwo from '../../components/PaginationTwo';
import Save from '../../components/save';
import SaveTwo from '../../components/saveTwo';
import downloadExcelJSX from '../../components/downloadExcel';
import DownloadExcelJSX from '../../components/downloadExcel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend
);

export default function Statisticss ({handlePageChange, setcount_documents, page , count_documents,count_documentsTwo,setcount_documentsTwo, pageTwo}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [VenuesData, setStaticData] = useState([])

  const { refreshToken } = useAuth();

  const [currentWeek, setCurrentWeek] = useState(true);

  const [startDate, setStartDate] = useState(''); 

  const [endDate, setEndDate] = useState('');

  const [activeFunction, setActiveFunction] = useState('previousWeek');

  const [totalClickCount, settotalClickCount] = useState(0)
  const [totalDisplayCount, setTotalDisplayCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCtr, setTotalCtr] = useState(0);
  const [totalCpc, setTotalCpc] = useState(0);
  const [totalCpm, setTotalCpm] = useState(0);

  const [UserCount, setUserCount] = useState([])
  
  const calculateTotalClickCount = (data) => {
    return data.reduce((total, item) => total + item.click_count, 0);
  };

  const calculateTotalDisplayCount = (data) => {
    return data.reduce((total, item) => total + item.display_count, 0);
  };
  
  const calculateTotalExpenses = (data) => {
    return data.reduce((total, item) => total + item.expenses, 0);
  };
  
  const calculateTotalRevenue = (data) => {
    return data.reduce((total, item) => total + item.revenue, 0);
  };
  
  const calculateTotalCtr = (data) => {
    const total = data.reduce((total, item) => total + item.ctr, 0);
    return (total * 100 / data.length).toFixed(2) + "%"; 
  };
  
  const calculateTotalCpc = (data) => {
    return data.reduce((total, item) => total + item.cpc, 0);
  };
  
  const calculateTotalCpm = (data) => {
    return data.reduce((total, item) => total + item.cpm, 0);
  };

  const fetchData = async () => {

    if (!startDate || !endDate) {
      return; // Не отправляем запрос, если даты не выбраны
    }
 
    const loginEndpoint = `/api/statistic/by_date?start_date=${startDate}&end_date=${endDate}`;

    const url = `${apiUrl}${loginEndpoint}`;

    try {
      const response = await axios.get(url, {

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },

        params: {
          start_date: startDate,
          end_date: endDate,
        },

      });

      setStaticData(response.data);

      settotalClickCount(calculateTotalClickCount(response.data))
      setTotalDisplayCount(calculateTotalDisplayCount(response.data));
      setTotalExpenses(calculateTotalExpenses(response.data));
      setTotalRevenue(calculateTotalRevenue(response.data));
      setTotalCtr(calculateTotalCtr(response.data));
      setTotalCpc(calculateTotalCpc(response.data));
      setTotalCpm(calculateTotalCpm(response.data));
    


    } catch (error) {

      if (error.response && error.response.status === 401) {
        refreshToken();
      }

    }

      const loginEndpointTwo = `/api/statistic/by_campaign?limit=20&page=${page}`;
  
      const urlTwo = `${apiUrl}${loginEndpointTwo}`;

      try {

        const response = await axios.get(urlTwo, {
  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
  
          params: {
            start_date: startDate,
            end_date: endDate,
          },
  
        });
  
        setAdvertisingData(response.data.objects);
        setcount_documents(response.data.count_documents);

  
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        }
      }

      const loginEndpointThree = `/api/statistic/by_site?limit=20&page=${pageTwo}`;
  
      const urlThree = `${apiUrl}${loginEndpointThree}`;
      
      try {
        const response = await axios.get(urlThree, {
  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
  
          params: {
            start_date: startDate,
            end_date: endDate,
          },
  
        });
  
        setSiteData(response.data.objects);
        setcount_documentsTwo(response.data.count_documents);
  
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        }
      }

      const loginEndpointFour = `/api/management/users_statistic`;
  
      const urlFour = `${apiUrl}${loginEndpointFour}`;
      
      try {

        const response = await axios.get(urlFour, {
  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
  
        });
  
        setUserCount(response.data)
  
      } catch (error) {

        if (error.response && error.response.status === 401) {
          refreshToken();
        }

      }



  };

  console.log(VenuesData);


  const [AdvertisingData, setAdvertisingData] = useState([])

  const AdvertisingDataType = AdvertisingData

  const [SiteData, setSiteData] = useState([])


  const handleCurrentWeekClick = () => {

    setActiveFunction('currentWeek');

    setCurrentWeek(true);
  
    const currentDate = new Date();

    const dayOfWeek = currentDate.getDay();
  
    if (dayOfWeek === 0) {
      currentDate.setDate(currentDate.getDate() - 7);
    }
  
    const startDate = new Date(currentDate);

    startDate.setDate(currentDate.getDate() - dayOfWeek + 1);
  
    const endDate = new Date(currentDate);

    endDate.setDate(startDate.getDate() + 6);
  
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
  
    fetchData();
  };
  

  const handlePreviousWeekClick = () => {

    setCurrentWeek(true);

    setActiveFunction('previousWeek');
  

    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
  
    startDate.setDate(currentDate.getDate() - 14);
  
    endDate.setDate(currentDate.getDate() - 7);
  
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    fetchData();

  };

  const handleLast7DaysClick = () => {

    setCurrentWeek(false);

    setActiveFunction('last7Days');
  
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
  
    startDate.setDate(currentDate.getDate() - 7);
  
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    fetchData();

  };

  const handleLast30DaysClick = () => {

    setCurrentWeek(false);

    setActiveFunction('last30Days');
  
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
  
    startDate.setDate(currentDate.getDate() - 30);
  
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    fetchData();

  };

  const handleLast3MonthsClick = () => {

    setCurrentWeek(false);

    setActiveFunction('last3Months');
  
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
  
    startDate.setMonth(currentDate.getMonth() - 3);
  
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    fetchData();

  };

  const handleLastYearClick = () => {

    setCurrentWeek(false);

    setActiveFunction('lastYear');
  
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate);
  
    startDate.setFullYear(currentDate.getFullYear() - 1);
  
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    fetchData();

  };

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedDateEnd, setSelectedDateEnd] = useState(null);


  const handleDateChangeStart = (date, dateString) => {
    setSelectedDate(date);
    fetchData(date, selectedDate);
  };

  const handleDateChangeEnd = (date, dateString) => {
    setSelectedDateEnd(date);
    fetchData(selectedDateEnd, date);
  };

  useEffect(() => {
    // В зависимости от активной функции вызываем соответствующую функцию
    switch (activeFunction) {

      case 'currentWeek':
        handleCurrentWeekClick();
        break;
      case 'previousWeek':
        handlePreviousWeekClick();
        break;
      case 'last7Days':
        handleLast7DaysClick();
        break;
      case 'last30Days':
        handleLast30DaysClick();
        break;
      case 'last3Months':
        handleLast3MonthsClick();
        break;
      case 'lastYear':
        handleLastYearClick();
        break;
      default:

        handleCurrentWeekClick();

        break;
    }
  }, [activeFunction]);

  const labelsTwo = UserCount.map((item) => item.date.split('T')[0]);
  const UserCountData = UserCount.map((item) => item.count);

  const UserCountDataset = {
    label: '',
    data: UserCountData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };

  const dataUser = {
    labels: labelsTwo,
    datasets: [UserCountDataset],
  };


  const labels = VenuesData.map((item) => item.date.split('T')[0]);
  // const labels = VenuesData.map((item) => item.date);

  const clickCountData = VenuesData.map((item) => item.click_count);
  const displayCountData = VenuesData.map((item) => item.display_count);
  const expensesData = VenuesData.map((item) => item.expenses);
  const revenueData = VenuesData.map((item) => item.revenue);

  const ctrData = VenuesData.map((item) => item.ctr * 100 );

  const cpcData = VenuesData.map((item) => item.cpc);
  const cpmData = VenuesData.map((item) => item.cpm);

  const clickCountDataset = {
    label: '',
    data: clickCountData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };
  
  const displayCountDataset = {
    label: '',
    data: displayCountData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };
  
  const expensesDataset = {
    label: '',
    data: expensesData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };
  
  const revenueDataset = {
    label: '',
    data: revenueData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };

  const ctrDataset = {
    label: '%',
    data: ctrData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };

  const cpcDataset = {
    label: '',
    data: cpcData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };

  const cpmDataset = {
    label: '',
    data: cpmData,
    borderColor: '#6792FF',
    backgroundColor: '#6792FF',
  };


  const data = {
    labels: labels,
    datasets: [clickCountDataset],
  };

  const displayCount_data = {
    labels: labels,
    datasets: [displayCountDataset],
  };  

  const expenses_Data = {
    labels: labels,
    datasets: [expensesDataset],
  }; 

  const revenue_Data = {
    labels: labels,
    datasets: [revenueDataset],
  }; 

  const ctr_Data = {
    labels: labels,
    datasets: [ctrDataset],
  }; 

  const cpc_Data = {
    labels: labels,
    datasets: [cpcDataset],
  }; 

  const cpm_Data = {
    labels: labels,
    datasets: [cpmDataset],
  }; 

    const optionsThree = [

        { value: 'option1', label: 'Опция 1' },
        { value: 'option2', label: 'Опция 2' },
        { value: 'option3', label: 'Опция 3' },

    ];

      const customStyles = {

        control: (provided) => ({
          ...provided,
          border: '1px solid var(--interface-seventh, #EBEDF5)',
          borderRadius: '8px',
          Color: '#1B1C1F',
        }),

        option: (provided, state) => ({

          ...provided,
          backgroundColor: state.isSelected ? '#007bff' : 'white',
          color: state.isSelected ? 'white' : 'black',
        }),

      };

      const [selectedOption, setSelectedOption] = useState(null); // Изначально выбранной опции нет

      const handleSelectChange = (selectedOption) => {

        setSelectedOption(selectedOption);

      };


      const DataStyle = {
        color: 'black',
        marginBottom: '0',
        height: '38px' ,
        border: '1px solid var(--interface-seventh, #EBEDF5)',
      };


      const optionsTwo = [

        { value: 'option1', label: 'Опция 1' },
        { value: 'option2', label: 'Опция 2' },
        { value: 'option3', label: 'Опция 3' },

    ];

    const customStylesTwo = {

      control: (provided) => ({
        ...provided,
        border: '1px solid var(--interface-seventh, #EBEDF5)',
        borderRadius: '8px',
        Color: '#1B1C1F',
        zIndex: 0,
        
      }),

      option: (provided, state) => ({

        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : 'white',
        color: state.isSelected ? 'white' : 'black',
      }),

    };

    const [selectedOptionTwo, setSelectedOptionTwo] = useState(null); 

    const handleSelectChangeTwo = (selectedOptionTwo) => {

      setSelectedOptionTwo(selectedOptionTwo);

    };

    const [showContent, setShowContent] = useState(false);

    const MouseHandle = () => {
      setShowContent(!showContent)
    }

    // функция открывания chekboxTable

    const [chekboxTable, setchekboxTable] = useState(false)

    const chekboxTableHandle = () => {
      setchekboxTable(!chekboxTable)
    }

    const navigate = useNavigate()

    const navigatePush = () => {

      navigate('/InternalPage')

      localStorage.setItem('staticData', );

    }

    const handleCampaignTitleClick = (item) => {

      localStorage.setItem('selectedCampaign', JSON.stringify(item));
  
      navigate(`/campaign-details/${item.campaign_id}`);

    };

    const handleCampaignTitleClickSyte = (item) => {

      localStorage.setItem('selectedSyte', JSON.stringify(item));
  
      navigate(`/syte-details/${item.site_id}`);

    };

    useEffect(() => {

      fetchData();

  }, [startDate, endDate]);

  const downloadXLSX = async () => {

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');
  
      // Добавляем заголовки столбцов
      worksheet.addRow([
        'Название',
        'Соц-сеть',
        'Ссылка',
        'Количество кликов',
        'Стоимость клика',
        'CPM',
        'CTR',
        'Количество показов баннеров',
        'Расходы рекламодателя',
        'Заработок площадки',
      ]);
  
      // Добавляем данные из AdvertisingDataType
      AdvertisingDataType.forEach(item => {
        worksheet.addRow([
          item.campaign_title,
          item.site ? item.site.name : '',
          item.site && item.site.URL ? item.site.URL : '',
          item.click_count,
          item.cpc,
          item.cpm,
          `${(item.ctr * 100).toFixed(2)}%`,
          item.display_count,
          item.expenses,
          item.revenue,
        ]);
      });
  
      const blob = await workbook.xlsx.writeBuffer();
      const blobObject = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const blobUrl = URL.createObjectURL(blobObject);
  
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'my_advertising_data.xlsx';
      a.click();

    } catch (error) {
      console.error('Ошибка при скачивании XLSX:', error);
    }
  };

  const downloadXLSXTwo = async () => {

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');
  
      // Добавляем заголовки столбцов
      worksheet.addRow([
        'Название',
        'Соц-сеть',
        'Ссылка',
        'Количество кликов',
        'Стоимость клика',
        'CPM',
        'CTR',
        'Количество показов баннеров',
        'Расходы рекламодателя',
        'Заработок площадки',
      ]);
  
      // Добавляем данные из AdvertisingDataType
      AdvertisingDataType.forEach(item => {
        worksheet.addRow([
          item.campaign_title,
          item.site ? item.site.name : '',
          item.site && item.site.URL ? item.site.URL : '',
          item.click_count,
          item.cpc,
          item.cpm,
          `${(item.ctr * 100).toFixed(2)}%`,
          item.display_count,
          item.expenses,
          item.revenue,
        ]);
      });
  
      const blob = await workbook.xlsx.writeBuffer();
      const blobObject = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const blobUrl = URL.createObjectURL(blobObject);
  
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'my_advertising_data.xlsx';
      a.click();

    } catch (error) {
      console.error('Ошибка при скачивании XLSX:', error);
    }
  };

  const downloadExcel = () => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Статистика');
  
    // Добавьте заголовки
    const headers = [
      'Дата',
      'Количество кликов',
      'Количество показов баннеров',
      'Расходы рекламодателя (оборот системы)',
      'Заработок площадки',
      'CTR',
      'Стоимость клика',
      'CPM',
    ];

    worksheet.addRow(headers);
  
    
    VenuesData.forEach((item) => {
      worksheet.addRow([
        item.date.split('T')[0],
        item.click_count,
        item.display_count,
        item.expenses,
        item.revenue,
        item.ctr * 100, 
        item.cpc,
        item.cpm,
      ]);
    });
  
    // Добавьте строку с итоговыми данными
    worksheet.addRow(['Итого', totalClickCount, totalDisplayCount, totalExpenses, totalRevenue, totalCtr, totalCpc, totalCpm]);
  
    // Создайте blob из workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Создайте Blob и ссылку для скачивания
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
  
      // Создайте ссылку для скачивания
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statistics.xlsx';
      document.body.appendChild(a);
      a.click();
  
      // Очистите созданные элементы
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };


  const translations = {
    campaign_title: 'Название',
    site_name: 'Соц-сеть',
    site_URL: 'Ссылка',
    click_count: 'Количество кликов',
    cpc: 'Стоимость клика',
    cpm: 'CPM',
    ctr: 'CTR',
    display_count: 'Количество показов баннеров',
    expenses: 'Расходы рекламодателя',
    revenue: 'Заработок площадки'
  };

  const [selectedFields, setSelectedFields] = useState({
    campaign_title: true,
    site_name: true,
    site_URL: true,
    click_count: true,
    cpc: true,
    cpm: true,
    ctr: true,
    display_count: true,
    expenses: true,
    revenue: true
  });


  const handleCheckboxChange = (field) => {
    setSelectedFields({
      ...selectedFields,
      [field]: !selectedFields[field]
    });
  };

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const [selectedFieldsTwo, setSelectedFieldsTwo] = useState({
    campaign_title: true,
    site_name: true,
    site_URL: true,
    click_count: true,
    cpc: true,
    cpm: true,
    ctr: true,
    display_count: true,
    expenses: true,
    revenue: true
  });

  const handleCheckboxChangeTwo = (field) => {
    setSelectedFieldsTwo({
      ...selectedFieldsTwo,
      [field]: !selectedFieldsTwo[field]
    });
  };
  
  const [showFiltersTwo, setShowFiltersTwo] = useState(false);

  const toggleFiltersTwo = () => {
    setShowFiltersTwo(!showFiltersTwo);
  };


    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

              <div className={s.static__title}>

               <p className={s.static__title__p}>
               Моя статистика
               </p>
                

              </div>
                
                <div className={s.static__header} >
                    
                    <div className={s.static__header__one}>
                       
                        <button className={activeFunction === 'currentWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]} onClick={handleCurrentWeekClick}>Неделя</button>

                        <button onClick={handlePreviousWeekClick} className={activeFunction === 'previousWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Прошлая неделя</button>

                        <button onClick={handleLast7DaysClick} className={activeFunction === 'last7Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Последние 7 дней</button>

                        <button onClick={handleLast30DaysClick} className={activeFunction === 'last30Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Месяц</button>

                        <button onClick={handleLast3MonthsClick} className={activeFunction === 'last3Months' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Квартал</button>

                        <button onClick={handleLastYearClick} className={activeFunction === 'lastYear' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Год</button>

                    </div>

                <DatePicker onChange={handleDateChangeStart} style={DataStyle} placeholder='Oт'/>

                <DatePicker onChange={handleDateChangeEnd} style={DataStyle} placeholder='До'/>


                </div>

            </div>

        </section>

        <div className='section__staticTwo'>
          
          <div className="container">

            <p className='title'>Статистики по дате</p>

            <div className={s.MarginTop}></div>

             <DownloadExcelJSX downloadExcel={downloadExcel}/>

            {/* <div className={s.MarginTopTwo}></div> */}

            <div className='static__flex'>

            <div className='staticTwo__footer'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>Общее количество кликов: {totalClickCount}</p>

              </div>

              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={data}  style={{ zIndex: -1 }} />


            </div>

            <div className='staticTwo__footer'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>Общее количество показов баннеров: {totalDisplayCount}</p>

              </div>


              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={displayCount_data}  style={{ zIndex: -1 }} />

            </div>

            </div>

            <div className='static__flex'>

            <div className='staticTwo__footer'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>Общие расходы рекламодателя: {totalExpenses}</p>

              </div>


              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={expenses_Data}  style={{ zIndex: -1 }} />

            </div>

            <div className='staticTwo__footer'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>Общий заработок площадки: {totalRevenue.toFixed(2)} </p>

              </div>

              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={revenue_Data}  style={{ zIndex: -1 }} />

            </div>

            </div> 

            <div className='static__flex'>

            <div className='staticTwo__footerTwo'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>CPM: {totalCpm}</p>

              </div>

              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={cpm_Data}  style={{ zIndex: -1 }} />

            </div>

            <div className='staticTwo__footerTwo'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>CTR: {totalCtr}</p>

              </div>


              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={ctr_Data}  style={{ zIndex: -1 }} />

            </div>

            <div className='staticTwo__footerTwo'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>CPC: {totalCpc}</p>

              </div>


              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={cpc_Data}  style={{ zIndex: -1 }} />

            </div>
              
            </div>   

          <div className='static__flex'>

            <div className='staticTwo__footerTwo'>

              <div className='static__header__info'>

                <p className='static__header__info__title'>Регистрации QROOTO</p>

              </div>

              <div className='staticTwo__header__setting'>
                
                <img src={setting} alt="" />

                <img src={setbar} alt="" />

              </div>

              <Line data={dataUser}  style={{ zIndex: -1 , margin: 0 }} />

            </div>
              
            </div>          
       
      <div>


      </div>

      <p className='title'>Статистика по кампаниям</p>

      <div className={s.statis_flex}>

      <Save count_documents={count_documents} downloadXLSX={downloadXLSX} />

      <div className={s.statis__btn} onClick={toggleFilters}>
        Фильтр <FiSettings />
      </div>

      {showFilters && (

      <div className={`${s.static_fitr} ${showFilters ? 'static_fitr_active' : ''}`} >

      {Object.entries(selectedFields).map(([field, isSelected]) => (

          <div key={field} className={s.static_fitr_flex}>

            <input
              type="checkbox"
              id={field}
              checked={isSelected}
              onChange={() => handleCheckboxChange(field)}
            />

            <label className={s.static_fitr_flex_text} htmlFor={field}>{translations[field]}</label>
            
          </div>

        ))}

      </div>

      )}

      </div>



      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

         <tr>
           {Object.entries(selectedFields).map(([field, isSelected]) => (
              isSelected && <th className={s.static__table__thead__titleTwo}>{translations[field]}</th>
            ))}
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
          

        {AdvertisingDataType.map((item) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.campaign_id}>

              {Object.entries(selectedFields).map(([field, isSelected]) => (

                isSelected && (

                  <td className={s.static__table__tbody__subtitle} key={field}>

                    {field === 'campaign_title' && (
                      <div onClick={() => handleCampaignTitleClick(item)}>
                        {item.campaign_title}
                      </div>
                    )}

                    {field === 'site_name' && item.site && item.site.name}

                    {field === 'site_URL' && (
                      <Link to={item.site && item.site.URL} target='_blank'>
                        {item.site && item.site.URL}
                      </Link>
                    )}

                    {field === 'click_count' && item.click_count}

                    {field === 'cpc' && item.cpc}

                    {field === 'cpm' && item.cpm}

                    {field === 'ctr' && (item.ctr * 100).toFixed(2) + '%'}
                    
                    {field === 'display_count' && item.display_count}

                    {field === 'expenses' && item.expenses}

                    {field === 'revenue' && item.revenue.toFixed(2)}

                  </td>

                )
              ))}

            </tr>

          ))}

        </tbody>


      </table>

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

      <p className='title'>Статистика по сайтам</p>


    <div className={s.statis_flex}>

      <SaveTwo count_documentsTwo={count_documentsTwo} downloadXLSXTwo={downloadXLSXTwo} />

      <div className={s.statis__btn} onClick={toggleFiltersTwo}>
        Фильтр <FiSettings />
      </div>

      {showFiltersTwo && (

      <div className={`${s.static_fitr} ${showFiltersTwo ? 'static_fitr_active' : ''}`} >

      {Object.entries(selectedFieldsTwo).map(([field, isSelected]) => (

          <div key={field} className={s.static_fitr_flex}>

            <input
              type="checkbox"
              id={field}
              checked={isSelected}
              onChange={() => handleCheckboxChangeTwo(field)}
            />

            <label className={s.static_fitr_flex_text} htmlFor={field}>{translations[field]}</label>
            
          </div>

        ))}

      </div>

      )}

      </div>

      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

        <tr>
           {Object.entries(selectedFieldsTwo).map(([field, isSelected]) => (
              isSelected && <th className={s.static__table__thead__titleTwo}>{translations[field]}</th>
            ))}
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

        {SiteData.map((item) => (
            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.site_id}>
              {selectedFieldsTwo.campaign_title && (
                <td className={s.static__table__tbody__subtitle} onClick={() => handleCampaignTitleClickSyte(item)}>{item.site && item.site.name}</td>
              )}
              {selectedFieldsTwo.site_URL && (
                <td className={s.static__table__tbody__subtitle}>
                  <Link to={item.site && item.site.URL} target='_blank'>
                    {item.site && item.site.URL}
                  </Link>
                </td>
              )}
              {selectedFieldsTwo.click_count && <td className={s.static__table__tbody__subtitle}>{item.click_count}</td>}
              {selectedFieldsTwo.cpc && <td className={s.static__table__tbody__subtitle}>{item.cpc}</td>}
              {selectedFieldsTwo.cpm && <td className={s.static__table__tbody__subtitle}>{item.cpm}</td>}
              {selectedFieldsTwo.ctr && <td className={s.static__table__tbody__subtitle}>{(item.ctr * 100).toFixed(2)}%</td>}
              {selectedFieldsTwo.display_count && <td className={s.static__table__tbody__subtitle}>{item.display_count}</td>}
              {selectedFieldsTwo.expenses && <td className={s.static__table__tbody__subtitle}>{item.expenses}</td>}
              {selectedFieldsTwo.revenue && <td className={s.static__table__tbody__subtitle}>{item.revenue.toFixed(2)}</td>}
            </tr>
          ))}

        </tbody>


      </table>      

      <PaginationTwo  pageTwo={pageTwo}  handlePageChange={handlePageChange} count_documents={count_documents}/>

          </div>

        </div>

        
        </>


    )
    
}