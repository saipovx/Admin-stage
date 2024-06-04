
import s from '../pages/statistics/Statistics.module.scss'

export default function Save ({
    
    count_documents,
    downloadXLSX

}) {

    return (

    <div className={s.save}>

        <p className={s.count}>Всего {count_documents} записей</p>
  
        <button className={s.save__btn} onClick={downloadXLSX}>
          Скачать
        </button>
  
    </div>

    ) 
}