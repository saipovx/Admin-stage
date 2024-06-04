import Pagination from "./Pagination";
import Save from "./save";
import s from '../pages/statistics/Statistics.module.scss'
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import LImg from './img/links.svg'
import ExcelJS from 'exceljs';


export default function TabSites({ count_documents, spend, page, handlePageChange, AAccountId }) {

  const [infoStatic, setinfoStatic] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { refreshToken } = useAuth();
  const token = localStorage.getItem('access_token');
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchWeeklyStatistics = async () => {

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDateString = startOfMonth.toISOString().split('T')[0];
    const endDateString = endOfMonth.toISOString().split('T')[0];

    setStartDate(startDateString);
    setEndDate(endDateString);

    if (token && startDateString && endDateString) {
      try {
        const urlTwo = `${apiUrl}/api/statistic/by_site`;

        const response = await axios.get(urlTwo, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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

  const navigatePush = (camp_id) => {

    const loginEndpointTwo = `/api/moderation/sites/`;
    const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.setItem('InternalPageVenues', JSON.stringify(res.data));
        navigate(`/InternalPageVenuesAll/${camp_id}`);
      })
      .catch((error) => {

        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

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


  const [Dubl, setDubl] = useState([])

  const loginEndpoint = `/api/management/sites_for_user/${AAccountId}?limit=${count_documents}`;

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

  }, [refreshToken, count_documents])


  const downloadXLSX = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');

      worksheet.addRow([
        'Заголовок',
        'Сайт',
        'Ссылка',
        'Стaтус',
        'Сегмент',
        'Затраты',
        'Показы',
        'Количество кликов',
        'CPC',
        'CPM',
        'CTR',
        'Доход',
      ]);

      Dubl.forEach((item) => {
        const matchingData = Array.isArray(infoStatic)
          ? infoStatic.find((info) => info.site_id === item._id.$oid)
          : null;

        // Check if item.campaign is defined before accessing item.campaign.segment
        const segment = item.campaign && item.campaign.segment ? item.campaign.segment.join(', ') : '';
        // const segment = item.campaign && item.campaign.segment;

        worksheet.addRow([
          item.name,
          item.status,
          item.URL,
          segment,
          matchingData ? matchingData.expenses : '',
          matchingData ? matchingData.display_count : '',
          matchingData ? matchingData.click_count : '',
          matchingData ? matchingData.cpc : '',
          matchingData ? matchingData.cpm : '',
          matchingData ? (matchingData.ctr * 100).toFixed(2) : '',
          matchingData ? matchingData.revenue : '',
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
      for (const item of spend) {
        const url = `${LogoUrl}/logos/${item.logo}`;
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
  
          // Преобразование ArrayBuffer в base64 строку
          const base64String = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
  
          // Формирование base64 URL
          const imageUrl = `data:image/png;base64,${base64String}`;
          
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
  }, [spend, token]);
  
  return (

    <>

      <div className={s.marginTop}></div>

      <Save count_documents={count_documents} downloadXLSX={downloadXLSX} style={{ MarginTop: '50px !important' }} />

      <table className={s.static__table} >

        <thead className={s.static__table__thead}>

          <tr>
            <th className={s.static__table__thead__title}>Заголовок</th>
            <th className={s.static__table__thead__title}>Ссылка</th>
            <th className={s.static__table__thead__titleTwo}>Сегмент</th>
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

          {spend.map((item) => {

            const matchingData = Array.isArray(infoStatic)
              ? infoStatic.find((info) => info.site_id === item._id)
              : null;

            return (

              <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id}>

                <td className={s.static__table__tbody__subtitleTwo} onClick={() => navigatePush(item._id)}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>

                    {isLogoDataLoaded && logoData[item.logo && item.logo] ? (

                      <img src={logoData[item.logo && item.logo]} style={{ width: '60px' }} alt={''} />

                    ) : (

                      <div
                        style={{
                          width: '100px',
                          height: '60px',
                          backgroundColor: '#eee',
                          animation: 'blinking 1s infinite',
                        }}
                      >
                      </div>

                    )}

                    <span>{item.name}</span>

                    {item.my && <img src={LImg} width={'20px'} alt="" />}

                  </div>

                </td>

                <td className={s.static__table__tbody__subtitleTwo}  >

                  <Link to={item && item.URL}>

                    {item && item.URL}

                  </Link>

                </td>


                <td className={s.static__table__tbody__subtitle} >

                  {item.segment.join(', ')}

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

      <Pagination page={page} handlePageChange={handlePageChange} count_documents={count_documents} />

    </>

  )

}