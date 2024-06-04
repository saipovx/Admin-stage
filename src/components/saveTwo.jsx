
import s from '../pages/statistics/Statistics.module.scss'

export default function SaveTwo ({
    
    count_documentsTwo,
    downloadXLSXTwo

}) {

    return (

    <div className={s.save}>

        <p className={s.count}>Всего {count_documentsTwo} записей</p>
  
        <button className={s.save__btn} onClick={downloadXLSXTwo}>
          Скачать
        </button>
  
    </div>

    ) 
}