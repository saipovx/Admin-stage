import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import P from '../components/Poisk.module.scss'
import s from '../pages/statistics/Statistics.module.scss'
import p from './Placement.module.scss'
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { DatePicker, Select } from "antd";
import Save from "../components/save";
import ExcelJS from 'exceljs';
import { FiSettings } from "react-icons/fi";


export default function PlaceMentUsers ({ setPlacementId, handlePageChange, setcount_documents, page, count_documents }) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const { refreshToken } = useAuth();

  const [PlacementAll, setPlacementAll] = useState([])

  const [searchQuery, setSearchQuery] = useState('');

  const [activeFunction, setActiveFunction] = useState('currentWeek');

  const [currentWeek, setCurrentWeek] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedDateEnd, setSelectedDateEnd] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const [selectedOptionThree, setSelectedOptionThree] = useState('');

  const handleSelectChangeThree = (selectedOptionThree) => {

    setSelectedOptionThree(selectedOptionThree);

  };

  const DataStyle = {
    color: 'black',
    marginBottom: '0',
    height: '38px',
    border: '1px solid var(--interface-seventh, #EBEDF5)',
  };

  const optionsTwo = [
    { value: '', label: 'Все' },
    { value: 'once', label: 'Единоразово' },
    { value: 'daily', label: 'Ежедневно' },
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'monthly', label: 'Ежемесячно' },
    { value: 'quartely', label: 'Ежеквартально' },
  ];

  const [selectedOptionTwo, setSelectedOptionTwo] = useState('');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const handleSelectChangeTwo = (selectedOptionTwo) => {

    setSelectedOptionTwo(selectedOptionTwo);

  };

  const handleDateChangeStart = (date, dateString) => {
    setSelectedDate(date);
    loadData(date, selectedDate);
  };

  const handleDateChangeEnd = (date, dateString) => {
    setSelectedDateEnd(date);
    loadData(selectedDateEnd, date);
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

  const Sboss = () => {
    setSelectedOptionTwo('')
    setSelectedOptionThree('')
  }



  const loadData = () => {

    const loginEndpoint = `/api/management/get_placement_users?limit=25&page=${page}&site=${searchQuery}${selectedOptionTwo ? `&period=${selectedOptionTwo}` : ''}`;

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

  }, [page, refreshToken, searchQuery, selectedOptionTwo, selectedOptionThree, startDate, endDate]);

  const [logoData, setLogoData] = useState({});
  const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

  const LogoUrl = process.env.REACT_APP_API_URL_LOGO;
  
  
  useEffect(() => {
    const fetchData = async () => {
      const newLogoData = {};
  
      for (const item of PlacementAll) {
        if (item.site && item.site.logo) {
          const url = `${LogoUrl}/logos/${item.site.logo.$oid}`;
  
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
  
            const modifiedUrl = imageUrl.substring("blob:".length);
            
  
            newLogoData[item.site.logo.$oid] = modifiedUrl;            
  
          } catch (error) {
            if (error.response && error.response.status === 401) {
              refreshToken();
            } else {
              // Handle other errors
            }
          }
        } else {
          console.error("item.site or item.site.logo is null or undefined");
        }
      }
  
      setLogoData(newLogoData);
      
      setIsLogoDataLoaded(true);

    };
  
    fetchData();

  }, [PlacementAll, token]);



  const navigate = useNavigate()

  const navigatePush = (camp_id) => {

    const loginEndpointTwo = `/api/management/get_placement_users/`;

    const url = `${apiUrl}${loginEndpointTwo}${camp_id}`

    axios.get(url, {

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

    })

      .then(res => {

        setPlacementId(res.data)

        localStorage.setItem('PlacementData', JSON.stringify(res.data));

        navigate(`/PlacementTwo/${camp_id}`)

      })

      .catch(error => {

        if (error.response && error.response.status === 401) {

          refreshToken();

        } else {

        }

      });

  }

  let objects = {

    "once": "Единоразово",
    "daily": "Ежедневно",
    "weekly": "Еженедельно",
    "monthly": "Ежемесячно",
    "quartely": "Ежеквартально",

  }

  const optionsThree = [
    { value: '', label: 'Все' },
    { value: 'active', label: 'Активный' },
    { value: 'paused', label: 'Приостановлен' },
    { value: 'archive', label: 'Архивирован' },
  ];

  const [Dubl, setDubl] = useState([])

  const loginEndpoint = `/api/management/get_placement_users?limit=${count_documents}`;

  const url = `${apiUrl}${loginEndpoint}`

  useEffect(() => {
    ;

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

  }, [refreshToken, count_documents]);

  const downloadXLSX = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');

      // Добавляем заголовки столбцов
      worksheet.addRow([
        'Социальные сети',
        'Ссылка',
        'Тип',
        'Описание',
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
      a.download = 'data.xlsx';
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
        thead.style.top = '65px';
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
  }, []);

  console.log(PlacementAll);

  const translations = {
    platform: 'Площадка',
    link: 'Ссылка',
    placementType: 'Тип размещения',
    description: 'Описание',
    // periodicity: 'Периодичность',
    webmasterPrice: 'Цена вебмастера',
    audience: 'Аудитория',
    expectedCoverage: 'Ожидаемый охват',
    login: 'Вход в личный кабинет'

  };
  
  const [selectedFields, setSelectedFields] = useState({
    platform: true,
    link: true,
    placementType: true,
    description: true,
    // periodicity: true,
    webmasterPrice: true,
    audience: true,
    expectedCoverage: true,
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

    <section className={p.section__place}>

      <div className="container">

        <p className={s.static__title__p}>
        Рекламные размещения вебмастеров
        </p>


        <div className={P.app}>

          <p className={P.app__title}>
            Поиск по названию сайта
          </p>

          <input type="text" className={P.app__input} placeholder='Поиск по названию сайта'
            value={searchQuery} onChange={handleSearchChange} />

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
            isClearable={true}
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
          <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id && item._id.$oid}>
            {Object.entries(selectedFields).map(([field, isSelected]) => {
              if (isSelected) {
                switch (field) {
                  case 'platform':
                    return (
                      <td key={`${item._id && item._id.$oid}-platform`} className={s.static__table__tbody__subtitle} onClick={() => navigatePush(item._id.$oid)}>
                        {isLogoDataLoaded && item.site && item.site.logo && <img src={logoData[item.site.logo.$oid]} alt="" />}
                        {item.site !== null ? item.site.name : 'Не указано'}
                      </td>
                    );
                  case 'link':
                    return (
                      <td key={`${item._id && item._id.$oid}-link`} className={s.static__table__tbody__subtitle}>
                        {item.site !== null ? (
                          <Link to={item.site.URL}>
                            {item.site.URL}
                          </Link>
                        ) : (
                          'Не указано'
                        )}
                      </td>
                    );
                  case 'placementType':
                    return <td key={`${item._id && item._id.$oid}-placementType`} className={s.static__table__tbody__subtitleTwo}>{item.name}</td>;
                  case 'description':
                    return <td key={`${item._id && item._id.$oid}-description`} className={s.static__table__tbody__subtitle}>{item.decsription ? item.decsription : 'Не указано'}</td>;
                  // case 'periodicity':
                  //   return <td key={`${item._id && item._id.$oid}-periodicity`} className={s.static__table__tbody__subtitle}>{objects[item.periodicity]}</td>;
                  case 'webmasterPrice':
                    return <td key={`${item._id && item._id.$oid}-webmasterPrice`} className={s.static__table__tbody__subtitle}>{item.start_price}</td>;
                  case 'audience':
                    return <td key={`${item._id && item._id.$oid}-audience`} className={s.static__table__tbody__subtitle}>{item.total_audience}</td>;
                  case 'expectedCoverage':
                    return <td key={`${item._id && item._id.$oid}-expectedCoverage`} className={s.static__table__tbody__subtitle}>{item.expected_coverage}</td>;

                    case 'login':
                      return (
                        <td key={`${item._id && item._id.$oid}-login`} >
                            <button className='copyBtn' onClick={() => handleEnterLKClick(item.site.owner_user_id)}>Перейти</button>
                        </td>
                      );
  
                      

                  default:
                    return null;
                }
              }
              return null;
            })}
          </tr>
        ))}
      </tbody>

        </table>

        <Pagination page={page} handlePageChange={handlePageChange} count_documents={count_documents} />

      </div>


    </section>

  )
}