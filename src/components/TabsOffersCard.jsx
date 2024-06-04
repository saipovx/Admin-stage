import i from '../pages/statistics/InternalPage/InternalPage.module.scss'

export default function TabOffersCard ({...info}) {
    return (
        
    <div className={i.applec__item}>
                            
        <p className={i.applec__item__title}>
           {info && info.status}
        </p>

        <p className={i.applec__item__subtitle}>
            {info && info.description}
        </p>

    </div>

    )
}