

import React, { useEffect, useRef, useState } from 'react';
import s from '../pages/statistics/Statistics.module.scss'
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'
import navig from '../pages/statistics/InternalPage/Group.svg'
import t from '../components/MyTabs.module.scss'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useAuth } from '../AuthContext';
import { FaCopy } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaFileAlt } from "react-icons/fa";
import c from '../Chat/Chat.module.scss'
import doc from '../Chat/img/doc.svg'
import check_mark from '../Chat/img/check-mark.png'
import checkmark from '../Chat/img/checkmark.png'
import Item from 'antd/es/list/Item';

export default function ApplicationsCardModer () {

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {

        navigate(-1)

    }

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('ApplicationsCardModer');

        if (data) {
            setStoredCampIdData(JSON.parse(data));
        }

    }, []);


    let infoId = storedCampIdData._id && storedCampIdData._id

    console.log(storedCampIdData);

    function formatDateTime(dateTimeString) {

        const optionsDate = {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
      
        const formattedDate = new Date(dateTimeString).toLocaleString('ru-RU', optionsDate);
      
        return formattedDate;
      }

      const [PlacementAll , setPlacementAll] = useState([])
      const [logoData, setLogoData] = useState({});
      const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

      const LogoUrl = process.env.REACT_APP_API_URL_LOGO;
      
      
      useEffect(() => {
  
        const fetchData = async () => {

            const newLogoData = {};

            if (storedCampIdData.site && storedCampIdData.site.logo && storedCampIdData.site.logo) {
              const url = `${LogoUrl}/logos/${storedCampIdData.site.logo}`;
              try {
                const response = await axios.get(url, {
                  responseType: 'arraybuffer',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });
          
                const blob = new Blob([response.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
          
                newLogoData[storedCampIdData.site.logo] = imageUrl;

              } catch (error) {
                if (error.response && error.response.status === 401) {
                  refreshToken();
                } else {
                  // Обработка других ошибок
                }
              }
            }
          
            setLogoData(newLogoData);
            setIsLogoDataLoaded(true);

          };
          
      
        fetchData();

    //   }, [PlacementAll,logoData, token]);

    }, [PlacementAll, token]);

  const DataDownoaldFile = (file_id) => {
      
    const loginEndpoint = `${file_id}`;

    window.open(loginEndpoint, '_blank');
    
  };

const textRef = React.useRef(null);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = storedCampIdData._id;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000); 

  };

  const [showForm, setShowForm] = useState(true);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [selectedOption, setSelectedOption] = useState("verified");

  const [Comment, setComment] = useState('');


  const data = {
    
    status: selectedOption,
    comment: Comment,

};

  const moderMePush = (infoId) => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const loginEndpointTwo = `/api/offers/`;

    const url = `${apiUrl}${loginEndpointTwo}${infoId}`;
    

    axios.patch(url, data, {

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

        .then(res => {

            if (res.status === 204) {

                setShowForm(false);
                setShowSuccessMessage(true);

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

   const Moderation = storedCampIdData && storedCampIdData.moderator

   function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    return formattedDate;
  }
  
  function padZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  const handleCopyClickTwo = () => {
    const tempElement = document.createElement('textarea');
    tempElement.value = storedCampIdData.moderator && storedCampIdData.moderator.id;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000); 

  };

    return (
        
        <section className={s.section__staticThee} >
            
            <div className="container">

                  <div className={i.inter}>

                        <div className={i.inter__box} onClick={navigatePush}>
                            <img src={navig} alt="svg" />
                        </div>

                        <div className={i.inter__info}>

                         <div className={i.tut}>

                         <div className={i.tut__item}>
                                
                                <div style={{display: 'flex', alignItems:'center', justifyContent: 'space-between'}}>

                                <p className={i.inter__info__title}>Заявка</p>
                                
                               </div>
   
                               <div className={i.inter__info__hr}></div>
   
                                <div className={i.inter__info__flex}>
   
       <div className={i.inter__info__flex__item}>

    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Название заявки</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.title
               ? storedCampIdData.title
               : "Не указано"
           }
       </p>
   </div>

   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Cообщение</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.message
               ? storedCampIdData.message
               : "Не указано"
           }
       </p>
   </div>

   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Предложенная цена</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.suggested_price
               ? storedCampIdData.suggested_price
               : "Не указано"
           }
       </p>
   </div>
   
    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Создано</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.created_at
               ? new Date(storedCampIdData.created_at).toLocaleString()          
               : "Не указано"
           }
       </p>
   </div>
   
   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Обновлено</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.updated_at
               ? new Date(storedCampIdData.updated_at).toLocaleString()          
               : "Не указано"
           }
       </p>
   </div>

   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Дата размещения</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.confirm_at
               ? storedCampIdData.confirm_at
               : "Не указано"
           }
       </p>
   </div>

   {/* <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Почта</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.moderator
               ? storedCampIdData.moderator &&  storedCampIdData.moderator.email
               : "Не указано"
           }
       </p>
   </div> */}

   <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                ID
                                </p>

                                <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                                                {storedCampIdData._id && storedCampIdData._id}

                                </p>

                                <button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                            </div>

                               <div className={i.inter__info__flex__item__arr}>
                                
                                <p className={i.inter__info__flex__item__arr__text}>
                                Файлы
                                </p>


                                {storedCampIdData.attachments === null ? 
  'Нет доступных файлов'
  :
  <div className={i.attachments}>                      
    {storedCampIdData?.attachments?.map((attachment, index) => (
      <button key={index} className={i.attachments__item} onClick={() => DataDownoaldFile(attachment.download_url)}>
        {attachment.filename} <FaFileAlt />
      </button>
    ))}
  </div>
}




                            </div>
   
   
       </div>

   
                               </div>  
   
                         </div>

                            <div className={i.tut__item}>
                                
                            <p className={i.inter__info__title}>
                            Площадка
                            </p>

                            <div className={i.inter__info__hr}></div>

                            <div className={i.inter__info__flex}>
                                
                                <div className={i.inter__info__flex__item}>
                                
                                {storedCampIdData.site && storedCampIdData.site.logo && logoData && logoData[storedCampIdData.site.logo] && (
  <img style={{ width: '120px', marginBottom: '20px' }} src={logoData[storedCampIdData.site.logo]} alt="" />
)}

                                            
                                <div className={i.inter__info__flex__item__arr}>
                                    <p className={i.inter__info__flex__item__arr__text}>Заголовок</p>
                                    <p className={i.inter__info__flex__item__arr__title}>
                                        {storedCampIdData.site && storedCampIdData.site.name
                                            ? storedCampIdData.site.name
                                            : "Не указано"
                                        }
                                    </p>
                                </div>
                                
                                <div className={i.inter__info__flex__item__arr}>
                                    <p className={i.inter__info__flex__item__arr__text}>Ссылка</p>
                                    <Link to={storedCampIdData.site && storedCampIdData.site.URL} className={i.inter__info__flex__item__arr__title}>
                                        {storedCampIdData.site && storedCampIdData.site.URL
                                            ? storedCampIdData.site.URL
                                            : "Не указано"
                                        }
                                    </Link>
                                </div>
                                
                                </div>
                                
                            </div>

                            </div>

                            <div className={i.tut__item}>

                            <p className={i.inter__info__title} >
                            Размещение
                            </p>

                            <div className={i.inter__info__hr} ></div>

                            <div className={i.inter__info__flex}>
                                
<div className={i.inter__info__flex__item}>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Заголовок</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.name
            ? storedCampIdData.placement.name
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Описание</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.description
            ? storedCampIdData.placement.decsription
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Ссылка</p>
    <Link to={storedCampIdData.placement && storedCampIdData.placement.URL}  className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.URL
            ? storedCampIdData.placement.URL
            : "Не указано"
        }
    </Link>
</div>

</div>

                            </div>


                            </div>

                            {storedCampIdData.moderator === null ?

                            <div className={i.tut__item}>
                                
                                <div style={{display: 'flex', alignItems:'center', justifyContent: 'space-between'}}>

                                <p className={i.inter__info__title}>История модерации</p>
                                
                               </div>
   
                               <div className={i.inter__info__hr}></div>

<div className={i.inter__info__flex}>
   
       <div className={i.inter__info__flex__item}>

    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Модератор</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.moderator
               ? storedCampIdData.moderator &&  storedCampIdData.moderator.email
               : "Не указано"
           }
       </p>
   </div>

    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Kомментарий</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.moderator == '' || null
               ? storedCampIdData.moderator &&  storedCampIdData.moderator.comment
               : "Не указано"
           }
       </p>
   </div>
   
    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Дата модерации</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.moderator
               ? new Date(storedCampIdData.moderator.review_time).toLocaleString()          
               : "Не указано"
           }
       </p>
   </div>

   <p className={i.inter__info__flex__item__arr__title} >
        Статус: <span className='verified'>{storedCampIdData.moderator && storedCampIdData.moderator.status === 'verified' && 'Проверено'} </span>
                <span className='rejected'>{storedCampIdData.moderator && storedCampIdData.moderator.status  === 'rejected' && 'Отклонено'}</span>
                <span className='blocked'>{storedCampIdData.moderator && storedCampIdData.moderator.status  === 'blocked' && 'Заблокировано'}</span>
                
      </p>


   <div className={i.inter__info__flex__item__arr} style={{marginTop: '20px'}}>

                    <p className={i.inter__info__flex__item__arr__text}>
                        ID
                    </p>

                    <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                {storedCampIdData.moderator && storedCampIdData.moderator.id}
                    </p>

                                <button className="copyBtn" onClick={handleCopyClickTwo}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                            </div>   
   
       </div>
       
   
                               </div>  
   
                         </div>

                         :

                         ''
                            
                          }

                            
                         </div> 

{Moderation && Moderation.length > 0 &&  (

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

        <p className={i.inter__info__flex__item__arr__title}>
          статус: <span className='verified'>{item.is_moderated === 'verified' && 'Проверено'}</span>
                  <span className='rejected'>{item.is_moderated === 'rejected' && 'Отклонено'}</span>
                  <span className='blocked'>{item.is_moderated === 'blocked' && 'Заблокировано'}</span>
                  
        </p>

      </div>

    ))}

  </div>

)}



                         
                            {showForm && (

                                <div className={i.inter__footer}>

                                    <textarea type="text" placeholder='Комментарий ...' className={i.inter__footer__input} value={Comment} onChange={(event) => setComment(event.target.value)} />


                                    <form className={i.inter__footer__flex}>

                                        <label className={i.inter__footer__label}>
                                            <input type="radio" name="" id="" value="pending" checked={selectedOption === "pending"}
                                                onChange={() => setSelectedOption("pending")}

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

                                    </form>


                                    <button className={i.inter__btn} id={infoId} onClick={() => moderMePush(infoId)} >Модерировать</button>

                                </div>

                            )}

                            {showSuccessMessage && <div className={i.inter__footertwo}>Промодерировано</div>}

 


                        </div>

                    </div>

            </div>

        </section>    

    )

}