
import { useEffect, useState } from 'react';
import s from '../pages/statistics/Statistics.module.scss'
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import m from '../pages/statistics/Advertising/MyAdvertisingComp.module.scss'
import { Link } from 'react-router-dom';
import Save from './save';
import ExcelJS from 'exceljs';
import Pagination from './Pagination';
import { utils, writeFile } from 'xlsx';

export default function TabCompaing ({handlePageChange, setcount_documents, page , count_documents, AdvertisingData, AAccountId }) {

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const [startDate, setStartDate] = useState(''); 
  
    const [endDate, setEndDate] = useState('');
  
    const [infoStatic, setinfoStatic ] = useState([])

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

  
  
      const navigate = useNavigate()
  
      const navigatePush = (camp_id) => {
  
          const loginEndpointTwo = `/api/moderation/campaigns/`;
        
          const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
      
              axios.get(url, {
      
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` 
                  }
      
              })
              
              .then(res => {
  
                localStorage.setItem('campData', JSON.stringify(res.data));
      
                navigate(`/InternalPage/${camp_id}`)
      
              })
      
              .catch(error => {
      
                if (error.response && error.response.status === 401) {
      
                  refreshToken();
      
                } else {
                  
                }
                  
              });
      
      }
  
      const formatDateTime = (dateTimeString) => {
        return dateTimeString ? dateTimeString.replace('T', ' ') : '';
      };

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
      
  
const AdvertisingDataType = AdvertisingData

console.log(AdvertisingDataType);

// const [logoData, setLogoData] = useState({});

// const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

// useEffect(() => {

//   const fetchData = async () => {
    
//     const newLogoData = {};

//     for (const item of AdvertisingDataType) {
      
//       const document_type = '/logos';

//       const document_id = `/${item.site.logo.$oid}`;

//       const url = `https://i-stage.qrooto.com${document_type}${document_id}`;

//       try {

//         const response = await axios.get(url, {

//           responseType: 'arraybuffer', // Укажите responseType как 'arraybuffer'
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const blob = new Blob([response.data], { type: 'image/png' });
//         const imageUrl = URL.createObjectURL(blob);

//         newLogoData[item.site.logo.$oid] = imageUrl;

//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           refreshToken();
//         } else {
//           // Обработка других ошибок
//         }
//       }
//     }

//     setLogoData(newLogoData);

//     setIsLogoDataLoaded(true);
//   };

//   fetchData();

// }, [AdvertisingDataType, token]);
      

    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/management/campaigns_for_user/${AAccountId}?limit=${count_documents}`;
    
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
    
    const downloadXLSX = () => {
      try {
        const headers = [
          'Тип операции',
          'Комментарий',
          'Сумма',
          'Время начала',
          'Время окончания',
          'Затраты',
          'Показы',
          'Количество кликов',
          'CPC',
          'CPM',
          'CTR',
          'Доход',
        ];
    
        const data = AdvertisingDataType.map((info) => {
          const matchingData = Array.isArray(infoStatic)
            ? infoStatic.find((item) => item.campaign_id === info.campaign_id)
            : null;
    
          return [
            info.operation_type,
            info.transaction_comment || 'Не указано',
            info.amount || 'Не указано',
            info.time_start ? formatDateTime(info.time_start) : 'Не указано',
            info.time_end ? formatDateTime(info.time_end) : 'Не указано',
            matchingData ? matchingData.expenses : "Не указано",
            matchingData ? matchingData.display_count : "Не указано",
            matchingData ? matchingData.click_count : "Не указано",
            matchingData ? matchingData.cpc : "Не указано",
            matchingData ? matchingData.cpm : "Не указано",
            matchingData ? (matchingData.ctr * 100).toFixed(2) : 'Не указано',
            matchingData ? matchingData.revenue : "Не указано",
          ];
        });
    
        const worksheet = utils.json_to_sheet([headers, ...data]);
        const workbook = utils.book_new();
    
        utils.book_append_sheet(workbook, worksheet, 'Лист 1');
    
        writeFile(workbook, 'my_advertising_data.xlsx');
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

    for (const item of AdvertisingDataType) {
      
      const document_type = '/logos';
      const document_id = `/${item.logo}`;

      const url = `${LogoUrl}${document_type}${document_id}`;

      try {

        const response = await axios.get(url, {

          responseType: 'arraybuffer', // Укажите responseType как 'arraybuffer'
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        newLogoData[item.logo] = imageUrl;

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

}, [AdvertisingDataType, token]);

console.log(AdvertisingDataType);


    return (

    <>
        <div className={s.marginTop}></div>

        <Save count_documents={count_documents} downloadXLSX={downloadXLSX} style={{MarginTop : '50px !important'}} />
    
      <table className={s.static__table} id={m.table}>

        <thead className={s.static__table__thead}>

          <tr>
            <th className={s.static__table__thead__title}>Заголовок</th> 
            <th className={s.static__table__thead__title}>Имя</th> 
            <th className={s.static__table__thead__title}>Ссылка</th> 
            <th className={s.static__table__thead__title}>Сегмент</th> 
            <th className={s.static__table__thead__title}>max cpc</th> 
            <th className={s.static__table__thead__title}>Затраты</th>
            <th className={s.static__table__thead__title}>Показы</th> 
            <th className={s.static__table__thead__title}>Количество кликов</th>
            <th className={s.static__table__thead__title}>CPC</th>
            <th className={s.static__table__thead__title}>CPM</th> 
            <th className={s.static__table__thead__titleTwo}>CTR</th>
            <th className={s.static__table__thead__title}>Доход</th> 
          </tr>

        </thead>

<tbody className={s.static__table__tbody}>

  {AdvertisingDataType.map((info) => {

    const matchingData = Array.isArray(infoStatic)
      ? infoStatic.find((item) => item.campaign_id === info._id)
      : null;

    return (

      <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={info._id}>

      <td className={s.static__table__tbody__subtitleTwo} onClick={() => navigatePush(info._id)}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>

        {isLogoDataLoaded && logoData[info.logo && info.logo] ? (
  
  <>
  <img src={logoData[info.logo]} style={{ width: '60px' }} alt={info.title} />
</>

) : (
 <p>Loading...</p>
)}

          <span>{info.title}</span>

        </div>

      </td>

      <td className={s.static__table__tbody__subtitle} >

        {info.name ? info.name : 'Не указано'}

      </td>
      
      <td className={s.static__table__tbody__subtitle} >

           <Link to={info.URL}>
             
           {info.URL ? info.URL : 'Не указано'}

           </Link>

     </td>

              <td className={s.static__table__tbody__subtitle}>
                {info.segment ? info.segment.join(', ') : 'Не указано'}
              </td>
              <td className={s.static__table__tbody__subtitle}>
                {info.max_cpc ? info.max_cpc : 'Не указано'}
              </td>

      <td className={s.static__table__tbody__subtitle}>
        {matchingData ? matchingData.expenses : "Не указано"}
      </td>

      <td className={s.static__table__tbody__subtitle}>
        {matchingData ? matchingData.display_count : "Не указано"}

      </td>

      <td className={s.static__table__tbody__subtitle}>
      {matchingData ? matchingData.click_count : "Не указано"}
      </td>

      <td className={s.static__table__tbody__subtitle}>
      {matchingData ? matchingData.cpc : "Не указано"}
      </td>

      <td className={s.static__table__tbody__subtitle}>
      {matchingData ? matchingData.cpm : "Не указано"}
      </td>

      <td className={s.static__table__tbody__subtitle}>
        {matchingData ? (matchingData.ctr * 100).toFixed(2) : 'Не указано'}
      </td>

      <td className={s.static__table__tbody__subtitle}>
      {matchingData ? matchingData.revenue : "Не указано"}
      </td>


    </tr>
    )
  })}

</tbody>

      </table>

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

    </>    
        

    )
}