
import m from './Moderation.module.scss'
import s from '../statistics/Statistics.module.scss'
import p from '../../components/Poisk.module.scss'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ExcelJS from 'exceljs';
import Save from '../../components/save';
import M from '../statistics/Advertising/MyAdvertisingComp.module.scss';
import { FiSettings } from 'react-icons/fi';
import i from '../statistics/InternalPage/InternalPage.module.scss'


export default function Moderation ({handlePageChange, setcount_documents, page , count_documents}) {

    const apiUrl = process.env.REACT_APP_API_URL;
  
    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const [moderCard , setmoderCard] = useState([])

    const [searchQuery, setSearchQuery] = useState('');

    const [status , setStatus] = useState('moderation')
    
    const loadData = () => {

      const loginEndpoint = `/api/moderation/campaigns/all?limit=25&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${status ? `&status=${status}` : ''}`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then((res) => {
             setmoderCard(res.data.objects)
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
  
    
    useEffect(() => {
  
      loadData();
  
    }, [page, refreshToken,searchQuery, status]);
  

    const navigate = useNavigate()

    const True = true

    const navigPushModer = (camp_id) => {
  
        const loginEndpointTwo = `/api/moderation/campaigns/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${camp_id}?moderation=${True}`;
    
            axios.get(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {
  
            localStorage.setItem('ModerInfo', JSON.stringify(res.data));
    
            navigate(`/InternalMeModer/${camp_id}`)
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
    }


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

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };


  
    const downloadXLSX = async () => {

      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
    
        // Добавляем заголовки столбцов
        worksheet.addRow([
          'Заголовок',
          'О бренде',
          'Статус',
          'Сегмент',
          'Модель',
        ]);
    
        // Добавляем данные из Dubl
        moderCard.forEach(item => {
          worksheet.addRow([
            item.title,
            item.about_brand,
            item.status,
            item.segment.join(', '),
            item.model.join(', '),
          ]);
        });
    
        const blob = await workbook.xlsx.writeBuffer();
        const blobObject = new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        const blobUrl = URL.createObjectURL(blobObject);
    
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'my_moderation_data.xlsx';
        a.click();
      } catch (error) {
        console.error('Ошибка при скачивании XLSX:', error);
      }

    };

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
          thead.style.top = '66px';
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
      
    }, []);


    const [startDate, setStartDate] = useState(''); 
  
    const [endDate, setEndDate] = useState('');

    const [infoStatic, setinfoStatic ] = useState([])

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


  const translations = {
    chek: 'Выбрать',
    title: 'Рекламная кампания',
    status: 'Статус',
    expenses: 'Затраты',
    display: 'Показы',
    clicks: 'Количество кликов',
    cpc: 'CPC',
    cpm: 'CPM',
    ctr: 'CTR',
    revenue: 'Доход',
    login: 'Вход в личный кабинет'

  };
  
const [selectedFields, setSelectedFields] = useState({
  chek: true,
  title: true,
  status: true,
  expenses: true,
  display: true,
  clicks: true,
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

  const EnterLKLogic = (user_id) => {
    const loginEndpoint = `/api/management/users/${user_id}/redirect`;
    const url = `${apiUrl}${loginEndpoint}`;
    window.open(url, '_blank');
  };
  
  const handleEnterLKClick = (user_id) => {
    EnterLKLogic(user_id);
  };


  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  console.log(selectedRows);

  const [showForm, setShowForm] = useState(true);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [selectedOption, setSelectedOption] = useState("verified");

  const [Comment, setComment] = useState('');

  const data = {
    
    is_moderated: selectedOption,
    comment: Comment,

};

const handleModeration = () => {
  selectedRows.forEach(infoId => moderMePush(infoId));
};

const moderMePush = (infoId) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const loginEndpointTwo = `/api/moderation/campaigns/`;

  const url = `${apiUrl}${loginEndpointTwo}${infoId}`;

  axios.patch(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.status === 204) {
      // setShowForm(false);
      setShowSuccessMessage(true);
      setSelectedRows([])
      setComment('')

    // Установка таймера на сброс showSuccessMessage через 3 секунды
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    }
  })
  .catch(error => {
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data.detail;

      switch (status) {
        case 400:
        case 409:
        case 404:
        case 401:
          alert(`Error ${status}: ${detail}`);
          break;
        default:
          // handle other errors if needed
          break;
      }
    } else {
      // handle non-response errors
    }

    if (error.response && error.response.status === 401) {
      refreshToken();
    }
  });

}

    return(
        
        <section className={m.section__moderation}>
            
            <div className="container">
                
            <p className={s.static__title__p}>
            Рекламные кампании
            </p>

            <div className={p.app}>
              
              <p className={p.app__title}>
              Фильтровать по ключевым словам
              </p>

              <input type="text" className={p.app__input} placeholder='Поиск по названию,или описанию компании'  value={searchQuery} onChange={handleSearchChange}/>

            </div>

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

      <div className={M.Mycomp__header} style={{marginBottom: '30px'}} >

  <p
    className={[M.Mycomp__header__link, status === 'moderation' && M.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('moderation')}
  >
    На модерации
  </p>

  <p
    className={[M.Mycomp__header__link, status === 'active' && M.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('active')}
  >
    Активные
  </p>

  <p
    className={[M.Mycomp__header__link, status === 'paused' && M.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('paused')}
  >
    Остановленные
  </p>

  <p
    className={[M.Mycomp__header__link, status === 'rejected' && M.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('rejected')}
  >
    Отклоненные
  </p>

  <p
    className={[M.Mycomp__header__link, status === 'blocked' && M.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('blocked')}
  >
    Заблокированные 
  </p>


</div>

    <hr className={M.Mycomp__header__hr}  style={{marginTop: '-31px'}}/>


    <table className={s.static__table} ref={tableRef}>

        <thead className={`${s.static__table__thead}`}>

          <tr>
          {Object.entries(selectedFields).map(([field, isSelected]) => (
    isSelected && (
      <th key={field} className={s.static__table__thead__title}>
        {translations[field]}
      </th>
    )
  ))}
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
  {moderCard.map((item, key) => {

    const matchingData = Array.isArray(infoStatic)
      ? infoStatic.find((info) => info.campaign_id === item._id && item._id)
      : null;

    return (
      <tr
        style={{ borderBottom: '1px solid #EBEDF5' }}
        className={s.static__table__tbody__tr}
        key={item._id.$oid}
      >

{selectedFields.chek && (
          <td>
          <input
          type="checkbox"
          checked={selectedRows.includes(item._id)}
          onChange={() => handleRowSelect(item._id)}
          className={s.static__table__thead__chek}
        />
      </td>
  )}


 {selectedFields.title && (
    <td className={s.static__table__tbody__subtitleTwo} onClick={() => navigPushModer(item._id)}>{item.title}</td>
  )}

  {selectedFields.status && (
    <td className={s.static__table__tbody__subtitle}>{item.status}</td>
  )}

  {selectedFields.expenses && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.expenses : '0' }</td>
  )}

  {selectedFields.display && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.display : '0'}</td>
  )}

  {selectedFields.clicks && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.clicks : '0'}</td>
  )}

  {selectedFields.cpc && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.cpc : '0'}</td>
  )}

  {selectedFields.cpm && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.cpm : '0'}</td>
  )}

  {selectedFields.ctr && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.ctr : '0'}</td>
  )}

  {selectedFields.revenue && (
    <td className={s.static__table__tbody__subtitle}>{matchingData ? matchingData.revenue : '0'}</td>
  )}

{selectedFields.login && (
                    <td key={`${item._id && item._id.$oid}-login`} >
                        <button className='copyBtn' onClick={() => item.owner_user_id && handleEnterLKClick(item.owner_user_id)}>Перейти</button>
                    </td>
  )}


      </tr>
    );
  })}
</tbody>



      </table>


        <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>
                
        {showForm && (

<div className={i.inter__footer}>

  <textarea type="text" placeholder='Комментарий ...' className={i.inter__footer__input} value={Comment} onChange={(event) => setComment(event.target.value)} />


  <form className={i.inter__footer__flex}>

    <label className={i.inter__footer__label}>
      <input type="radio" name="" id="" value="verified" checked={selectedOption === "verified"}
        onChange={() => setSelectedOption("verified")}

      />
      <p className={i.inter__footer__label__green}>Проверено</p>
    </label>

    <label className={i.inter__footer__label}>
      <input type="radio" name="" id="" value="rejected"
        checked={selectedOption === "rejected"}
        onChange={() => setSelectedOption("rejected")}
      />
      <p className={i.inter__footer__label__green}>Отклонено</p>
    </label>

    <label className={i.inter__footer__label}>
      <input type="radio" name="" id=""
        value="blocked"
        checked={selectedOption === "blocked"}
        onChange={() => setSelectedOption("blocked")}
      />
      <p className={i.inter__footer__label__green}>Заблокировано</p>
    </label>

  </form>


  <button className={i.inter__btn}  onClick={handleModeration}>Модерировать</button>

</div>

)}

{showSuccessMessage && <div className={i.inter__footertwo}>Промодерировано</div>}

            </div>

        </section>

    )

}