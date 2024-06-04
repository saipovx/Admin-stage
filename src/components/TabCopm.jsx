import { Link, useNavigate } from 'react-router-dom';
import s from '../pages/statistics/Statistics.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import ExcelJS from 'exceljs';
import Save from './save';
import Pagination from './Pagination';

export default function TabCopm ({ CopmData , AAccountId, count_documents, page , handlePageChange}) {

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const apiUrl = process.env.REACT_APP_API_URL;

    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/management/site/${AAccountId}/campaigns?limit=${count_documents}`;
    
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
    
    }, [refreshToken,count_documents])

    const downloadXLSX = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
    
        // Add headers to the worksheet
        worksheet.addRow([
          'Название',
          'О бренде',
          'Задача',
          'Сегмент',
          'Статус',
          'Модель',
          'Темы',
        ]);
    
        // Add data from CopmData
        Dubl.forEach((item) => {
          worksheet.addRow([
            item.title,
            item.about_brand,
            item.task,
            item.segment,
            item.status,
            item.model,
            item.themes && item.themes.join(', '),
          ]);
        });
    
        // Generate and download the XLSX file
        const blob = await workbook.xlsx.writeBuffer();
        const blobObject = new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        const blobUrl = URL.createObjectURL(blobObject);
    
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'campaign_data.xlsx';
        a.click();
      } catch (error) {
        console.error('Ошибка при скачивании XLSX:', error);
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

  return (

    <>
    
    <div className={s.marginTop}></div>

    <Save count_documents={count_documents} downloadXLSX={downloadXLSX} style={{MarginTop : '50px !important'}} />

    <table className={s.static__table}>

      <thead className={s.static__table__thead}>

        <tr>
          <th className={s.static__table__thead__titleTwo}>Название</th>
          <th className={s.static__table__thead__titleTwo}>О бренде</th>
          <th className={s.static__table__thead__titleTwo}>Задача</th>
          <th className={s.static__table__thead__titleTwo}>Сегмент</th>
          <th className={s.static__table__thead__titleTwo}>Статус</th>
          <th className={s.static__table__thead__titleTwo}>Модель</th>
          <th className={s.static__table__thead__titleTwo}>Темы</th>
        </tr>

      </thead>

      <tbody className={s.static__table__tbody}>

        {CopmData.map((item) => (

          <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id.$oid}>

            <td className={s.static__table__tbody__subtitleTwo} onClick={() => navigatePush(item._id.$oid)} >{item.title}</td>

            <td className={s.static__table__tbody__title}>{item.about_brand}</td>

            <td className={s.static__table__tbody__subtitle}>{item.task}</td>

            <td className={s.static__table__tbody__subtitle}>{item.segment}</td>

            <td className={s.static__table__tbody__subtitle}>
                 <p className={s.static__table__tbody__status} style={getStatusStyle(item.status)} >{item.status}</p>
            </td>

            <td className={s.static__table__tbody__subtitle}>{item.model}</td>

            <td className={s.static__table__tbody__subtitle}>{item.themes && item.themes.join(', ')}</td>

          </tr>

        ))}

      </tbody>
    </table>

    <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>


    </>


  );
}
