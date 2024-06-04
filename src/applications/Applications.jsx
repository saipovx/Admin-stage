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


export default function Applications ({ handlePageChange, setcount_documents, page , count_documents}) {

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');
  
    const [VenuesData, setVenuesData] = useState([])
  
    const { refreshToken } = useAuth();
  
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };

    const [status , setStatus] = useState('')
  
    const loadData = () => {
      
      const loginEndpoint = `/api/management/offers?limit=25&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${status ? `&status=${status}` : ''}`;
  
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
  
    }, [page, status, refreshToken, searchQuery]);
  
  
    const VenuesDataType = VenuesData

    console.log(VenuesDataType);

    
    const downloadXLSX = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
    
        // Add column headers
        worksheet.addRow([
          'Описание',
          'Статус',
          'Рекомендованная цена',
          'Дата бронирования',
          'Создано',
          'Подтверждено'
        ]);
    
        // Add data from VenuesData
        VenuesData.forEach(item => {
          worksheet.addRow([
            item.description || 'не указано',
            getStatusText(item.status) || 'не указано',
            item.suggested_price || 'не указано',
            item.updated_at ? new Date(item.updated_at).toLocaleString() : 'не указано',
            item.created_at ? new Date(item.created_at).toLocaleString() : 'не указано',
            item.confirm_at || 'не указано',
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
    
              localStorage.setItem('ApplicationsCard', JSON.stringify(res.data));
      
              navigate(`/ApplicationsCard/${camp_id}`)
      
              })
      
              .catch(error => {
      
                if (error.response && error.response.status === 401) {
      
                  refreshToken();
      
                } else {
                  
                }
                  
              });
      
      }
      
    //   const [finishedText, setfinishedText] = useState([])

    //   const HandleFinished = (offer_id) => {
    
    //     const loginEndpointTwo = `/api/management/offers/${offer_id}/confirmed`;
        
    //     const url = `${apiUrl}${loginEndpointTwo}`;
    
    //         axios.get(url, {
    
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}` 
    //             }
    
    //         })
            
    //         .then(res => {

    //           setfinishedText(res.data)
    
    //         })
    
    //         .catch(error => {
    
    //           if (error.response && error.response.status === 401) {
    
    //             refreshToken();
    
    //           } else {
                
    //           }
                
    //         });
    
    //    }

    // console.log(finishedText);

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
      title: 'Название заявки',
      description: 'Описание',
      status: 'Статус',
      suggested_price: 'Предложенная цена',
      created_at: 'Создано',
      updated_at: 'Обновлено',
      // start: 'Старт',
      confirm_at: 'Подтверждено',
      login: 'Вход в личный кабинет'

    };
    
    const [selectedFields, setSelectedFields] = useState({
      title: true,
      description: true,
      status: true,
      suggested_price: true,
      created_at: true,
      updated_at: true,
      // start: true,
      confirm_at: false, // Изначально скрытый, так как зависит от статуса
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
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

            <div className={s.static__title}>

              <p className={s.static__title__p}>
              Заявки
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
    Все
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'moderation' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('moderation')}
  >
    На модерации
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'pending' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('pending')}
  >
    Ожидание
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'approved' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('approved')}
  >
    Одобрено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'denied' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('denied')}
  >
    Отказано
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'cancelled' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('cancelled')}
  >
    Отменено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'ready' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('ready')}
  >
    В работе
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'checked' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('checked')}
  >
    Проверено рекламодателем
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'finished' && m.Mycomp__header__link__active].join(' ')}

    onClick={() => {
      setStatus('finished');
    }}

  >
    Завершено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'confirmed' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('confirmed')}
  >
    Оплачено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'dispute' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('dispute')}
  >
    Спор
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
    <tr key={item._id}>
      {Object.keys(selectedFields).map((field, index) => {
        if (selectedFields[field]) {
          return (
            <td key={index} className={s.static__table__tbody__subtitleTwo}>
              {(() => {
                switch (field) {

                  case "title":
                    return (
                      <p onClick={() => navigatePush(item._id)}>{item.title ? item.title : 'не указано'}</p>
                    ) 

                  case "description":
                    return item.description ? item.description : '-';
                  case "status":
                    return (() => {
                      switch (item.status) {
                        case "moderation":
                          return "На модерации";
                        case "pending":
                          return "Ожидание";
                        case "approved":
                          return "Одобрено";
                        case "denied":
                          return "Отказано";
                        case "cancelled":
                          return "Отменено";
                        case "ready":
                          return "В работе";
                        case "checked":
                          return "Проверено рекламодателем";
                        case "finished":
                          return "Завершено";
                        case "confirmed":
                          return "Оплачено";
                        case "dispute":
                          return "Спор";
                        default:
                          return "";
                      }
                    })();
                  case "suggested_price":
                    return item.suggested_price ? item.suggested_price : 'Не указано';
                  case "created_at":
                    return item.created_at ? new Date(item.created_at).toLocaleString() : 'Не указано';
                  case "updated_at":
                    return item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Не указано';

                    case "login":
                      return (
                        <td key={`${item._id && item._id.$oid}-login`} >
                            <button className='copyBtn' onClick={() => handleEnterLKClick(item.owner_user_id)}>Перейти</button>
                        </td>
                      );
  

                  // case "confirm_at":
                  //   return item.confirm_at ? item.confirm_at : '';
                  default:
                    return '';
                }
              })()}
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


        </div>

    </div>


        </>


    )
}