import { Link, useNavigate } from 'react-router-dom';
import s from '../pages/statistics/Statistics.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import ExcelJS from 'exceljs';
import Save from './save';
import Pagination from './Pagination';

export default function TabPlace ({ PlaceData , AAccountId, count_documents, page , handlePageChange}) {

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const apiUrl = process.env.REACT_APP_API_URL;

    const [Dubl , setDubl] = useState([])

    const loginEndpoint = `/api/management/site/${AAccountId}/placements?limit=${count_documents}`;
    
    const url = `${apiUrl}${loginEndpoint}`

    console.log(PlaceData);
    
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
    
    }, [refreshToken, count_documents])

    const downloadXLSX = async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
    
        // Добавляем заголовки столбцов
        worksheet.addRow([
          'Названия',
          'Ссылка',
          'Тип',
          'Описание',
          'Периодичность',
          'Стартовая цена',
        ]);
    
        // Добавляем данные из PlacementAll
        Dubl.forEach(item => {
          worksheet.addRow([
            item.type,
            item.URL,
            item.name,
            item.decsription,
            objects[item.periodicity],
            item.start_price,
          ]);
        });
    
        const blob = await workbook.xlsx.writeBuffer();
        const blobObject = new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        const blobUrl = URL.createObjectURL(blobObject);
    
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'data.xlsx';
        a.click();
      } catch (error) {
        console.error('Ошибка при скачивании XLSX:', error);
      }
    };


    let objects = {

      "once": "Единоразово",
      "daily": "Ежедневно",
      "weekly": "Еженедельно",
      "monthly": "Ежемесячно",
      "quartely": "Ежеквартально",
      
    }

  return (

    <>
    
    <div className={s.marginTop}></div>

    <Save count_documents={count_documents} downloadXLSX={downloadXLSX} style={{MarginTop : '50px !important'}} />

    <table className={s.static__table}>

<thead className={s.static__table__thead}>

  <tr>

    <th className={s.static__table__thead__titleTwo}>Название</th>
    <th className={s.static__table__thead__titleTwo}>Ссылка</th>
    <th className={s.static__table__thead__titleTwo}>Тип</th>
    <th className={s.static__table__thead__titleTwo}>Описания</th>
    <th className={s.static__table__thead__titleTwo}>Периодичность</th>
    <th className={s.static__table__thead__titleTwo}>Стартовая цена</th>
    
    
  </tr>

</thead>

<tbody className={s.static__table__tbody}>

  {PlaceData.map((item, key) => (

    <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.id}>

<td className={s.static__table__tbody__subtitle}  >

{item.type}

</td>

      <td className={s.static__table__tbody__subtitle}>

        <Link to={item.URL}>
          
        {item.URL}

        </Link>


      </td>

      <td className={s.static__table__tbody__subtitleTwo}  >
        
            {item.name} 

      </td>

      <td className={s.static__table__tbody__subtitle} >
        
        {item.decsription} 

      </td>

      <td className={s.static__table__tbody__subtitle}>
            {objects[item.periodicity]}
      </td>

      <td className={s.static__table__tbody__subtitle} >
        
        {item.start_price} 

      </td>
    
    </tr>

  ))}

</tbody>


</table>

    <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>


    </>


  );
}
