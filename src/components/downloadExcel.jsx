import s from '../pages/statistics/Statistics.module.scss'

export default function DownloadExcelJSX ({downloadExcel}) {
    return (
        
        <>
        
        <button className={s.downloadExcel} onClick={downloadExcel} >Скачать</button>

        </>


    )
}