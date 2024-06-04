import { Link, useLocation, useNavigate } from 'react-router-dom';
import fon from './img/fon.png'
import m from './Moderation.module.scss'


export default function ModerationCard ({...info}) {

    const navigate = useNavigate()

    const location = useLocation()

    const navigPushModer = () => {
        
        localStorage.setItem('ModerInfo', JSON.stringify(info));
  
        navigate(`/InternalModer/${info._id.$oid}`);

    }

    const navigPushMeModer = () => {
        
        localStorage.setItem('ModerInfo', JSON.stringify(info));
  
        navigate(`/InternalMeModer/${info._id.$oid}`);

    }

    return (
        
    <div className={m.moderation__item} id={info._id.$oid} onClick={location.pathname === '/MeModeration' ? () => navigPushMeModer(info) : () => navigPushModer(info)}>
                    
        <p className={m.moderation__item__title}>
        {info.title}
        </p>

        <div className={m.moderation__item__flex}>
            
            <div className={m.moderation__item__flex__item}>
                
                <p className={m.moderation__item__flex__item__title}>
                {info.about_brand}
                </p>

                <p className={m.moderation__item__flex__item__title}>
                Бюджет: {info.cpc_budget}
                </p>

            </div>

            <img src={fon} className={m.moderation__item__flex__img} alt="img" />

        </div>

    </div>

    )

}