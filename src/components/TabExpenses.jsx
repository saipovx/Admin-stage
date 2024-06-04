import { Link } from 'react-router-dom';
import s from '../pages/statistics/Statistics.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ExcelJS from 'exceljs';
import Save from './save';
import Pagination from './Pagination';

export default function TabExpenses({ ExpensesData, AAccountId, count_documents, handlePageChange,page }) {

  // Функция для форматирования даты
  const formatDateTime = (dateTimeString) => {
    return dateTimeString ? dateTimeString.replace('T', ' ') : '';
  };

  const token = localStorage.getItem('access_token');
  
  const apiUrl = process.env.REACT_APP_API_URL;

  const [Dubl , setDubl] = useState([])

  const { refreshToken } = useAuth();
  
  useEffect(() => {;

    const loginEndpoint = `/api/management/spend_for_user/${AAccountId}?limit=25`;

    const url = `${apiUrl}${loginEndpoint}`;

  
    axios
    
      .get(url, {
  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
  
      .then((res) => {
        
        setDubl(res.data.object)
  
      })
  
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  
  }, [refreshToken, AAccountId])

  const downloadXLSX = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Лист 1');
  
      // Add headers to the worksheet
      worksheet.addRow([
        'Тип операции',
        'Комментарий',
        'Время начала',
        'Время окончания',
        'Сумма',
      ]);
  
      // Add data from ExpensesData
      ExpensesData.forEach((item) => {
        worksheet.addRow([
          item.operation_type ? item.operation_type : 'Не указано',
          item.transaction_comment ? item.transaction_comment : 'Не указано',
          item.time_start ? formatDateTime(item.time_start) : 'Не указано',
          item.time_end ? formatDateTime(item.time_end) : 'Не указано',
          item.amount ? item.amount : 'Не указано',
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
      a.download = 'my_expenses_data.xlsx';
      a.click();
    } catch (error) {
      console.error('Ошибка при скачивании XLSX:', error);
    }
  };

  return (
    <>

      <div className={s.marginTop}></div>

      <Save  downloadXLSX={downloadXLSX} count_documents={count_documents}/>

      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>
            <th className={s.static__table__thead__title}>Тип операции</th>
            <th className={s.static__table__thead__title}>Комментарий</th>
            <th className={s.static__table__thead__title}>Время начала</th>
            <th className={s.static__table__thead__title}>Время окончания</th>
            <th className={s.static__table__thead__title}>Сумма</th>
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

          {ExpensesData.map((item) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.account_transactions_id}>
              <td className={s.static__table__tbody__subtitle}>
                {item.operation_type ? item.operation_type : 'Не указано'}
              </td>
              <td className={s.static__table__tbody__subtitle}>
                {item.transaction_comment ? item.transaction_comment : 'Не указано'}
              </td>
              <td className={s.static__table__tbody__subtitle}>
                {item.time_start ? formatDateTime(item.time_start) : 'Не указано'}
              </td>
              <td className={s.static__table__tbody__subtitle}>
                {item.time_end ? formatDateTime(item.time_end) : 'Не указано'}
              </td>
              <td className={s.static__table__tbody__subtitle}>
                {item.amount ? item.amount : 'Не указано'}
              </td>
            </tr>
          ))}

        </tbody>
      </table>

    <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

    </>
  );
}
