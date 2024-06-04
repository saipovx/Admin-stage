
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import s from '../statistics/Statistics.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import Pagination from '../../components/Pagination';
import p from '../../components/Poisk.module.scss'
import { Select } from 'antd'
import m from './Advertising/MyAdvertisingComp.module.scss';

import ExcelJS from 'exceljs';
import Save from '../../components/save';
import { FiSettings } from 'react-icons/fi';

export default function VenuesMe ({ handlePageChange, setcount_documents, page , count_documents }) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [VenuesData, setVenuesData] = useState([])

  const { refreshToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const [status, setStatus] = useState(''); 

  const [startDate, setStartDate] = useState(''); 
  
  const [endDate, setEndDate] = useState('');

  const [selectedOptionTwo, setSelectedOptionTwo] = useState('');

  const [activeFunction, setActiveFunction] = useState('currentWeek');

  const [currentWeek, setCurrentWeek] = useState(true);
  
  const handleSelectChangeTwo = (selectedOptionTwo) => {

    setSelectedOptionTwo(selectedOptionTwo);

  };

  const [selectedOptionThree, setSelectedOptionThree] = useState('');
  
  const handleSelectChangeThree = (selectedOptionThree) => {

    setSelectedOptionThree(selectedOptionThree);

  };

      const customStylesTwo = {
      
      control: (provided) => ({
        ...provided,
        border: '1px solid var(--interface-seventh, #EBEDF5)',
        borderRadius: '8px',
        color: '#1B1C1F',
        zIndex: 0,
        width: '100% !important',
      }),
    
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : 'white',
        color: state.isSelected ? 'white' : 'black',
        maxWidth: '100% !important',
      }),
    };

    const optionsTwo = [
      { value: '', label: 'Все' },
      { value: 'draft', label: 'Черновик' },
      { value: 'moderation', label: 'На модерации' },
      { value: 'review', label: 'На рассмотрении' },
      { value: 'verified', label: 'Подтверждено' },
      { value: 'rejected', label: 'Отклонено' },
      { value: 'blocked', label: 'Заблокировано' },
    ];

    const optionsThree = [
      { value: '', label: 'Все' },
      { value: 'active', label: 'Активный' },
      { value: 'paused', label: 'Приостановлен' },
      { value: 'archive', label: 'Архивирован' },
    ];
    
    
  const Sboss = () => {
    setSelectedOptionTwo('')
    setSelectedOptionThree('')
  } 

  const DataStyle = {
    color: 'black',
    marginBottom: '0',
    height: '38px' ,
    border: '1px solid var(--interface-seventh, #EBEDF5)',
  };

  const loadData = () => {

    const loginEndpoint = `/api/moderation/sites/manager?limit=25&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${selectedOptionTwo ? `&is_moderated=${selectedOptionTwo}` : ''}${status ? `&status=${status}` : ''}&type_platform=area`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {

        setVenuesData(res.data.objects)
        setcount_documents(res.data.count_documents);

      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };


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
  
    loadData();
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
  
    loadData();

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
  
    loadData();

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
  
    loadData();

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
  
    loadData();

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
  
    loadData();

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

  useEffect(() => {

    loadData();

  }, [page, refreshToken,searchQuery,selectedOptionTwo,selectedOptionThree,status]);


  const VenuesDataType = VenuesData
  
  const navigate = useNavigate()

  const navigatePush = (camp_id) => {

      const loginEndpointTwo = `/api/moderation/sites/`;
    
      const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
  
          axios.get(url, {
  
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }
  
          })
          
          .then(res => {

          localStorage.setItem('InternalPageVenues', JSON.stringify(res.data));
  
          navigate(`/InternalPageVenuesAll/${camp_id}`)
  
          })
  
          .catch(error => {
  
            if (error.response && error.response.status === 401) {
  
              refreshToken();
  
            } else {
              
            }
              
          });
  
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [infoStatic, setinfoStatic ] = useState([])

  const loginEndpointTwo = `/api/statistic/by_site`;

  const fetchWeeklyStatistics = async () => {

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); 
    
    const startDateString = startOfMonth.toISOString().split('T')[0];
    const endDateString = endOfMonth.toISOString().split('T')[0];
    
    
  
    setStartDate(startDateString);
    setEndDate(endDateString);
  
    if (token && startDateString && endDateString) {

      try {
        const urlTwo = `${apiUrl}${loginEndpointTwo}`;

        const response = await axios.get(urlTwo, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params: {
            start_date: startDateString,
            end_date: endDateString,
          },
        });

        setinfoStatic(response.data.objects);
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        }
      }
    }
  };
  
  useEffect(() => {
    fetchWeeklyStatistics();
  }, []);


  const [Dubl , setDubl] = useState([])

  const loginEndpoint = `/api/moderation/sites/manager?limit=${count_documents}`;

  const url = `${apiUrl}${loginEndpoint}`

  useEffect(() => {;

    axios
    
      .get(url, {

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      .then((res) => {
        
        setDubl(res.data.objects)

      })

      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });

  }, [refreshToken,count_documents]);

  const downloadXLSX = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');
  
      // Добавляем заголовки столбцов
      worksheet.addRow([
        'Заголовок',
        'Сайт',
        'Ссылка',
        'Стaтус',
        'Сегмент',
        'Затраты',
        'Показы',
        'Количество кликов',
        'CPC',
        'CPM',
        'CTR',
        'Доход',
      ]);
  
      // Добавляем данные из VenuesData
      Dubl.forEach(item => {
        const matchingData = Array.isArray(infoStatic)
          ? infoStatic.find(info => info.site_id === item._id.$oid)
          : null;
  
        worksheet.addRow([
          item.name,
          item.is_moderated, // Вставьте соответствующий статус
          item.URL,
          item.campaign ? item.campaign.segment.join(', ') : '',
          matchingData ? matchingData.expenses : '',
          matchingData ? matchingData.display_count : '',
          matchingData ? matchingData.click_count : '',
          matchingData ? matchingData.cpc : '',
          matchingData ? matchingData.cpm : '',
          matchingData ? (matchingData.ctr * 100).toFixed(2) : '',
          matchingData ? matchingData.revenue : '',
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

  const [logoData, setLogoData] = useState({});
  const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

  const LogoUrl = process.env.REACT_APP_API_URL_LOGO;

  
  const fetchData = async () => {
    
    const newLogoData = {};
  
    for (const item of VenuesData) {
      // Проверяем, определен ли item.logo
      if (!item.logo) {
        continue;
      }
  
      const document_type = '/logos';
      const document_id = `/${item.logo}`;
  
      const url = `${LogoUrl}${document_type}${document_id}`;
  
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
  
        newLogoData[item.logo] = imageUrl;
  

      } catch (error) {

        console.error(`Error loading image for ${item.name}:`, error);
  
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Обработка других ошибок
        }
      }
    }
  
    setLogoData(newLogoData);
    setIsLogoDataLoaded(true);
  };
  
  useEffect(() => {
    fetchData();
  }, [VenuesDataType, token]);

  console.log(VenuesDataType);

  const tableRef = useRef(null);

useEffect(() => {

  const handleScroll = () => {
    const table = tableRef.current;
    const thead = table.querySelector(`.${s.static__table__thead}`);
    const rect = table.getBoundingClientRect();
    const isTableAboveViewport = rect.top > 0;

    if (isTableAboveViewport) {
      thead.style.position = 'static';
    } else {
      thead.style.position = 'sticky';
      thead.style.top = '65px';
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
  
}, []);

const translations = {
  platform: 'Площадка',
  status: 'Стaтус',
  link: 'Ссылка',
  expenses: 'Затраты',
  impressions: 'Показы',
  click_count: 'Количество кликов',
  cpc: 'CPC',
  cpm: 'CPM',
  ctr: 'CTR',
  revenue: 'Доход',
  login: 'Вход в личный кабинет'
};

const [selectedFields, setSelectedFields] = useState({
  platform: true,
  status: true,
  link: true,
  expenses: true,
  impressions: true,
  click_count: true,
  cpc: true,
  cpm: true,
  ctr: true,
  revenue: true,
  login: true
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

const userId = localStorage.getItem('userId');

const EnterLKLogic = (user_id) => {
  const loginEndpoint = `/api/management/users/${user_id}/redirect`;
  const url = `${apiUrl}${loginEndpoint}`;
  window.open(url, '_blank');
};

const handleEnterLKClick = (user_id) => {
  EnterLKLogic(user_id);
};

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

              <div className={s.static__title}>

               <p className={s.static__title__p}>
               Площадки
               </p>

              </div>

              {/* <div className={s.static__header} >
                    
                    <div className={s.static__header__one}>
                             
                              <button className={activeFunction === 'currentWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]} onClick={handleCurrentWeekClick}>Неделя</button>
      
                              <button onClick={handlePreviousWeekClick} className={activeFunction === 'previousWeek' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Прошлая неделя</button>
      
                              <button onClick={handleLast7DaysClick} className={activeFunction === 'last7Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Последние 7 дней</button>
      
                              <button onClick={handleLast30DaysClick} className={activeFunction === 'last30Days' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Месяц</button>
      
                              <button onClick={handleLast3MonthsClick} className={activeFunction === 'last3Months' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Квартал</button>
      
                              <button onClick={handleLastYearClick} className={activeFunction === 'lastYear' ? [s.static__header__one__title , s.static__header__one__title__active].join(' ') : [s.static__header__one__title]}>Год</button>
      
                    </div>
      
              </div> */}

            <div className={p.app}>
              
              <p className={p.app__title}>
              Фильтровать по ключевым словам
              </p>

              <input type="text" className={p.app__input} placeholder='Поиск по названию, или описанию компании'  value={searchQuery} onChange={handleSearchChange}/>

            </div>

      <div className={s.static__center}>

  <p className={s.static__center__title}>
  Статус
  </p>

  <Select
    options={optionsTwo}
    isClearable={true} 
    value={selectedOptionTwo}
    onChange={handleSelectChangeTwo}
    className={s.static__center__select}
    allowClear
    styles={customStylesTwo}
    placeholder="Все"
    width='200px !important'
  />

  <button className={p.app__btn} onClick={Sboss}>
    Сбросить
  </button>

      </div>
                
            </div>

        </section>

        <div className='section__staticTwo'>
          
          <div className="container">

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

<div className={m.Mycomp__header}>
  
  <p
    className={[m.Mycomp__header__link, !status && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('')}
  >
    Все
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'active' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('active')}
  >
    Активные
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'paused' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('paused')}
  >
    Остановленные
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'archive' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('archive')}
  >
    Архив
  </p>

</div>

<hr className={m.Mycomp__header__hr} />


<table className={s.static__table}  ref={tableRef}>

<thead className={`${s.static__table__thead}`}>

          <tr>
          {Object.keys(selectedFields).map((field, index) => {
          if (selectedFields[field]) {
            return (
              <th key={index} className={s.static__table__thead__title}>
                {translations[field]}
              </th>
            );
          }
          return null;
        })}
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
  {VenuesDataType.map((item, key) => { 
    const matchingData = Array.isArray(infoStatic)
      ? infoStatic.find((info) => info.site_id === item._id.$oid)
      : null;

    return (
      <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id}>
        {Object.keys(selectedFields).map((field, index) => {
          if (selectedFields[field]) {
            return (
              <td key={index} className={s.static__table__tbody__subtitle}>
                {field === 'platform' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px', maxWidth: '200px' }} onClick={() => navigatePush(item._id)}>
                    {isLogoDataLoaded && logoData[item.logo] ? (
                      <img src={logoData[item.logo]} style={{ width: '60px' }} alt={''} />
                    ) : (
                      <p>Loading...</p>
                    )}
                    <span>{item.name}</span>
                  </div>
                )}
                {field === 'status' && (item.is_moderated)}
                {field === 'link' && (
                  <Link to={item && item.URL}>
                    {item && item.URL}
                  </Link> 
                )}
                {field === 'expenses' && (matchingData ? matchingData.expenses : '0')}
                {field === 'impressions' && (matchingData ? matchingData.display_count : '0')}
                {field === 'click_count' && (matchingData ? matchingData.click_count : '0')}
                {field === 'cpc' && (matchingData ? matchingData.cpc : '0')}
                {field === 'cpm' && (matchingData ? matchingData.cpm : '0')}
                {field === 'ctr' && (matchingData ? (matchingData.ctr * 100).toFixed(2) : '0')}
                {field === 'revenue' && (matchingData ? matchingData.revenue.toFixed(2) : '0')}

                {field === 'login' && (
                    <td key={`${item._id && item._id.$oid}-login`} >
                        <button className='copyBtn' onClick={() => handleEnterLKClick(item.owner_user_id)}>Перейти</button>
                    </td>
                )}

              </td>
            );
          }
          return null;
        })}
      </tr>
    );
  })}
</tbody>



      </table>

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

        </div>

    </div>

        
        </>


    )
    
}