import PlacementCard from '../Placement/PlacementCard'
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'
import TabOffersCard from './TabsOffersCard'
import TabTicCard from './TabsTicCard';

export default function TabTics ({TicData}) {
    return (
        
    <div className={i.applec} style={{marginTop: '30px'}}>

        {TicData.length > 0 ? (
            TicData.map((info, index) => {
                return <TabTicCard {...info} index={index} />
            })
        ) : (
            <p className={i.inter__info__flex__item__arr__title}>Нет пока тикетов</p>
        )}

    </div>

    )
}