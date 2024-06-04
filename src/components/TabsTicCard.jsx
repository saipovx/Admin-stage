import i from '../pages/statistics/InternalPage/InternalPage.module.scss'

export default function TabTicCard ({...info}) {
    return (
        
    <div className={i.applec__item}>
                            
        <p className={i.applec__item__title}>
           {info && info.title}
        </p>

        <p className={i.applec__item__subtitle}>
            {info && info.number}
        </p>

        <p className={i.applec__item__subtitle}>
            {info && info.status}
        </p>

    </div>

    )
}