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
import { FiSettings } from 'react-icons/fi';

export default function Acts ({ handlePageChange, setcount_documents, page , count_documents}) {

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
      
      const loginEndpoint = `/api/acts/all?limit=25&page=${page}`;
  
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
        'Продавец',
        'Покупатель',
        'Сумма',
        'ИНН продавца'
      ]);
  
      // Add data from VenuesData
      VenuesData.forEach(item => {
        worksheet.addRow([
          item.document_number || 'Не указано',
          item.created_at ? item.created_at.split('T')[0] : 'Не указано',
          item.seller.name || 'Не указано',
          item.buyer.name || 'Не указано',
          item.vat ? `${item.vat} ₽` : 'Не указано',
          item.seller.inn || 'Не указано'
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

const LkUrl = process.env.REACT_APP_API_URL_LK;

const downloadFile = (id) => {
    window.open(`${LkUrl}/lk_api/documents/act/${id}`, '_blank');
}

const translations = {
  documentNumber: 'Номер документа',
  created: 'Создан',
  seller: 'Продавец',
  sellerINN: 'ИНН продавца',
  buyer: 'Покупатель',
  buyerINN: 'ИНН покупателя',
  amount: 'Сумма'
};

const [selectedFields, setSelectedFields] = useState({
  documentNumber: true,
  created: true,
  seller: true,
  sellerINN: true,
  buyer: true,
  buyerINN: true,
  amount: true
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
              Акты
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
            case 'documentNumber':
              return (
                <td key={`${item._id}-documentNumber`} className={s.static__table__tbody__subtitle} id={item._id} onClick={() => downloadFile(item.document_number)}>
                  <CiSaveDown1 size={18} />
                  {item.document_number ? item.document_number : 'Не указано'}
                </td>
              );
            case 'created':
              return (
                <td key={`${item._id}-created`} className={s.static__table__tbody__subtitle}>
                  {item.created_at ? item.created_at.split('T')[0] : 'Не указано'}
                </td>
              );
            case 'seller':
              return (
                <td key={`${item._id}-seller`} className={s.static__table__tbody__subtitle}>
                  {item.seller.name ? item.seller.name : 'не указано'}
                </td>
              );
            case 'sellerINN':
              return (
                <td key={`${item._id}-sellerINN`} className={s.static__table__tbody__subtitle}>
                  {item.seller.inn ? item.seller.inn : 'не указано'}
                </td>
              );
            case 'buyer':
              return (
                <td key={`${item._id}-buyer`} className={s.static__table__tbody__subtitle}>
                  {item.buyer.name ? item.buyer.name : 'Не указано'}
                </td>
              );
            case 'buyerINN':
              return (
                <td key={`${item._id}-buyerINN`} className={s.static__table__tbody__subtitle}>
                  {item.buyer.inn ? item.buyer.inn : 'не указано'}
                </td>
              );
            case 'amount':
              return (
                <td key={`${item._id}-amount`} className={s.static__table__tbody__subtitle}>
                  {item.vat ? `${item.vat} ₽` : 'Не указано'}
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