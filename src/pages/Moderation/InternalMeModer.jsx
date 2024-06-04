
import i from '../statistics/InternalPage/InternalPage.module.scss'
import navig from '../statistics/InternalPage/Group.svg'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../AuthContext'
import { Link } from 'react-router-dom'
import s from '../statistics/Statistics.module.scss'
import { FaCopy } from "react-icons/fa";

export default function InternalMeModer () {
    
    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {

      navigate(-1)

    }

    const [selectedOption, setSelectedOption] = useState("verified"); 

    const handleOptionChange = (event) => {

        const optionValue = event.target.value;
        setSelectedOption(optionValue); 

      };

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    const [Comment, setComment] = useState('');

    const [ success, setsuccess] = useState(false);

    const [storedCampIdDataTwo, setStoredCampIdDataTwo] = useState([]);


    useEffect(() => {

        const data = localStorage.getItem('ModerInfo');
        
        if (data) {
          setStoredCampIdData(JSON.parse(data));
          
        }

        const dataTwo = localStorage.getItem('campData');
        
        if (dataTwo) {
          setStoredCampIdDataTwo(JSON.parse(dataTwo));
          
        }
        
      }, []);

      console.log(storedCampIdData);

      const TableInfoAds = storedCampIdData.ads

      const data = {
    
        status: selectedOption,
        comment: Comment,

    };

      const urlAu = window.location.href;

      const campaignIdFromURL = urlAu.substring(urlAu.lastIndexOf('/') + 1);

      const moderMePush = (campaignIdFromURL) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/moderation/campaigns/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${campaignIdFromURL}`;
    
        axios.patch(url, data , {
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })
            
            .then(res => {

                if (res.status === 204) {

                    setsuccess(true)

                }
    
            })
    
            .catch(error => {
              if (error.response) {
                const status = error.response.status;
                const detail = error.response.data.detail;
          
                switch (status) {
                  case 400:
                  case 409:
                  case 404:
                  case 401:
                    alert(`Error ${status}: ${detail}`);
                    break;
                  default:
                    // handle other errors if needed
                    break;
                }
              } else {
                // handle non-response errors
              }
          
              if (error.response && error.response.status === 401) {
                refreshToken();
              }
      });
    
      }

  const textRef = React.useRef(null);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = storedCampIdData._id.$oid;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000); 

  };

  const Moderation = storedCampIdData && storedCampIdData.moderator

  function formatDate(dateTimeString) {
   const date = new Date(dateTimeString);
   const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
   return formattedDate;
 }
 
 function padZero(num) {
   return num < 10 ? `0${num}` : num;
 }
    
    return (
        
        <>
        
        <section className={i.section__internal}>
            
            <div className="container">
                
               <div className={i.inter}>
                
                <div className={i.inter__box} onClick={navigatePush}>
                    <img src={navig} alt="svg" />
                </div>

                <div className={i.inter__info}>

                    <p className={i.inter__info__title}>
                        {storedCampIdData.title}
                    </p>

                    <div className={i.inter__info__hr}></div>

                    <div className={i.inter__info__flex}>
                        
                        <div className={i.inter__info__flex__item}>
                            
                            <p className={i.inter__info__flex__item__title}>
                            Основная информация
                            </p>

                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                О бренде
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.about_brand ? storedCampIdData.about_brand : 'Не указано'}
                                </p>

                            </div>

                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Сегмент
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.segment && storedCampIdData.segment.join(', ')}
                                </p>

                            </div>

                             <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Интересы
                                </p>
     

<div className={i.inter__info__flex__item__arr__border}>

    {storedCampIdData && storedCampIdData.interests && (
        storedCampIdData.interests.map((item, index) => (
            <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                {item}
            </p>
        ))
    )}
    
</div>

                            </div> 

                        </div>

                        <div className={i.inter__info__flex__item}>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Флаги
                                </p>
     

<div className={i.inter__info__flex__item__arr__border}>

    {storedCampIdData && storedCampIdData.flags && (
        storedCampIdData.flags.map((item, index) => (
            <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                {item}
            </p>
        ))
    )}
    
</div>

                            </div> 

                        <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Лимиты
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                ежедневно: {storedCampIdData.limits && storedCampIdData.limits.daily.toFixed(2)}
                                </p>

                                <p className={i.inter__info__flex__item__arr__title}>
                                еженедельно: {storedCampIdData.limits && storedCampIdData.limits.weekly.toFixed(2)}
                                </p>

                                <p className={i.inter__info__flex__item__arr__title}>
                                ежемесячно: { storedCampIdData.limits && storedCampIdData.limits.monthly.toFixed(2)}
                                </p>


                            </div>

                        <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                ID
                                </p>

                                <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                                                {storedCampIdData._id && storedCampIdData._id}

                                </p>

                                <button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                         </div>

                        </div>


                            
 
                    </div>

                    

<table className={s.static__table}>

<thead className={s.static__table__thead}>

  <tr>

    <th className={s.static__table__thead__titleTwo}>Название</th>
    <th className={s.static__table__thead__titleTwo}>Описания</th>
    <th className={s.static__table__thead__title}>Ссылка</th>
    <th className={s.static__table__thead__title}>Статус</th>

  </tr>

</thead>

<tbody className={s.static__table__tbody}>

{Array.isArray(TableInfoAds) && TableInfoAds.length > 0 ? (

    TableInfoAds.map((item, key) => (

      <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.title}>

        <td className={s.static__table__tbody__title}>
          {item.title} 
        </td>

        <td className={s.static__table__tbody__subtitle}>{item.text}</td>

        <td className={s.static__table__tbody__subtitleTwo}>

            <Link to={item.link}>
                {item.link}
            </Link>

        </td>

        <td className={s.static__table__tbody__subtitle}>{item.is_moderated}</td>


      </tr>
    ))

    ) : (

    <tr className={s.static__table__tbody__tr}>
        <td className={s.static__table__tbody__subtitle} colSpan="5">Нет данных для отображения</td>
    </tr>

    )}

</tbody>

</table>

{Moderation && Moderation.length > 0 && (

<div className={i.tut_moderation} style={{marginTop: '30px'}}>

  <p className={i.inter__info__title} style={{marginBottom: '10px'}}>
    История модерации  
  </p>

  {Array.isArray(Moderation) && Moderation.map(item => (

    <div className={i.tut__item} key={item.id} style={{marginTop: '10px'}}>

      <p className={i.inter__info__flex__item__arr__title}>
        комментарий: {item.comment}
      </p>

      <p className={i.inter__info__flex__item__arr__title}>
          дата модерации: {formatDate(item.review_time)}
      </p>


    </div>

  ))}

</div>

)}


                    {!success ? 

                    <div className={i.inter__footer}>

                    <textarea type="text" placeholder='Комментарий ...' className={i.inter__footer__input} value={Comment} onChange={(event) => setComment(event.target.value)} />

                    <div className={i.inter__footer__flex}>

                        <label className={i.inter__footer__label}> 
                            <input type="radio" name="" id="" value="active" checked={selectedOption === "active"}
                            onChange={() => setSelectedOption("active")}
                            
                            />
                            <p className={i.inter__footer__label__green}>Проверено</p>
                        </label>

                        <label className={i.inter__footer__label}> 
                            <input type="radio" name="" id="" value="rejected"
                            checked={selectedOption === "rejected"}
                            onChange={() => setSelectedOption("rejected")}
                            />
                            <p className={i.inter__footer__label__green}>Отклонено</p>
                        </label>

                        <label className={i.inter__footer__label}> 
                            <input type="radio" name="" id=""
                             value="blocked"
                             checked={selectedOption === "blocked"}
                             onChange={() => setSelectedOption("blocked")}
                             />
                            <p className={i.inter__footer__label__green}>Заблокировано</p>
                        </label>

                    </div>
                        

                        <button className={i.inter__btn}  id={campaignIdFromURL}  onClick={() => moderMePush(campaignIdFromURL)} >Модерировать</button>

                    </div>

                    :
                    
                    <div className={i.inter__footertwo}>
                        
                        <p className={i.inter__footer__text}>
                        Модерированно
                        </p>

                    </div>

                    }



                </div>

               </div>

            </div>

        </section>

        </>
        
    )
}