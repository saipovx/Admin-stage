import { Link } from 'react-router-dom';
import s from '../pages/statistics/Statistics.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import ExcelJS from 'exceljs';
import Save from './save';
import Pagination from './Pagination';

export default function TabSpaces({ SpacesData , AAccountId, count_documents, page , handlePageChange}) {

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const apiUrl = process.env.REACT_APP_API_URL;

    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/management/site/${AAccountId}/ads_spaces?limit=${count_documents}`;
    
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
            'Текст',
            'Ссылка',
          ]);
    
          // Add data from ExpensesData
          Dubl.forEach((item) => {
            worksheet.addRow([
              item.title,
              item.text,
              item.link,
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
          a.download = 'my_Incnome_data.xlsx';
          a.click();

        } catch (error) {
          console.error('Ошибка при скачивании XLSX:', error);
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
          <th className={s.static__table__thead__titleTwo}>Текст</th>
          <th className={s.static__table__thead__titleTwo}>Ссылка</th>
        </tr>

      </thead>

      <tbody className={s.static__table__tbody}>

        {SpacesData.map((item) => (

          <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} >

            <td className={s.static__table__tbody__title}>{item.title}</td>

            <td className={s.static__table__tbody__subtitle}>{item.text}</td>

            <td className={s.static__table__tbody__subtitleTwo}>

              <Link to={item.link} target="_blank">
                {item.link}
              </Link>

            </td>
          </tr>

        ))}

      </tbody>
    </table>

    <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>


    </>


  );
}
