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
import { CiSaveDown1 } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';


export default function Payments ({ handlePageChange, setcount_documents, page , count_documents}) {

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
      
      const loginEndpoint = `/api/payments/all?limit=25&page=${page}`;
  
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
        'Номер документа',
        'Создан',
        'Платильщик',
        'Сумма',
        'Статус',
      ]);
  
      // Add data from VenuesData
      VenuesData.forEach(item => {
        worksheet.addRow([
          item.transaction_number || 'Не указано',
          item.created_at ? item.created_at.split('T')[0] : 'Не указано',
          item.legal_data.name || 'Не указано',
          item.amount ? `${item.amount} ₽` : 'Не указано',
          item.status || 'Не указано',
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

const navigate = useNavigate()

const navigatePush = (id) => {
    window.open(`${apiUrl}/ManagerOne/${id}`, '_blank');
}

const translations = {
  transaction_number: 'Номер документа',
  created_at: 'Создан',
  legalName: 'Плательщик',
  amount: 'Сумма',
  status: 'Статус'
};

const [selectedFields, setSelectedFields] = useState({
  transaction_number: true,
  created_at: true,
  legalName: true,
  amount: true,
  status: true
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
              Счета рекламодателям
              </p>

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

      {/* <hr className={m.Mycomp__header__hr}  style={{marginTop: '-31px'}}/> */}

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
      {Object.entries(selectedFields).map(([field, isSelected]) => {
        if (isSelected) {
          switch (field) {
            case 'transaction_number':
              return (
                <td key={`${item._id}_${field}`} className={s.static__table__tbody__subtitle}>
                  {item.transaction_number ? item.transaction_number : 'Не указано'}
                </td>
              );
            case 'created_at':
              return (
                <td key={`${item._id}_${field}`} className={s.static__table__tbody__subtitle}>
                  {item.created_at ? item.created_at.split('T')[0] : 'Не указано'}
                </td>
              );
            case 'legalName':
              return (
                <td key={`${item._id}_${field}`} className={s.static__table__tbody__subtitle}>
                  {item.legal_data.name ? item.legal_data.name : 'Не указано'}
                </td>
              );
            case 'amount':
              return (
                <td key={`${item._id}_${field}`} className={s.static__table__tbody__subtitle}>
                  {item.amount ? `${item.amount} ₽` : 'Не указано'}
                </td>
              );
            case 'status':
              return (
                <td key={`${item._id}_${field}`} className={s.static__table__tbody__subtitle}>
                  {item.status ? item.status : 'Не указано'}
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

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>


        </div>

    </div>


        </>


    )
}