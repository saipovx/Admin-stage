
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import s from '../statistics/Statistics.module.scss'
import Select from 'react-select';
import { saveAs } from 'file-saver';
import P from '../../components/Poisk.module.scss'
import setting__title from '../statistics/img/setting__title.svg'
import TableItem from '../statistics/TableItem';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import Pagination from '../../components/Pagination';
import ExcelJS from 'exceljs';
import Save from '../../components/save';
import { FiSettings } from 'react-icons/fi';

export default function Manager ({handlePageChange, setcount_documents, page , count_documents}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [AuctionData, setAuctionData] = useState([])

  const { refreshToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const loadData = () => {

    const loginEndpoint = `/api/management/users?limit=25&page=${page}&search=${searchQuery}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      .then((res) => {
        
        setAuctionData(res.data.objects)
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

  }, [page, refreshToken,searchQuery]);


  const AuctionDataType = AuctionData

  const navigate = useNavigate()

  const navigatePushManager = (camp_id) => {

      const loginEndpointTwo = `/api/management/users/`;
    
      const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
  
          axios.get(url, {
  
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }
  
          })
          
          .then(res => {
  
          localStorage.setItem('ManagerOne', JSON.stringify(res.data));
  
          navigate(`/ManagerOne/${camp_id}`)
  
          })
  
          .catch(error => {
  
            if (error.response && error.response.status === 401) {
  
              refreshToken();
  
            } else {
              
            }
              
          });
  
  }


    const [selectedOptionTwo, setSelectedOptionTwo] = useState(null); 

    const handleSelectChangeTwo = (selectedOptionTwo) => {

      setSelectedOptionTwo(selectedOptionTwo);

    };

    const [showContent, setShowContent] = useState(false);

    const MouseHandle = () => {
      setShowContent(!showContent)
    }

    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/management/users?limit=${count_documents}`;

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
  
        // Добавьте данные в лист, например:
        worksheet.addRow(['Имя', 'Почта', 'Номер']);

        Dubl.forEach(item => {
          worksheet.addRow([item.name, item.email, item.phone]);
        });
  
        const blob = await workbook.xlsx.writeBuffer();
        const blobObject = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
        const blobUrl = URL.createObjectURL(blobObject);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'data.xlsx';
        a.click();

      } catch (error) {
        console.error('Ошибка при скачивании XLSX:', error);
      }

    };

    const EnterLKLogic = (user_id) => {

      const loginEndpoint = `/api/management/users/${user_id}/redirect`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      window.open(url, '_blank');
    
    };

    const handleEnterLKClick = (user_id) => {
    
      EnterLKLogic(user_id);
  
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

   console.log(AuctionDataType);

   const translations = {
    name: 'Имя',
    email: 'Почта',
    phone: 'Номер',
    created_at: 'Дата регистрации',
    login: 'Вход в личный кабинет'
  };
  
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    phone: true,
    created_at: true,
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
  
  

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

              <div className={s.static__title}>

               <p className={s.static__title__p}>
               Все пользователи
               </p>
                
                <div className= { showContent ? [s.static__title__fon ,s.static__title__fon__active].join(' ') : [s.static__title__fon]} onClick={MouseHandle}>

                <img src={setting__title} className= { showContent ? [s.static__title__svg ,s.static__title__svg__active].join(' ') : [s.static__title__svg] } alt="svg"/>

                </div>


              </div>

            </div>

        </section>

        <div className='section__staticTwo'>
          
        <div className="container">

        <div className={P.app}>
              
              <p className={P.app__title}>
              Поиск
              </p>

              <input type="text" className={P.app__input} placeholder=''
              value={searchQuery} onChange={handleSearchChange}/>

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
                <th key={index} className={`${s.static__table__thead__titleTwo} ${field === 'number' || field === 'login' ? s.static__table__thead__title : ''}`}>
                  {translations[field]}
                </th>
              );
            }
            return null;
          })}

          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>
  {AuctionDataType.map((item) => (
    <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id && item._id.$oid}>
      {Object.entries(selectedFields).map(([field, isSelected]) => {
        if (isSelected) {
          switch (field) {
            case 'name':
              return (
                <td key={`${item._id && item._id.$oid}-name`} className={s.static__table__tbody__subtitleTwo} onClick={() => navigatePushManager(item._id.$oid)}>
                  {item.name ? item.name : 'не указано'}
                </td>
              );
            case 'email':
              return (
                <td key={`${item._id && item._id.$oid}-email`} className={s.static__table__tbody__subtitle}>
                  {item.email ? item.email : 'не указано'}
                </td>
              );
            case 'phone':
              return (
                <td key={`${item._id && item._id.$oid}-phone`} className={s.static__table__tbody__subtitle}>
                  {item.phone ? `+${item.phone}` : 'не указано'}
                </td>
              );

              case 'created_at':
                return (
                  <td key={`${item._id && item._id.$oid}-created_at`} className={s.static__table__tbody__subtitle}>
                    {item.created_at ? new Date(item.created_at.$date).toLocaleString(): 'не указано'}
                  </td>
                );

            case 'login':
              return (
                <td key={`${item._id && item._id.$oid}-login`} className={s.static__table__tbody__subtitle}>
                  <button className='copyBtn' onClick={() => handleEnterLKClick(item._id.$oid)}>Перейти</button>
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


      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents} />

        </div>

    </div>

        
        </>


    )
    
}