
import i from '../statistics/InternalPage/InternalPage.module.scss'
import s from '../statistics/Statistics.module.scss'
import navig from './InternalPage/Group.svg'
import {useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import setting from '../statistics/img/setting.svg'
import setbar from '../statistics/img/setbar.svg'
import { Line } from 'react-chartjs-2';
import ExcelJS from 'exceljs';
import { DatePicker } from 'antd';
import t from '../../components/MyTabs.module.scss'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';

import axios from 'axios'
import { useAuth } from '../../AuthContext'
import DownloadExcelJSX from '../../components/downloadExcel'
import TabSpaces from '../../components/TabSpaces'
import TabCopm from '../../components/TabCopm'
import TabPlace from '../../components/TabPlace'
import PlacementCard from '../../Placement/PlacementCard'
import { FaCopy } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);


export default function InternalPageVenuesTwo ({ handlePageChange , count_documents ,setcount_documents}) {
    
    const navigate = useNavigate()

    const navigatePush = () => {

      navigate(-1)

    }

    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('InternalPageVenues');
        
        if (data) {
          setStoredCampIdData(JSON.parse(data));
        }
        
      }, []);

      

      const infoVenues = storedCampIdData

      const infoСomp = infoVenues && infoVenues.campaign

      const infoPlatform = infoVenues && infoVenues.platform

      console.log(infoVenues);


    const apiUrl = process.env.REACT_APP_API_URL;
  
    const [AdvertisingData, setAdvertisingData] = useState([])

    const [activeFunction, setActiveFunction] = useState('previousWeek');
  
    const [currentWeek, setCurrentWeek] = useState(true);
  
    const [startDate, setStartDate] = useState(''); 
  
    const [endDate, setEndDate] = useState('');
  
    const [totalClickCount, settotalClickCount] = useState(0)
    const [totalDisplayCount, setTotalDisplayCount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCtr, setTotalCtr] = useState(0);
    const [totalCpc, setTotalCpc] = useState(0);
    const [totalCpm, setTotalCpm] = useState(0);
    
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
  

    const url = window.location.href;

    const campaignIdFromURL = url.substring(url.lastIndexOf('/') + 1);
    
    const loginEndpointTwo = `/api/statistic/by_site?site_id=${campaignIdFromURL}`;
  
    const fetchDataKomp = async (start, end) => {
  
      if (!startDate || !endDate) {
        return;
      }
  
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
  
      settotalClickCount(calculateTotalClickCount(response.data.objects))
      setTotalDisplayCount(calculateTotalDisplayCount(response.data.objects));
      setTotalExpenses(calculateTotalExpenses(response.data.objects));
      setTotalRevenue(calculateTotalRevenue(response.data.objects));
      setTotalCtr(calculateTotalCtr(response.data.objects));
      setTotalCpc(calculateTotalCpc(response.data.objects));
      setTotalCpm(calculateTotalCpm(response.data.objects));
    
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        }
  
      }
  
      
      const loginEndpointThree = `/api/statistic/by_site?site_id=${campaignIdFromURL}`;
    
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
  
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        }
      }
  
    };
  
    const [SiteData, setSiteData] = useState([])
  
  
    const AdvertisingDataType = AdvertisingData
  
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
    
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
    
      setStartDate(startDateString);
      setEndDate(endDateString);
    
      fetchDataKomp(startDateString, endDateString);
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
    
      fetchDataKomp();
  
    };
  
    const handleLast7DaysClick = () => {
  
      setCurrentWeek(true);
  
      setActiveFunction('last7Days');
    
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      const startDate = new Date(currentDate);
    
      startDate.setDate(currentDate.getDate() - 7);
    
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
    
      setStartDate(startDateString);
      setEndDate(endDateString);
    
      fetchDataKomp();
  
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
    
      fetchDataKomp();
  
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
    
      fetchDataKomp();
  
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
    
      fetchDataKomp();
  
    };
  
    const [selectedDate, setSelectedDate] = useState(null);
  
    const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  
  
    const handleDateChangeStart = (date, dateString) => {
      setSelectedDate(date);
      fetchDataKomp(date, selectedDate);
    };
  
    const handleDateChangeEnd = (date, dateString) => {
      setSelectedDateEnd(date);
      fetchDataKomp(selectedDateEnd, date);
    };
  
  
    const labels = AdvertisingDataType
    ? AdvertisingDataType.map((item) => (item.date ? item.date.split('T')[0] : ''))
    : [];
  
  
  const clickCountData = AdvertisingDataType.map((item) => item.click_count);
  const displayCountData = AdvertisingDataType.map((item) => item.display_count);
  const expensesData = AdvertisingDataType.map((item) => item.expenses);
  const revenueData = AdvertisingDataType.map((item) => item.revenue);
  
  const ctrData = AdvertisingDataType.map((item) => item.ctr * 100 );
  
  const cpcData = AdvertisingDataType.map((item) => item.cpc);
  const cpmData = AdvertisingDataType.map((item) => item.cpm);
  
  
  
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
    
      
      AdvertisingDataType.forEach((item) => {
        worksheet.addRow([
          item.date && item.date.split('T')[0],

          item.click_count,
          item.display_count,
          item.expenses,
          item.revenue,
          item.ctr * 100, 
          item.cpc,
          item.cpm,
        ]);
      });
    
      
      worksheet.addRow(['Итого', totalClickCount, totalDisplayCount, totalExpenses, totalRevenue, totalCtr, totalCpc, totalCpm]);
    
      
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
    
    const [AAccountId, setAAccountId] = useState();

    const [pageSpaces, setPageSpaces] = useState(1);
    
    const [SpacesData, setSpacesData] = useState([])

    const spacesFetch = async (accountId) => {

      const loginEndpointTwo = `/api/management/site/${accountId}/ads_spaces?limit=25&page=${pageSpaces}`;

      const url = `${apiUrl}${loginEndpointTwo}`;
  
      try {

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        setSpacesData(response.data.objects);

        setcount_documents(response.data.count_documents);

        setAAccountId(accountId)        

      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      }
    };
  
    useEffect(() => {

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
        spacesFetch(infoVenues._id.$oid);
      }  

    }, [pageSpaces, refreshToken, storedCampIdData]);

    const [pageCopm, setPageCopm] = useState(1);
    
    const [CopmData, setCopmData] = useState([])

    const CopmFetch = async (accountId) => {

      const loginEndpointTwo = `/api/management/site/${accountId}/campaigns?limit=25&page=${pageCopm}`;
  
      const url = `${apiUrl}${loginEndpointTwo}`;
  
      try {

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        setCopmData(response.data.objects);

        setcount_documents(response.data.count_documents);

        setAAccountId(accountId)        

      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      }
    };
  
    useEffect(() => {

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
        CopmFetch(infoVenues._id.$oid);
      }  

    }, [pageCopm, refreshToken, storedCampIdData]);

    const [pagePlace, setPagePlace] = useState(1);
    
    const [PlaceData, setPlaceData] = useState([])

    const PlaceFetch = async (accountId) => {

      const loginEndpointTwo = `/api/management/site/${accountId}/placements?limit=25&page=${pagePlace}`;
  
      const url = `${apiUrl}${loginEndpointTwo}`;
  
      try {

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        setPlaceData(response.data.objects);

        setcount_documents(response.data.count_documents);

        setAAccountId(accountId)        

      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      }
    };
  
    useEffect(() => {

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
        PlaceFetch(infoVenues._id.$oid);
      }  

    }, [pagePlace, refreshToken, storedCampIdData]);

    const [pageOffe, setPageOffe] = useState(1);
    
    const [OffeData, setOffeData] = useState([])
   
    const OffeFetch = async (accountId) => {

      const loginEndpointTwo = `/api/management/site/${accountId}/offers?limit=25&page=${pageOffe}`;
  
      const url = `${apiUrl}${loginEndpointTwo}`;
  
      try {

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        setOffeData(response.data.objects);

        setcount_documents(response.data.count_documents);

        setAAccountId(accountId)        

      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      }
    };
  
    useEffect(() => {

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
        OffeFetch(infoVenues._id.$oid);
      }  

    }, [pageOffe, refreshToken, storedCampIdData]);

    console.log(OffeData);
  
    useEffect(() => {
  
      fetchDataKomp();
  
  }, [startDate, endDate]);


  const textRef = React.useRef(null);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = storedCampIdData._id.$oid;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000); 

  };

    return (
        
        <>
        
        <section className={i.section__internal}>
            
            <div className="container">
                
               <div className={i.interTwo}>
                
                <div className={i.inter__box} onClick={navigatePush}>
                    <img src={navig} alt="svg" />
                </div>

                <div className={i.inter__infoTwo}>

                    <p className={i.inter__info__title}>
                        {infoVenues && infoVenues.name}
                    </p>

                    <Link to={infoVenues && infoVenues.URL} className={i.inter__info__subtitle}>
                        {infoVenues && infoVenues.URL}
                    </Link>

                </div>


               </div>

               <div className={s.MarginTop}></div>

<Tabs>

  <TabList style={{ listStyle: 'none', padding: 0, marginTop: '10px', border: 'none', display: 'flex' }} className={t.tabs}>

    <Tab className={t.tabs__item}>
      Аудитория
    </Tab>

    <Tab className={t.tabs__item}>
    Онбординг рекламодатели
    </Tab>

  <Tab className={t.tabs__item} 
      
  id={infoVenues && infoVenues._id && infoVenues._id.$oid}

  onClick={() => {

    setPageSpaces(1);

    if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
    spacesFetch(infoVenues._id.$oid);
    }
    
  }}

    >
    Рекламные места
    </Tab>

    <Tab className={t.tabs__item}
    
    id={infoVenues && infoVenues._id && infoVenues._id.$oid}

    onClick={() => {
  
      setPageCopm(1);

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
      CopmFetch(infoVenues._id.$oid);

      }
      
    }}

    >
    Рекламные кампании
    </Tab>

    <Tab className={t.tabs__item}
    
    id={infoVenues && infoVenues._id && infoVenues._id.$oid}

    onClick={() => {
  
      setPagePlace(1);

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
      PlaceFetch(infoVenues._id.$oid);

      }
      
    }}

    >
     Размещения
    </Tab>

    <Tab className={t.tabs__item}
    
    id={infoVenues && infoVenues._id && infoVenues._id.$oid}

    onClick={() => {
  
      setPageOffe(1);

      if (infoVenues && infoVenues._id && infoVenues._id.$oid) {
      OffeFetch(infoVenues._id.$oid);

      }
      
    }}

    >
    Заявки
    </Tab>    

  </TabList>

  <TabPanel className={s.TabPanelTwo}>

      <div className={i.inter__info__flex__item}>

      <div className={i.inter__info__flex__item__arr}>

<p className={i.inter__info__flex__item__arr__text}>
ID
</p>

<p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                {storedCampIdData._id && storedCampIdData._id}

</p>

<button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

</div>

<div className={i.inter__info__flex__item__arr}>

<p className={i.inter__info__flex__item__arr__text}>
  Имя
</p>

<p className={i.inter__info__flex__item__arr__title}>
      {infoVenues.user && infoVenues.user.name}
</p>

</div>

<div className={i.inter__info__flex__item__arr}>

<p className={i.inter__info__flex__item__arr__text}>
  Почта
</p>

<p className={i.inter__info__flex__item__arr__title}>
{infoVenues.user && (
<Link to={`mailto:${infoVenues.user.email}`} className={i.inter__info__flex__item__arr__title}>
{infoVenues.user.email}
</Link>
)}
</p>

</div>

<div className={i.inter__info__flex__item__arr}>

<p className={i.inter__info__flex__item__arr__text}>
  Номер телефона
</p>

<p className={i.inter__info__flex__item__arr__title}>
      {infoVenues.user && infoVenues.user.phone}
</p>

</div>

{infoVenues ?

<div>


                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Тип
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {infoPlatform && infoPlatform.type}
                                </p>

                            </div>

                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Сегмент
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                { infoPlatform && infoPlatform.segment}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                 минимальный cpm
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                { infoPlatform && infoPlatform.min_cpm}
                                </p>

                            </div>
 

                              <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Флаги
                                </p>
     

<div className={i.inter__info__flex__item__arr__border}>
  {infoPlatform && infoPlatform.flags && Array.isArray(infoPlatform.flags) && (
    infoPlatform.flags.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>


                            </div>                                                    
                                   <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Интересы
                                </p>
    

<div className={i.inter__info__flex__item__arr__border}>
  {infoPlatform && infoPlatform.interests && Array.isArray(infoPlatform.interests) && (
    infoPlatform.interests.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>
    

                            </div> 

</div>

                            

: ''}

      </div>

      {infoVenues ?
      
      <div className={i.inter__info__flex__item}>

                           
                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Интересные темы
                                </p>
    

<div className={i.inter__info__flex__item__arr__border}>
  {infoPlatform && infoPlatform.interested_themes && Array.isArray(infoPlatform.interested_themes) && (
    infoPlatform.interested_themes.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>
    

                            </div> 

                            </div>
      
      : ''}



  </TabPanel>

  <TabPanel className={s.TabPanel}>

    {infoСomp ?
    
  <div className={i.inter__info__flex__item}>
                            

                           <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Ссылка
                                </p>
                                
                                <Link to={infoVenues && infoVenues.URL} className={i.inter__info__flex__item__arr__title}>
                                {infoVenues && infoVenues.URL}
                                </Link>

                            </div>
                            
                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Сегмент
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                { infoСomp && infoСomp.segment.join(', ')}
                                </p>

                            </div>   

                              <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Флаги
                                </p>
     

<div className={i.inter__info__flex__item__arr__border}>
  {infoСomp && infoСomp.flags && Array.isArray(infoСomp.flags) && (
    infoСomp.flags.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>


                            </div>                                                    

                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Интересы
                                </p>
    

<div className={i.inter__info__flex__item__arr__border}>
  {infoСomp && infoСomp.interests && Array.isArray(infoСomp.interests) && (
    infoСomp.interests.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>
    

                            </div> 
                           
                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Темы
                                </p>
    

<div className={i.inter__info__flex__item__arr__border}>
      <p  className={i.inter__info__flex__item__arr__border__title}>
      {infoСomp && infoСomp.theme}
      </p>
</div>
    

                            </div> 


          {storedCampIdData.cross_promo_types && storedCampIdData.cross_promo_types.length > 0 && (
                              <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Типы перекрестных промо
                                </p>
    

<div className={i.inter__info__flex__item__arr__border}>
  {infoСomp && infoСomp.cross_promo_types && Array.isArray(infoСomp.cross_promo_types) && (
    infoСomp.cross_promo_types.map((item, index) => (
      <p key={index} className={i.inter__info__flex__item__arr__border__title}>
        {item}
      </p>
    ))
  )}
</div>
    

                            </div> 
                            
   )}

  </div>
    
    : ''}


  </TabPanel >

  <TabPanel className={s.TabPanel}>

      <TabSpaces 
      
      SpacesData={SpacesData} count_documents={count_documents} AAccountId={AAccountId} page={pageSpaces}
      handlePageChange={(newPage) => setPageSpaces(newPage)
      
      }
      
      /> 

  </TabPanel>

  <TabPanel className={s.TabPanel}>

    <TabCopm
      
      CopmData={CopmData} count_documents={count_documents} AAccountId={AAccountId} page={pageCopm}
      handlePageChange={(newPage) => setPageCopm(newPage)}

    />

  </TabPanel>

  <TabPanel className={s.TabPanel}>

  <TabPlace
      
      PlaceData={PlaceData} count_documents={count_documents} AAccountId={AAccountId} page={pagePlace}
      handlePageChange={(newPage) => setPagePlace(newPage)}

    />

  </TabPanel>

  <TabPanel className={s.TabPanel}>

  <div className={i.applec}>

          {OffeData.map((info, index) => {
                return <PlacementCard {...info} index={index} />
          })}

   </div>       

  </TabPanel>
  

</Tabs>



            <div className={s.static__header} >
                    
                    <div className={s.static__header__one}>
                       
                        <button className={activeFunction === 'currentWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]} onClick={handleCurrentWeekClick}>Неделя</button>

                        <button onClick={handlePreviousWeekClick} className={activeFunction === 'previousWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Прошлая неделя</button>

                        <button onClick={handleLast7DaysClick} className={activeFunction === 'last7Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Последние 7 дней</button>

                        <button onClick={handleLast30DaysClick} className={activeFunction === 'last30Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Месяц</button>

                        <button onClick={handleLast3MonthsClick} className={activeFunction === 'last3Months' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Квартал</button>

                        <button onClick={handleLastYearClick} className={activeFunction === 'lastYear' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Год</button>

                    </div>


                <DatePicker onChange={handleDateChangeStart}  placeholder='Oт'/>

                <DatePicker onChange={handleDateChangeEnd} placeholder='До'/>

                <DownloadExcelJSX downloadExcel={downloadExcel}/>

            </div>

  

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

    <p className='static__header__info__title'>Общий заработок площадки: {totalRevenue}</p>

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

            </div>

        </section>

        </>
        
    )
}