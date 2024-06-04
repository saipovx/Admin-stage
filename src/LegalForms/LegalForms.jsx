


import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import s from '../pages/statistics/Statistics.module.scss'
import p from '../components/Poisk.module.scss'

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import m from '../pages/statistics/Advertising/MyAdvertisingComp.module.scss';

import ExcelJS from 'exceljs';
import { useAuth } from '../AuthContext';
import Pagination from '../components/Pagination';
import Save from '../components/save';
import { Select } from 'antd';
import { FiSettings } from 'react-icons/fi';
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'


export default function LegalForms ({ handlePageChange, setcount_documents, page , count_documents}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [VenuesData, setVenuesData] = useState([])

  const { refreshToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedOptionTwo, setSelectedOptionTwo] = useState('');

  const [status , setStatus] = useState('')

  
  const handleSelectChangeTwo = (selectedOptionTwo) => {

    setSelectedOptionTwo(selectedOptionTwo);

  };

  const loadData = () => {
    
    const loginEndpoint = `/api/moderation/advertiser_info?limit=25&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${selectedOptionTwo ? `&type_person=${selectedOptionTwo}` : ''}${status ? `&status=${status}` : ''}`;

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

  }, [page, refreshToken,searchQuery, selectedOptionTwo,status]);


  const VenuesDataType = VenuesData

  console.log(VenuesDataType);


  const navigate = useNavigate()

  const navigatePush = (camp_id) => {

      const loginEndpointTwo = `/api/moderation/advertiser_info/legal_forms/`;
    
      const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
  
          axios.get(url, {
  
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }
  
          })
          
          .then(res => {

          localStorage.setItem('LegalFormsCard', JSON.stringify(res.data));
  
          navigate(`/LegalFormsCard/${camp_id}`)
  
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

  const loginEndpoint = `/api/moderation/advertiser_info?limit=${count_documents}`;
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

      // Add column headers
      const headerRow = ['Тип', 'Наименование', 'ИНН', 'Телефон', 'Страна'];
      worksheet.addRow(headerRow);

      // Add data rows
      VenuesDataType.forEach(item => {
        const dataRow = [
          item.payer_info && item.payer_info.type_person,
          item.payer_info && item.payer_info.name,
          item.payer_info && item.payer_info.inn,
          item.payer_info && item.payer_info.phone,
          item.payer_info && item.payer_info.country,
        ];
        worksheet.addRow(dataRow);
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
  


  const optionsTwo = [
    { value: '', label: 'Все' },
    { value: 'JuridicalPerson', label: 'Юр. лицо РФ' },
    { value: 'IndividualEntrepreneur', label: 'Индивидуальный предприниматель ИП РФ' },
    { value: 'PhysicalPerson', label: 'Физ. лицо РФ' },
    { value: 'InternationalJuridicalPerson', label: 'Иностранное юр. лицо' },
    { value: 'InternationalPhysicalPerson', label: 'Иностранное физ. лицо' },
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
    type: 'Тип',
    name: 'Наименование',
    bank_name: 'Контактное лицо',
    inn: 'ИНН',
    phone: 'Телефон',
    country: 'Страна',
    email: 'Почта',
    login: 'Вход в личный кабинет'

  };
  
  const [selectedFields, setSelectedFields] = useState({
    chek: true,
    type: true,
    name: true,
    bank_name: true,
    inn: true,
    phone: true,
    country: true,
    email: true,
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
  const loginEndpointTwo = `/api/moderation/advertiser_info/legal_forms/`;
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
    }, 5000);

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
              Юридические лица
              </p>

            </div>         

            </div>

        </section>

        <div className='section__staticTwo'>
          
          <div className="container">

<div className={s.static__center}>

<p className={s.static__center__title}>
Поиск по типу 
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

    </div>

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
    На модeрaции
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
        {VenuesDataType.map((item, key) => (
  <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item && item._id}>
    {Object.keys(selectedFields).map((field, index) => {
      if (selectedFields[field]) {
        return (
          <td key={index} className={s.static__table__tbody__subtitle}>
            {field === 'chek' ? (
              <input
                type="checkbox"
                checked={selectedRows.includes(item._id)}
                onChange={() => handleRowSelect(item._id)}
                className={s.static__table__thead__chek}
              />
            ) : (
              <>
                {field === 'type' && (
                  <div onClick={() => navigatePush(item._id)}>
                    {(() => {
                      const typePerson = item.payer_info && item.payer_info.type_person;
                      switch (typePerson) {
                        case "JuridicalPerson":
                          return "Юр. лицо РФ";
                        case "IndividualEntrepreneur":
                          return "Индивидуальный предприниматель РФ";
                        case "PhysicalPerson":
                          return "Физ. лицо РФ";
                        case "InternationalJuridicalPerson":
                          return "Иностранное юр. лицо";
                        case "InternationalPhysicalPerson":
                          return "Иностранное физ. лицо";
                        default:
                          return "Unknown Type";
                      }
                    })()}
                  </div>
                )}
                {field === 'name' && (item.payer_info.name ? item.payer_info.name : '-')}
                {field === 'bank_name' && (item.payer_info.bank_name ? item.payer_info.bank_name : '-')}
                {field === 'inn' && (item.payer_info.inn ? item.payer_info.inn : '-')}
                {field === 'phone' && (item.payer_info.phone ? item.payer_info.phone : '-')}
                {field === 'country' && (item.payer_info.country ? item.payer_info.country : '-')}
                {field === 'email' && (item.payer_info.email ? item.payer_info.email : '-')}
                {field === 'login' && (
                  <button key={`${item._id && item._id.$oid}-login`} className='copyBtn' onClick={() => handleEnterLKClick(item.user_id)}>Перейти</button>
                )}
              </>
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

    </div>

        
        </>


    )
    
}