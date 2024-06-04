import { useEffect, useRef, useState } from 'react';
import s from '../pages/statistics/Statistics.module.scss'
import { useAuth } from '../AuthContext';
import axios from 'axios';
import Save from '../components/save';
import Pagination from '../components/Pagination';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';
import p from '../components/Poisk.module.scss'
import m from '../pages/statistics/Advertising/MyAdvertisingComp.module.scss';
import { FiSettings } from 'react-icons/fi';
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'


export default function ApplicationsModer ({ handlePageChange, setcount_documents, page , count_documents}) {

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');
  
    const [VenuesData, setVenuesData] = useState([])
  
    const { refreshToken } = useAuth();
  
    const [searchQuery, setSearchQuery] = useState('');

    const [recentSearches, setRecentSearches] = useState([]);

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setRecentSearches([...recentSearches, searchQuery]);
    };


     // Загрузка недавних запросов из локального хранилища при загрузке компонента
  useEffect(() => {
    const storedRecentSearches = localStorage.getItem('recentSearches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  // Сохранение недавних запросов в локальное хранилище при изменении
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearchSubmit = () => {
    setRecentSearches([...recentSearches, searchQuery]);
  };

    const [status , setStatus] = useState('')
  
    const loadData = () => {
      
      const loginEndpoint = `/api/offers/all?limit=25&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${status ? `&status=${status}` : ''}`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then((res) => {
          setVenuesData(res.data.objects);
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
  
    }, [page, refreshToken, searchQuery, status]);
  
  
   console.log(VenuesData);

   const downloadXLSX = async () => {
     try {
       const workbook = new ExcelJS.Workbook();
       const worksheet = workbook.addWorksheet('Лист 1');
   
       // Add column headers
       worksheet.addRow([
         'Заголовок',
         'Cообщение',
         'Предложенная цена',
         'Создано',
         'Обновлено',
         'Подтвердить'
       ]);
   
       // Add data from VenuesData
       VenuesData.forEach(item => {
         worksheet.addRow([
           item.title || 'не указано',
           item.message || 'Не указано',
           item.suggested_price || 'Не указано',
           item.created_at && item.created_at.$date
             ? new Date(item.created_at.$date).toLocaleString()
             : 'Не указано',
           item.updated_at && item.updated_at.$date
             ? new Date(item.updated_at.$date).toLocaleString()
             : 'Не указано',
           item.confirm_at || 'Не указано',
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
   
    
    // Helper function to get status text
    const getStatusText = (status) => {
      switch (status) {
        case "moderation": return "На модерации";
        case "pending": return "Ожидание";
        case "approved": return "Одобрено";
        case "denied": return "Отказано";
        case "cancelled": return "Отменено";
        case "ready": return "В работе";
        case "checked": return "Проверено рекламодателем";
        case "finished": return "Завершено";
        case "confirmed": return "Оплачено";
        case "dispute": return "Спор";
        default: return "не указано";
      }
    };
    

      function formatDateTime(dateTimeString) {

        const optionsDate = {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
      
        const formattedDate = new Date(dateTimeString).toLocaleString('ru-RU', optionsDate);
      
        return formattedDate;
      }

      const navigate = useNavigate()

      const navigatePush = (camp_id) => {
    
          const loginEndpointTwo = `/api/management/offers/`;
          
          const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
      
              axios.get(url, {
      
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                  }
      
              })
              
              .then(res => {
    
              localStorage.setItem('ApplicationsCardModer', JSON.stringify(res.data));
      
              navigate(`/ApplicationsCardModer/${camp_id}`)
      
              })
      
              .catch(error => {
      
                if (error.response && error.response.status === 401) {
      
                  refreshToken();
      
                } else {
                  
                }
                  
              });
      
      }  


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
  chek: 'Выбрать',
  request_name: 'Название заявки',
  message: 'Cообщение',
  proposed_price: 'Предложенная цена',
  created_at: 'Создано',
  updated_at: 'Обновлено',
  confirm_until: 'Подтвердить до',
  login: 'Вход в личный кабинет'

};

const [selectedFields, setSelectedFields] = useState({
  chek: true,
  request_name: true,
  message: true,
  proposed_price: true,
  created_at: true,
  updated_at: true,
  confirm_until: true,
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
  const loginEndpointTwo = `/api/offers/`;
  const url = `${apiUrl}${loginEndpointTwo}${infoId}`;

  axios.patch(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.status === 200) {
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
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

            <div className={s.static__title}>

              <p className={s.static__title__p}>
              Заявки от рекламодателей
              </p>

            </div>         

            </div>

        </section>

         <div className='section__staticTwo'>
          
          <div className="container">

          <div className={p.app}>
              
              <p className={p.app__title}>
              Фильтровать по ключевым словам
              </p>

              <input type="text" className={p.app__input} placeholder='Поиск'  value={searchQuery} onChange={handleSearchChange}/>

              <button onClick={handleSearchSubmit} className={p.btn}>Поиск</button>

            </div>

      <div>
        <p>Недавние запросы: </p>

        <ul>

          {
          
        recentSearches.map((query, index) => (
          <li key={index}>{query}</li>
        ))

        }
        
    
     
        </ul>
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
    className={[m.Mycomp__header__link, status === 'pending' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('pending')}
  >
    Проверено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'rejected' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('rejected')}
  >
    Отклонено
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

      {VenuesData.map((item) => (
  <tr key={item._id.$oid}>
    <td>
      <input
        type="checkbox"
        checked={selectedRows.includes(item._id)}
        onChange={() => handleRowSelect(item._id)}
        className={s.static__table__thead__chek}
      />
    </td>
    {Object.keys(selectedFields).map((field, index) => {
      if (selectedFields[field]) {
        let content = null;
        switch (field) {
          case 'request_name':
            content = (
              <div onClick={() => navigatePush(item._id)}>
                {item.title ? item.title : 'не указано'}
              </div>
            );
            break;
          case 'message':
            content = item.message ? item.message : 'Не указано';
            break;
          case 'proposed_price':
            content = item.suggested_price ? item.suggested_price : 'Не указано';
            break;
          case 'created_at':
            content = item.created_at && item.created_at.$date
              ? new Date(item.created_at.$date).toLocaleString()
              : 'Не указано';
            break;
          case 'updated_at':
            content = item.updated_at && item.updated_at.$date
              ? new Date(item.updated_at.$date).toLocaleString()
              : 'Не указано';
            break;
          case 'confirm_until':
            content = item.confirm_at ? item.confirm_at : 'Не указано';
            break;
          case 'login':
            content = (
              <td key={`${item._id && item._id.$oid}-login`} >
                <button className='copyBtn' onClick={() => item.owner_user_id && handleEnterLKClick(item.owner_id)}>Перейти</button>
              </td>
            );
            break;
          default:
            break;
        }
        return <td key={index} className={s.static__table__tbody__subtitle}>{content}</td>;
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

    </div>


        </>


    )
}