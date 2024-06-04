import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";

import s from '../pages/statistics/Statistics.module.scss'
import p from './Placement.module.scss'
import P from '../components/Poisk.module.scss'

import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { DatePicker, Select } from "antd";
import ExcelJS from 'exceljs';
import Save from "../components/save";
import m from '../pages/statistics/Advertising/MyAdvertisingComp.module.scss';
import { FiSettings } from "react-icons/fi";
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'


export default function PlaceMent ({setPlacementId, handlePageChange, setcount_documents, page , count_documents}) {

    const apiUrl = process.env.REACT_APP_API_URL;
  
    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();
    
    const [PlacementAll , setPlacementAll] = useState([])

    const [searchQuery, setSearchQuery] = useState('');

    const [selectedOptionTwo, setSelectedOptionTwo] = useState(''); 

    const [startDate, setStartDate] = useState('');

    const [endDate, setEndDate] = useState('');

    const handleSelectChangeTwo = (selectedOptionTwo) => {

      setSelectedOptionTwo(selectedOptionTwo);

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
      { value: 'once', label: 'Единоразово' },
      { value: 'daily', label: 'Ежедневно' },
      { value: 'weekly', label: 'Еженедельно' },
      { value: 'monthly', label: 'Ежемесячно' },
      { value: 'quartely', label: 'Ежеквартально' },
  ];

  const Sboss = () => {
    setSelectedOptionTwo('')
  } 

  const DataStyle = {
    color: 'black',
    marginBottom: '0',
    height: '38px' ,
    border: '1px solid var(--interface-seventh, #EBEDF5)',
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedDateEnd, setSelectedDateEnd] = useState(null);

  const [activeFunction, setActiveFunction] = useState('currentWeek');

  const [currentWeek, setCurrentWeek] = useState(true);

  const [status , setStatus] = useState('')
    
    const loadData = () => {

      const loginEndpoint = `/api/placement/all?start_date=${startDate}&end_date=${endDate}&limit=20&page=${page}&site=${searchQuery}${selectedOptionTwo ? `&period=${selectedOptionTwo}` : ''}${status ? `&status=${status}` : ''}`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then((res) => {
          setPlacementAll(res.data.objects)
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

    const navigate = useNavigate()

    const navigatePush = (camp_id) => {

        const loginEndpointTwo = `/api/management/get_placement_users/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
    
            axios.get(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {
    
            setPlacementId(res.data)

            localStorage.setItem('PlacementData', JSON.stringify(res.data));
    
            navigate(`/PlacementOne/${camp_id}`)
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
    }
    
    const [logoData, setLogoData] = useState({});
    const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

  const LogoUrl = process.env.REACT_APP_API_URL_LOGO;

    
    useEffect(() => {

      const fetchData = async () => {
        const newLogoData = {};


        for (const item of PlacementAll) {

          const url = `${LogoUrl}/logos/${item.site.logo}`;
          
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
    }, [PlacementAll, token]);
     

    let objects = {

      "once": "Единоразово",
      "daily": "Ежедневно",
      "weekly": "Еженедельно",
      "monthly": "Ежемесячно",
      "quartely": "Ежеквартально",
      
    }

    useEffect(() => {
  
      loadData();
  
    }, [page, refreshToken,searchQuery,selectedOptionTwo,startDate, endDate, status]);


    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/placement/all?limit=${count_documents}`;

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
          'Социальные сети',
          'Ссылка',
          'Тип',
          'Описания',
          'Периодичность',
          'Стартовая цена',
        ]);
    
        // Добавляем данные из PlacementAll
        Dubl.forEach(item => {
          worksheet.addRow([
            item.site.name,
            item.URL,
            item.name,
            item.decsription,
            objects[item.periodicity],
            item.start_price,
          ]);
        });
    
        const blob = await workbook.xlsx.writeBuffer();
        const blobObject = new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        const blobUrl = URL.createObjectURL(blobObject);
    
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'my_placement_data.xlsx';
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

    const translations = {
      chek: 'Выбрать',
      site_logo: 'Логотип',
      site_name: 'Площадка',
      site_URL: 'Ссылка',
      placement_type: 'Тип размещения',
      description: 'Описание',
      webmaster_price: 'Цена вебмастера',
      audience: 'Aудитория',
      expected_coverage: 'Ожидаемый охват',
      login: 'Вход в личный кабинет'

    };
  
    const [selectedFields, setSelectedFields] = useState({
      chek: true,
      site_logo: true ,
      site_name: true,
      site_URL: true,
      placement_type: true,
      description: true,
      webmaster_price: true,
      audience: true,
      expected_coverage: true,
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
  const loginEndpointTwo = `/api/placement/`;
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

    return (
        
    <section className={p.section__place}>

        <div className="container">

        <p className={s.static__title__p}>
        Рекламные размещения вебмастеров
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
{/* 
                <DatePicker onChange={handleDateChangeStart} style={DataStyle} placeholder='Oт'/>

                <DatePicker onChange={handleDateChangeEnd} style={DataStyle} placeholder='До'/> */}

        </div>

        <div className={P.app}>
              
              <p className={P.app__title}>
              Поиск по названию сайта
              </p>

              <input type="text" className={P.app__input} placeholder='Поиск по названию сайта'
              value={searchQuery} onChange={handleSearchChange}/>

        </div>

      <div className={s.static__center}>

  <p className={s.static__center__title}>
  Период
  </p>

  <Select
    options={optionsTwo}
    value={selectedOptionTwo}
    onChange={handleSelectChangeTwo}
    className={s.static__center__select}
    // isClearable={true}
    styles={customStylesTwo}
    placeholder="Все"
    width='200px !important'
  />

  <button className={P.app__btn} onClick={Sboss}>
    Сбросить
  </button>

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

       <div className={m.Mycomp__header} style={{marginBottom: '30px'}}>
  
  <p
    className={[m.Mycomp__header__link, !status && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('')}
  >
    На модерации
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'verified' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('verified')}
  >
    Проверено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'rejected' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('rejected')}
  >
    Отклонено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'blocked' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('blocked')}
  >
    Заблокировано
  </p>

  

       </div>

<hr className={m.Mycomp__header__hr}  style={{marginTop: '-31px'}}/>


    <table className={s.static__table}  ref={tableRef}>

        <thead className={`${s.static__table__thead}`}>

          <tr>

        {Object.keys(selectedFields).map((field, index) => {
          if (selectedFields[field]) {
            return (
              <th key={index} className={s.static__table__thead__titleTwo}>
                {translations[field]}
              </th>
            );
          }
          return null;
        })}

        
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
        {PlacementAll.map((item, key) => (
  <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id}>
    {Object.keys(selectedFields).map((field, index) => {
      if (selectedFields[field]) {
        return (
          <td key={index} className={s.static__table__tbody__subtitle}>
            {field === 'chek' ? (
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item._id)}
                  onChange={() => handleRowSelect(item._id)}
                  className={s.static__table__thead__chek}
                />
              </td>
            ) : field === 'site_logo' && isLogoDataLoaded && logoData[item.site.logo] ? (
              <div onClick={() => navigatePush(item._id)}>
                <img src={logoData[item.site.logo]} style={{ width: '60px' }} alt={item.site.name} />
              </div>
            ) : field === 'site_name' ? (
              item.site.name
            ) : field === 'site_URL' ? (
              item.URL
            ) : field === 'placement_type' ? (
              item.name
            ) : field === 'description' ? (
              item.description ? item.description : 'Не указано'
            ) : field === 'webmaster_price' ? (
              item.start_price 
            ) : field === 'audience' ? (
              item.total_audience
            ) : field === 'expected_coverage' ? (
              item.expected_coverage
            ) : field === 'login' && (
              <td key={`${item._id && item._id.$oid}-login`} >
                <button className='copyBtn' onClick={() => item.owner_user_id && handleEnterLKClick(item.owner_user_id)}>Перейти</button>
              </td>
            )}
          </td>
        );
      }
      return null;
    })}
  </tr>
))}

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