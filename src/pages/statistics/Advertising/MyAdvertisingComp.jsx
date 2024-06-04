import { Link, useNavigate } from 'react-router-dom'
import m from './MyAdvertisingComp.module.scss'
import s from '../Statistics.module.scss'
import axios from 'axios';
import { useAuth } from '../../../AuthContext';
import { useEffect, useRef, useState } from 'react';
import Pagination from '../../../components/Pagination';
import p from '../../../components/Poisk.module.scss'
import { DatePicker, Select } from 'antd';
import ExcelJS from 'exceljs';
import Save from '../../../components/save';
import { FiSettings } from 'react-icons/fi';

export default function MyAdvertisingComp ({ handlePageChange, setcount_documents, page , count_documents }) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [AdvertisingData, setAdvertisingData] = useState([])

  const { refreshToken } = useAuth();

  const [status, setStatus] = useState('moderation'); 

  const [searchQuery, setSearchQuery] = useState('');

  const DataStyle = {
    color: 'black',
    marginBottom: '0',
    height: '38px' ,
    border: '1px solid var(--interface-seventh, #EBEDF5)',
  };

  const [selectedOptionTwo, setSelectedOptionTwo] = useState('');
  
  const handleSelectChangeTwo = (selectedOptionTwo) => {

    setSelectedOptionTwo(selectedOptionTwo);

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

  const Sboss = () => {
    setSelectedOptionTwo('')
  } 

  const [startDate, setStartDate] = useState(''); 
  
  const [endDate, setEndDate] = useState('');

  const [infoStatic, setinfoStatic ] = useState([])
    
    const loadData = () => {

      const loginEndpoint = `/api/moderation/campaigns/manager?limit=20&page=${page}${status ? `&status=${status}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        .then((res) => {

          setAdvertisingData(res.data.objects)
          setcount_documents(res.data.count_documents);

        })

        .catch((error) => {

          if (error.response && error.response.status === 401) {

            refreshToken();

          } else {
      
          }
        });
    };

    const navigate = useNavigate()

    const navigatePush = (camp_id) => {

        const loginEndpointTwo = `/api/moderation/campaigns/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
    
            axios.get(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {

              localStorage.setItem('campData', JSON.stringify(res.data));
    
              navigate(`/InternalPage/${camp_id}`)
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
    }

    const loginEndpointTwo = `/api/statistic/by_campaign`;

    const fetchWeeklyStatistics = async () => {

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 7); // Вычитаем 7 дней из текущей даты для получения прошлой недели
    
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    
      const endDate = new Date(currentDate);
      endDate.setDate(startDate.getDate() + 6);
    
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
    
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
    

  const AdvertisingDataType = AdvertisingData


  const getStatusStyle = (status) => {

    switch (status) {

      case 'active':
        return { background: 'rgba(0, 128, 0, 0.561)' };
      case 'paused':
        return { background: 'rgba(185, 213, 71, 0.801)' };
      case 'archive':
        return { background: 'rgba(115, 116, 108, 0.801)' };
      default:
        return {};
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedDateEnd, setSelectedDateEnd] = useState(null);

  const [activeFunction, setActiveFunction] = useState('currentWeek');

  const [currentWeek, setCurrentWeek] = useState(true);

  const handleDateChangeStart = (date, dateString) => {
    setSelectedDate(date);
    loadData(date, selectedDate);
  };

  const handleDateChangeEnd = (date, dateString) => {
    setSelectedDateEnd(date);
    loadData(selectedDateEnd, date);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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

const [Dubl , setDubl] = useState([])

const loginEndpoint = `/api/moderation/campaigns/manager?limit=${count_documents}`;

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
      'Компания',
      'Сайт',
      'Ссылки',
      'Статус',
      'Затраты',
      'Показы',
      'Количество кликов',
      'CPC',
      'CPM',
      'CTR',
      'Доход',
    ]);

    // Добавляем данные из AdvertisingData
    Dubl.forEach(info => {

      const matchingData = Array.isArray(infoStatic)
        ? infoStatic.find(item => item.campaign_id === info._id.$oid)
        : null;

      worksheet.addRow([
        info.title,
        info.site.name,
        info.site.URL,
        info.status,
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

useEffect(() => {

  const fetchData = async () => {
    
    const newLogoData = {};

    for (const item of AdvertisingDataType) {
      
      const document_type = '/logos';
      const document_id = `/${item.site.logo && item.site.logo}`;

      const url = `${LogoUrl}${document_type}${document_id}`;

      try {

        const response = await axios.get(url, {

          responseType: 'arraybuffer', // Укажите responseType как 'arraybuffer'
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        newLogoData[item.site.logo] = imageUrl;

      } catch (error) {
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

  fetchData();

}, [AdvertisingDataType, token]);


useEffect(() => {
  
  loadData();

}, [status,page, refreshToken,searchQuery,startDate,endDate, selectedOptionTwo]);


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
  company: 'Компания',
  website: 'Сайт',
  links: 'Ссылки',
  status: 'Статус',
  spending: 'Затраты',
  impressions: 'Показы',
  clicks: 'Количество кликов',
  cpc: 'CPC',
  cpm: 'CPM',
  ctr: 'CTR',
  revenue: 'Доход',
  login: 'Вход в личный кабинет'
};


const [selectedFields, setSelectedFields] = useState({
  company: true,
  website: true,
  links: true,
  status: true,
  spending: true,
  impressions: true,
  clicks: true,
  cpc: true,
  cpm: true,
  ctr: true,
  revenue: true,
  login: true
});


const EnterLKLogic = (user_id) => {
  const loginEndpoint = `/api/management/users/${user_id}/redirect`;
  const url = `${apiUrl}${loginEndpoint}`;
  window.open(url, '_blank');
};

const handleEnterLKClick = (user_id) => {
  EnterLKLogic(user_id);
};


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



    return (
        
        <section className={m.section__Mycomp}>

            <div className='container'>

                <p className={m.Mycomp__title}>Рекламные кампании</p>

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

{/* <div className={s.static__center}>

  <p className={s.static__center__title}>
  Модерируемый
  </p>

  <Select
    options={optionsTwo}
    value={selectedOptionTwo}
    onChange={handleSelectChangeTwo}
    className={s.static__center__select}
    isClearable={true}
    styles={customStylesTwo}
    placeholder="Все"
    width='200px !important'
  />

  <button className={p.app__btn} onClick={Sboss}>
    Сбросить
  </button>

      </div> */}

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
    className={[m.Mycomp__header__link, status === 'moderation' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('moderation')}
  >
    На модерации
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
    className={[m.Mycomp__header__link, status === 'rejected' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('rejected')}
  >
    Отклоненные
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'blocked' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('blocked')}
  >
    Заблокированные 
  </p>


</div>


    <hr className={m.Mycomp__header__hr} />

    <table className={s.static__table} id={m.table} ref={tableRef}>

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
  {AdvertisingDataType.map((info) => {
    const matchingData = Array.isArray(infoStatic)
      ? infoStatic.find((item) => item.campaign_id === info._id && info._id)
      : null;

    return (
      <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={info._id}>
        {Object.entries(selectedFields).map(([field, isSelected]) => {
          if (isSelected) {
            switch (field) {
              case 'company':
                return (
                  <td className={s.static__table__tbody__subtitleTwo} id={info && info._id} onClick={() => navigatePush(info._id)} style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '300px' }}>
                    {isLogoDataLoaded && logoData[info.site.logo && info.site.logo] ? (
                      <>
                        <img src={logoData[info.site.logo]} style={{ width: '60px' }} alt={info.site.name} />
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
                    {info && info.title}
                  </td>
                );
              case 'website':
                return (
                  <td className={s.static__table__tbody__title}>
                    {info && info.site.name ? info.site.name : 'не указано'}
                  </td>
                );
              case 'links':
                return (
                  <td className={s.static__table__tbody__subtitleTwo}>
                    <Link to={info && info.site.URL}>
                      {info && info.site.URL ? info.site.URL : 'не указано'}
                    </Link>
                  </td>
                );
              case 'status':
                return (
                  <td className={s.static__table__tbody__title}>
                    <p className={s.static__table__tbody__status} style={getStatusStyle(info.status)}>
                      {info.status ? info.status : 'не указано'}
                    </p>
                  </td>
                );
              case 'spending':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.expenses ? matchingData.expenses : '0'}
                  </td>
                );
              case 'impressions':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.display_count ? matchingData.display_count : '0'}
                  </td>
                );
              case 'clicks':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.click_count ? matchingData.click_count : '0'}
                  </td>
                );
              case 'cpc':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.cpc ? matchingData.cpc : '0'}
                  </td>
                );
              case 'cpm':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.cpm ? matchingData.cpm : '0'}
                  </td>
                );
              case 'ctr':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.ctr ? (matchingData.ctr * 100).toFixed(2) : '0'}
                  </td>
                );
              case 'revenue':
                return (
                  <td className={s.static__table__tbody__subtitle}>
                    {matchingData && matchingData.revenue ? Number(matchingData.revenue).toFixed(2): '0'}
                  </td>
                );

                case 'login':
                  return (
                    <td key={`${info._id && info._id}-login`} >
                        <button className='copyBtn' onClick={() => handleEnterLKClick(info.site.owner_user_id)}>Перейти</button>
                    </td>
                  );

              default:
                return null;
            }
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

        </section>

    )
}