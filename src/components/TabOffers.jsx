
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'
import s from '../pages/statistics/Statistics.module.scss'
import Pagination from './Pagination'
import ExcelJS from 'exceljs';
import m from '../pages/statistics/Advertising/MyAdvertisingComp.module.scss';
import Save from './save';

export default function TabOffers ({OffersData , count_documents, page , handlePageChange, status, setStatus}) {

    const generateExcel = (data) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
      
        // Добавляем заголовки столбцов
        worksheet.addRow([
          'Статус',
          'Описание',
          'Создан',
          'Обновлено',
          'Подтверждено',
        ]);
      
        // Добавляем данные из data
        data.forEach((item) => {
          worksheet.addRow([
            item.status,
            item.description ? item.description : 'не указано',
            item.created_at,
            item.updated_at ? item.updated_at : 'Не указано',
            item.confirm_at,
          ]);
        });
      
        return workbook;
      };
      
      const downloadXLSX = async () => {
        try {
          const workbook = generateExcel(OffersData);
      
          const blob = await workbook.xlsx.writeBuffer();
          const blobObject = new Blob([blob], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
      


    return (

        
        
    <div  style={{marginTop: '30px'}}>

<Save count_documents={count_documents} downloadXLSX={downloadXLSX}  />

<div className={m.Mycomp__header} style={{marginBottom: '30px'}}>
  
  <p
    className={[m.Mycomp__header__link, !status && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('')}
  >
    Все
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'moderation' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('moderation')}
  >
    На модерации
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'pending' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('pending')}
  >
    Ожидание
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'approved' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('approved')}
  >
    Одобрено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'denied' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('denied')}
  >
    Отказано
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'cancelled' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('cancelled')}
  >
    Отменено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'ready' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('ready')}
  >
    В работе
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'checked' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('checked')}
  >
    Проверено рекламодателем
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'finished' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('finished')}
  >
    Завершено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'confirmed' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('confirmed')}
  >
    Оплачено
  </p>

  <p
    className={[m.Mycomp__header__link, status === 'dispute' && m.Mycomp__header__link__active].join(' ')}
    onClick={() => setStatus('dispute')}
  >
    Спор
  </p>
  

</div>

<hr className={m.Mycomp__header__hr}  style={{marginTop: '-31px'}}/>

<table className={s.static__table} style={{marginTop: '30px'}}> 

<thead className={s.static__table__thead}>

  <tr>

    <th className={s.static__table__thead__titleTwo}>Описание</th>
    <th className={s.static__table__thead__titleTwo}>Статус</th>
    <th className={s.static__table__thead__titleTwo}>Дата бронирования</th>
    <th className={s.static__table__thead__titleTwo}>Создано</th>
    <th className={s.static__table__thead__titleTwo}>Подтверждено</th>
    
  </tr>

</thead>

<tbody className={s.static__table__tbody}>

{OffersData.map((item, key) => (

    <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id.$oid}>

<td className={s.static__table__tbody__subtitleTwo}  >
        
        {item.description ? item.description : 'не указано'  } 

     </td>

     <td className={s.static__table__tbody__subtitleTwo}>
  {item.status === "moderation" && "На модерации"}
  {item.status === "pending" && "Ожидание"}
  {item.status === "approved" && "Одобрено"}
  {item.status === "denied" && "Отказано"}
  {item.status === "cancelled" && "Отменено"}
  {item.status === "ready" && "В работе"}
  {item.status === "checked" && "Проверено рекламодателем"}
  {item.status === "finished" && "Завершено"}
  {item.status === "confirmed" && "Оплачено"}
  {item.status === "dispute" && "Спор"}
</td>

<td className={s.static__table__tbody__subtitle}>
  {item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Не указано'}
</td>

     <td className={s.static__table__tbody__subtitle}>
  {item.created_at ? new Date(item.created_at).toLocaleString() : 'Не указано'}
</td>


      <td className={s.static__table__tbody__subtitle} >
        
        {item.confirm_at} 

      </td>
    

    </tr>

  ))}

</tbody>


</table>

<Pagination page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

    </div>

    )
}