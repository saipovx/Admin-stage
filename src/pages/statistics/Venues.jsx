
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import s from '../statistics/Statistics.module.scss'
import p from '../../components/Poisk.module.scss'

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import Pagination from '../../components/Pagination';
import ExcelJS from 'exceljs';
import Save from '../../components/save';
import m from '../statistics/Advertising/MyAdvertisingComp.module.scss';
import { FiSettings } from 'react-icons/fi';


export default function Venues ({ handlePageChange, setcount_documents, page , count_documents}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [VenuesData, setVenuesData] = useState([])

  const { refreshToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const [status , setStatus] = useState('')

  const loadData = () => {

    const loginEndpoint = `/api/moderation/sites/all?limit=25&page=${page}&search=${searchQuery}${status ? `&is_moderated=${status}` : ''}&type_platform=area`;

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

  }, [page, refreshToken,searchQuery, status]);


  const VenuesDataType = VenuesData

  console.log(VenuesDataType);

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
  
          navigate(`/InternalPageVenues/${camp_id}`)
  
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

  const [Dubl , setDubl] = useState([]);

  const loginEndpoint = `/api/moderation/sites/all?limit=${count_documents}`;
  const url = `${apiUrl}${loginEndpoint}`;
  
  useEffect(() => {
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setDubl(res.data.objects);
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
        'Заголовок',
        'О бренде',
        'Бюджет',
        'Сегмент',
        'Ссылки',
      ]);
  
      // Добавляем данные из Dubl
      Dubl.forEach(item => {
        worksheet.addRow([
          item.title,  // Fix here
          item.campaign && item.campaign.about_brand,
          item.campaign && item.campaign.cpc_budget,
          item.campaign && item.campaign.segment.join(', '),
          item.URL,
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
      // https://i-stage.qrooto.com/logos/
      for (const item of VenuesDataType) {
        const url = `${LogoUrl}/logos/${item.logo}`;
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
  
        // Check if the response status is 200
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
  
          newLogoData[item.logo] = imageUrl;

        } else {
          
        }

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
  }, [VenuesDataType, token]);


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
    logos: 'Логотип',
    platform: 'Площадка',
    links: 'Ссылки',
    created_at: 'Создано',
    updated_at: 'Обновлено',
    status: 'Статус',
    login: 'Вход в личный кабинет'
  };
  
  const [selectedFields, setSelectedFields] = useState({
    logos: true ,
    platform: true,
    links: true,
    created_at: true,
    updated_at: true,
    status: true,
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
  

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

            <div className={s.static__title}>

              <p className={s.static__title__p}>
               Площадки
              </p>

            </div>
                

            <div className={p.app}>
              
              <p className={p.app__title}>
              Фильтровать по ключевым словам
              </p>

              <input type="text" className={p.app__input} placeholder='Поиск по названию, или описанию компании'  value={searchQuery} onChange={handleSearchChange}/>

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
      
      <div className={s.static__table__container}>

    <table className={s.static__table}  ref={tableRef}>

      <thead className={`${s.static__table__thead}`}>

          <tr>
{selectedFields.logos && <th className={s.static__table__thead__title}>Логотип</th>}
{selectedFields.platform && <th className={s.static__table__thead__title}>Площадка</th>}
{selectedFields.links && <th className={s.static__table__thead__titleTwo}>Ссылки</th>}
{selectedFields.created_at && <th className={s.static__table__thead__titleTwo}>Создано</th>}
{selectedFields.updated_at && <th className={s.static__table__thead__titleTwo}>Обновлено</th>}
{selectedFields.status && <th className={s.static__table__thead__titleTwo}>Статус</th>}
{selectedFields.status && <th className={s.static__table__thead__titleTwo}>Вход в личный кабинет</th>}
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
  {VenuesDataType.map((item, key) => (
    <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item && item._id}>
      {Object.entries(selectedFields).map(([field, isSelected]) => {
        if (!isSelected) return null;
        
        let content;
        switch (field) {

case 'logos':
  content = (
    <td style={{ display: 'flex', alignItems: 'center', gap: '25px'}} >
    {isLogoDataLoaded && logoData[item.logo] ? (
      <img src={logoData[item.logo]} style={{ width: '60px' }} alt={''} />
    ) : (
      <p>Loading...</p>
    )}
  </td>
  );
  break;


          case 'platform':
            content = (
              <div onClick={() => navigatePush(item._id)}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '25px'}} >
                  <span>{item.name }</span>
                </td>
              </div>
            );
            break;


          case 'links':
            content = (
              <Link to={item.URL} target='_blank'>
                {item.URL ? item.URL : 'не указано'}
              </Link>
            );
            break;

            case 'created_at':
              content = (
                <div>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Не указано'}</div>
              );
              break;

              case 'updated_at':
                content = (
                  <div>{item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Не указано'}</div>
                );
                break;

                case 'status':
                  content = (
                    <div>{item.status}</div>
                  );

                  break

                  case 'login':
                    content = (
                     <td key={`${item._id && item._id}-login`} >
                      <button className='copyBtn' onClick={() => handleEnterLKClick(item.owner_user_id)}>Перейти</button>
                     </td>
                    );
                  
                  break;


          default:
            content = null;
        }
        
        return (
          <td className={s.static__table__tbody__subtitleTwo} key={field}>
            {content}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>



      </table>

      </div>


      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>


        </div>

    </div>

        
        </>


    )
    
}