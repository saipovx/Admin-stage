

import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import s from './Statistics.module.scss'
import { DatePicker, Tooltip } from 'antd';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

import setting from './img/setting.svg'
import setbar from './img/setbar.svg'
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
  } from 'chart.js';
import { Link } from 'react-router-dom';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend
  );
  

 export default function SyteDetails () {

  const { refreshToken } = useAuth();

  const { campaign_Id } = useParams();

  const selectedCampaign = JSON.parse(localStorage.getItem('selectedSyte'));


  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

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

  const fetchDataKomp = async (start, end) => {

    if (!startDate || !endDate) {
      return;
    }

    const url = window.location.href;

    const campaignIdFromURL = url.substring(url.lastIndexOf('/') + 1);
  
    const loginEndpointTwo = `/api/statistic/by_date?site_id=${campaignIdFromURL}`;

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

    setAdvertisingData(response.data);

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
    
    const loginEndpoint = `/api/statistic/by_campaign?site_id=${campaignIdFromURL}`;
  
    const urlThree = `${apiUrl}${loginEndpoint}`;

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
  

  const [AdvertisingData, setAdvertisingData] = useState([])

  const [SiteData, setSiteData] = useState([])

  const AdvertisingDataType = AdvertisingData

  console.log(SiteData);


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



const labels = AdvertisingDataType.map((item) => item.date.split('T')[0]);

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

      handlePreviousWeekClick();

        break;
    }
  }, [activeFunction]);

  const handleCampaignTitleClick = (item) => {

    localStorage.setItem('selectedCampaign', JSON.stringify(item));

    navigate(`/campaign-details/${item.campaign_id}`);

  };

  useEffect(() => {

    fetchDataKomp();

}, [startDate, endDate]);

    const navigate = useNavigate()

    const navigatePush = () => {

      navigate(-1)

    }

  return (

        <section className={s.section__static} >
            
            <div className="container">

                

            <p className={s.static__title__p}>

            <button className={s.static__title__btn} onClick={navigatePush}>Назад</button>  {selectedCampaign.site.name} 

            </p>

           

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

      <p className='title'>Статистика по кампании</p>

      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>
            <th className={s.static__table__thead__titleTwo}>Название</th>
            <th className={s.static__table__thead__titleTwo}>Соц-сеть</th>
            <th className={s.static__table__thead__titleTwo}>Ссылка</th>
            <th className={s.static__table__thead__titleTwo}>Kоличество кликов</th>
            <th className={s.static__table__thead__title}>Стоимость клика</th>
            <th className={s.static__table__thead__title}>CPM</th> 
            <th className={s.static__table__thead__title}>CTR</th> 

            <th className={s.static__table__thead__title}>Количество показов баннеров</th> 
            <th className={s.static__table__thead__title}>Расходы рекламодателя</th> 
            <th className={s.static__table__thead__title}>Заработок площадки</th> 

          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
          

          {SiteData.map((item) => (

            

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.campaign_id}>

              
              <td className={s.static__table__tbody__subtitle} onClick={() => handleCampaignTitleClick(item)} >{item.campaign_title}</td>

              <td className={s.static__table__tbody__subtitle}>{ item.site && item.site.name}</td>

              <td className={s.static__table__tbody__subtitle}>

                <Link to={ item.site && item.site.URL} target='_blank'>
                {item.site && item.site.URL}
                </Link>
                
              </td>

              <td className={s.static__table__tbody__subtitle}>{item.click_count}</td>

              <td className={s.static__table__tbody__subtitle}>{item.cpc}</td>

              <td className={s.static__table__tbody__subtitle}>{item.cpm}</td>

              <td className={s.static__table__tbody__subtitle}>{(item.ctr * 100).toFixed(2)}%</td>

              <td className={s.static__table__tbody__subtitle}>{item.display_count}</td>

              <td className={s.static__table__tbody__subtitle}>{item.expenses}</td>

              <td className={s.static__table__tbody__subtitle}>{item.revenue}</td>



            </tr>

          ))}

        </tbody>


      </table>    

            </div>    

        </section>        

  );
};
