import a from '../Admin/Admin.module.scss'


export default function InvitationCard ({isSelected, onCheckboxChange , ...info }) {


    return (

    <label className={a.invitation__label} id={info.code}>
                        
        <input type="checkbox" checked={isSelected} onChange={() => onCheckboxChange(info.code)} />

        <div className={a.invitation__label__info}>
            
            <p className={a.invitation__label__info__title}>{info.name}</p>

            <p className={a.invitation__label__info__subtitle}>{info.description}</p>

        </div>

    </label>
        
    )

}