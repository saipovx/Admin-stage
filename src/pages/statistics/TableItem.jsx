import s from './Statistics.module.scss'
import setbar from './img/setbar.svg'
import array from './img/array.svg'


export default function  TableItem ({...info}) {

    return(

        <>
        
        <label className={s.static__punkt__item__label}>
            
            <img src={setbar} alt="" className={s.static__punkt__item__label__grap}/>

            <input type="checkbox" className={s.static__punkt__item__label__checkbox} />

            <p className={s.static__punkt__item__label__title}>{info.title}</p>

            <img src={array} className={s.static__punkt__item__label__der} alt="" />

          </label>

        </>

    )
    
}