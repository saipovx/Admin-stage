

import React, { useEffect, useState } from 'react';
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

export default function ApplicationsCard () {


    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {

        navigate(-1)

    }

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('ApplicationsCard');

        if (data) {
            setStoredCampIdData(JSON.parse(data));
        }

    }, []);


    let infoId = storedCampIdData && storedCampIdData._id

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

            if (storedCampIdData.site && storedCampIdData.site.logo) {
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
      }, [PlacementAll ,storedCampIdData,token]);

  const DataDownoaldFile = (file_id) => {
      
    const loginEndpoint = `${file_id}`;

    window.open(loginEndpoint, '_blank');
    
  };

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

  const apiUrl = process.env.REACT_APP_API_URL;

  const [message, setMessage] = useState([])

  const loadDataMessage = () => {
      
    const loginEndpoint = `/api/management/offers/${infoId}/messages`;

    // const loginEndpoint = `/api/management/offers/6588a831165198c84ed8b857/messages`;

    // 6588a831165198c84ed8b857

    const url = `${apiUrl}${loginEndpoint}`;

    axios

      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      .then((res) => {

        setMessage(res.data.objects)

      })

      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });

  };

  useEffect(() => {

    loadDataMessage();

  }, [refreshToken, infoId]);

  console.log(message);

  function downloadFile(fileUrl, fileName) {

    axios.get(fileUrl, { responseType: 'blob' }).then((response) => {

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement('a');

      a.href = url;
      a.download = fileName; 

      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

    });
  }

      const [finishedText, setfinishedText] = useState('Подтвердить')

      const HandleFinished = (offer_id) => {
    
        const loginEndpointTwo = `/api/management/offers/${offer_id}/confirmed`;
        
        const url = `${apiUrl}${loginEndpointTwo}`;
    
            axios.post(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {

              setfinishedText('Подтверждено')
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
       }

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
                                
                                {storedCampIdData.advertiser_checked === 'Необходимо подтвердить' ? 

                                <button className={i.btn} onClick={() => HandleFinished(storedCampIdData._id)}>{finishedText}</button>

                                : 

                                null
                                
                                } 
                                

                               </div>
   
                               <div className={i.inter__info__hr}></div>
   
                                <div className={i.inter__info__flex}>
   
       <div className={i.inter__info__flex__item}>

    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Имя</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.owner_user
               ? storedCampIdData.owner_user.name
               : "Не указано"
           }
       </p>
   </div>

   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Почта</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.owner_user
               ? storedCampIdData.owner_user.email
               : "Не указано"
           }
       </p>
   </div>

   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Номер телефона</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.owner_user
               ? storedCampIdData.owner_user.phone
               : "Не указано"
           }
       </p>
   </div>
   
    <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Описание</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.description
               ? storedCampIdData.description
               : "Не указано"
           }
       </p>
   </div>
   
   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Статус</p>
       

<p className={i.inter__info__flex__item__arr__title}>
  {storedCampIdData && storedCampIdData.status ? (
    storedCampIdData.status === "moderation" && "На модерации" ||
    storedCampIdData.status === "pending" && "Ожидание" ||
    storedCampIdData.status === "approved" && "Одобрено" ||
    storedCampIdData.status === "denied" && "Отказано" ||
    storedCampIdData.status === "cancelled" && "Отменено" ||
    storedCampIdData.status === "ready" && "В работе" ||
    storedCampIdData.status === "checked" && "Проверено рекламодателем" ||
    storedCampIdData.status === "finished" && "Завершено" ||
    storedCampIdData.status === "confirmed" && "Оплачено" ||
    storedCampIdData.status === "dispute" && "Спор"
  ) : (
    "Не указано"
  )}
</p>


   </div>
   
   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Рекомендованная цена</p>
       <p className={i.inter__info__flex__item__arr__title}>
           {storedCampIdData && storedCampIdData.suggested_price
               ? storedCampIdData.suggested_price
               : "Не указано"
           }
       </p>
   </div>
   
   <div className={i.inter__info__flex__item__arr}>
       <p className={i.inter__info__flex__item__arr__text}>Дата создания</p>
       <p className={i.inter__info__flex__item__arr__title}>
       {formatDateTime(storedCampIdData.created_at && storedCampIdData.created_at) || 'не указано'}
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

   <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                ID
                                </p>

                                <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                                                {storedCampIdData._id && storedCampIdData._id}

                                </p>

                                <button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                            </div>

                               {storedCampIdData.attachments = [] ? 
                               
                               null

                               :

                               <div className={i.inter__info__flex__item__arr}>
                                
                                <p className={i.inter__info__flex__item__arr__text}>
                                Файлы
                                </p>

                                <div className={i.attachments}>                      

{storedCampIdData?.attachments?.map((attachment, index) => (

<button key={index} className={i.attachments__item} onClick={() => DataDownoaldFile(attachment.download_url)}>
  {attachment.filename} <FaFileAlt />
</button>

))}

                                </div>



                            </div>

}
   
   
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
                                
                                {storedCampIdData.site && storedCampIdData.site.logo && logoData[storedCampIdData.site.logo] && (
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
                                    <p className={i.inter__info__flex__item__arr__title}>
                                        {storedCampIdData.site && storedCampIdData.site.URL
                                            ? storedCampIdData.site.URL
                                            : "Не указано"
                                        }
                                    </p>
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
    <p className={i.inter__info__flex__item__arr__text}>Тип</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.type
            ? storedCampIdData.placement.type
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Формат</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.format
            ? storedCampIdData.placement.format
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Описание</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.placement && storedCampIdData.placement.description
            ? storedCampIdData.placement.description
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

                            <div className={i.tut__item}>
                                
                            <p className={i.inter__info__title}>
                            Диалог
                            </p>

                            <div className={i.inter__info__hr}></div>

 <div className={c.chat__message__center} style={{ marginTop: '-30px' }}>

  {message.length === 0 ? (
    <p>Пусто.</p>
  ) : (
    message.map((msg, index) => (

      <div key={index} className={c.chat__message__center__flex}>

        {msg.sender_type === "Рекламодатель" ? (
          <div className={c.chat__right}>

            {msg.attachments && msg.attachments.length > 0 ? (

              <div style={{display: 'flex' , alignItems: 'flex-end'}}>
              
              <button
  onClick={() =>
    msg.attachment?.[0] &&
    downloadFile(
      `https://chat-stage.qrooto.com/api/chat/get_file/${msg.attachment[0]}`,
      'File.jpg'
    )
  }
  className={c.chat__doc}
>
                <img src={doc} style={{ width: '20px' }} alt="" />File
                
              </button>

              {msg.is_read ? (
                <img src={check_mark} width={'25px'} alt="" />
              ) : (
                <img src={checkmark} width={'25px'} alt="" />
              )}
              
              </div>


              

            ) : null}

            <div className={c.chat__message__flex}>

              <div className={c.chat__message__center__flex__he}>{msg.text}
              
              <p className={i.chat__data}>

              {msg.sender_type} ,

              {new Date(msg.timestamp).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}

              </p>

              </div>

              {msg.is_read ? (
                <img src={check_mark} width={'25px'} alt="" />
              ) : (
                <img src={checkmark} width={'25px'} alt="" />
              )}

            </div>
          </div>

        ) : (

          <div className={c.chat__left}>
            {msg.attachments && msg.attachments.length > 0 ? (
              <button
                onClick={() =>
                  downloadFile(
                    `https://chat-stage.qrooto.com/api/chat/get_file/${msg.attachment[0]}`,
                    'File.jpg'
                  )
                }
                className={c.chat__doc}
              >
                <img src={doc} style={{ width: '20px' }} alt="" />File
              </button>
            ) : null}
            <div className={c.chat__message__flex}>
              <div className={c.chat__message__center__flexTwo__he}>
                {msg.text}

                              <p className={i.chat__data_white}>

              {msg.sender_type} ,

              {new Date(msg.timestamp).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}

              </p>

              </div>
            </div>
          </div>
        )}

      </div>

    ))
  )}
                                
                            </div>

                            </div>

                            
                         </div>   


                        </div>

                    </div>

            </div>

        </section>    

    )

}