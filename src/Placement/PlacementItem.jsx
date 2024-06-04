import { useState } from 'react';
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'


export default function PlacementItem ({...info}) {

    return (
        
    <div className={i.inter__info__flex__item__footer}>

        <p className={i.inter__info__flex__item__footer__title}>Описания : {info.description}</p>

        <p className={i.inter__info__flex__item__footer__title}>
            Статус : {info.status}
        </p>

        <div className={i.inter__info__flex__item__footer__flex}>
            
            {/* {File} */}

        </div>

    </div>

    )
}