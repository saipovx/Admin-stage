import { useNavigate } from 'react-router-dom'
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'
import navig from '../pages/statistics/InternalPage/Group.svg'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PlacementItem from './PlacementItem'
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { FaCopy } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import t from '../components/MyTabs.module.scss'

export default function PlaceMentOne () {

    const [showModerationButton, setShowModerationButton] = useState(true);

    const [showForm, setShowForm] = useState(true);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    const navigate = useNavigate()

    const navigatePush = () => {

      navigate(-1)

    }
    
    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('PlacementData');
        
        if (data) {
          setStoredCampIdData(JSON.parse(data));
        }
        
      }, []);

      let objects = {

        "once": "Единоразово",
        "daily": "Ежедневно",
        "weekly": "Еженедельно",
        "monthly": "Ежемесячно",
        "quartely": "Ежеквартально",
        
      }

    console.log(storedCampIdData);

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const infoId = storedCampIdData._id && storedCampIdData._id.$oid


     const [selectedOption, setSelectedOption] = useState("verified"); 

     const [Comment, setComment] = useState('');

     const data = {
    
      is_moderated: selectedOption,
      comment: Comment,

  };

     const moderMePush = (infoId) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/placement/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${infoId}`;
    
        axios.patch(url, data , {
            
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

    const [newLogoData , setnewLogoData] = useState()

    const url = window.location.href;

    const campaignIdFromURL = url.substring(url.lastIndexOf('/') + 1);

  const LogoUrl = process.env.REACT_APP_API_URL_LOGO;


    useEffect(() => {

      const fetchData = async () => {

        const url = `${LogoUrl}/logos/${campaignIdFromURL}`;
          
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
    
            setnewLogoData(imageUrl)

          } catch (error) {
            if (error.response && error.response.status === 401) {
              refreshToken();
            } else {
              // Обработка других ошибок
            }
          }
        }
    
      fetchData();
      
    }, [token]);

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

  const [imgData, setimgData] = useState({});
  const [isimgDataLoaded, setIsimgDataLoaded] = useState(false);
  const [selectedSiteLogoId, setSelectedSiteLogoId] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      if (!storedCampIdData || !storedCampIdData.images || !Array.isArray(storedCampIdData.images)) {
        // console.error('Invalid or missing image data');
        return
      }
  
      const newImgData = {};
  
      for (const item of storedCampIdData.images) {

        const url = `${LogoUrl}/placements/${item.$oid}`;
  
        try {
          const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'image/png',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          const blob = new Blob([response.data], { type: 'image/png' });

          const imageUrl = URL.createObjectURL(blob);
  
          newImgData[item.$oid] = imageUrl;

        } catch (error) {
          if (error.response && error.response.status === 401) {
            refreshToken();
          } else {
            // console.error('Error fetching image:', error);
            // Handle other errors
          }
        }
      }
  
      setimgData(newImgData);
      setIsimgDataLoaded(true);

    };
  
    fetchData();

  }, [storedCampIdData, token]);

  console.log(imgData);

  const handleSiteLogoSelection = (selectedLogoId) => {
    setSelectedSiteLogoId(selectedLogoId);
  };

  const [logoData, setLogoData] = useState({});
  const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);
  
  useEffect(() => {
  
    const fetchData = async () => {
  
      const newLogoData = {};
  
      const logoId = storedCampIdData.site.logo.$oid;

      const url = `${LogoUrl}/logos/${logoId}`;
  
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'image/png',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
  
        newLogoData[logoId] = imageUrl;
  
      } catch (error) {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
        //   console.error('Error fetching image:', error);
          // Handle other errors
        }
      }
  
      setLogoData(newLogoData);
      setIsLogoDataLoaded(true);

    };
  
    fetchData();
  }, [storedCampIdData, token]);

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

        <section className={i.section__internal}>
            
            <div className="container">
                
               <div className={i.inter}>
                
                <div className={i.inter__box} onClick={navigatePush}>
                    <img src={navig} alt="svg" />
                </div>

                <div className={i.inter__info}>

                     <img src={newLogoData} width={'60px'} alt="" />

                    <p className={i.inter__info__title}>
                    {storedCampIdData && storedCampIdData.site && storedCampIdData.site.name}
                    </p>
                  

                    <Tabs>

<TabList style={{ listStyle: 'none', padding: 0, marginTop: '10px', border: 'none', display: 'flex' }} className={t.tabs}>

  <Tab className={t.tabs__item} >Основная информация</Tab>

  <Tab className={t.tabs__item} >Юр. лицо</Tab>

  <Tab className={t.tabs__item} >Сайт</Tab>

</TabList>

<div className={i.inter__info__hr}></div>

<TabPanel>
  
<div className={i.inter__info__flex}>
                      
                      <div className={i.inter__info__flex__item}>


                        

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Заголовок
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.name}
                              </p>

                          </div>
                          

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Описания
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.decsription ? storedCampIdData.decsription : 'Не указано'}
                              </p>

                          </div>

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Формат
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.format}
                              </p>

                          </div>

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Периодичность
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                                  {objects[storedCampIdData.periodicity]}
                              </p>

                          </div>

                           <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Стартовая цена
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.start_price}
                              </p>

                          </div>

                           <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                                  Ссылка
                              </p>
                              
                              <Link to={storedCampIdData.URL} className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.URL}
                              </Link>

                          </div>

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              ID
                              </p>

                              <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                              {storedCampIdData._id && storedCampIdData._id.$oid}
                              </p>

                              <button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                          </div>
                            
                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Изображения
                                </p> 


                                {isimgDataLoaded ? (
    Object.keys(imgData).length > 0 ? (
      Object.keys(imgData).map((imageId) => (
        <img
          key={imageId}
          src={imgData[imageId]}
          style={{ marginTop: '10px', width: '420px' }}
          alt={`Image ${imageId}`}
        />
      ))
    ) : (
      <p>Нет доступных изображений</p>
    )
  ) : (
    <p>Loading images...</p>
  )}

                            </div> 

                      </div>

</div>

</TabPanel>

<TabPanel>


          <div className={i.inter__info__flex}>

                              <div className={i.inter__info__flex__item}>

<div className={i.inter__info__flex__item__arr}>

  <p className={i.inter__info__flex__item__arr__text}>Тип</p>

  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.type_person
          ? (() => {
              const typePerson = storedCampIdData.legal.type_person;
              switch (typePerson) {
                  case "JuridicalPerson":
                      return "Юр. лицо РФ";
                  case "IndividualEntrepreneur":
                      return "Индивидуальный предприниматель РФ";
                  case "PhysicalPerson":
                      return "Физ. лицо РФ";
                  case "InternationalJuridicalPerson":
                      return "Иностранное юр. лицо";
                  case "InternationalPhysicalPerson":
                      return "Иностранное физ. лицо";
                  default:
                      return "Unknown Type";
              }
          })()
          : "Не указано"
      }
  </p>
</div>


<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Наименование</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.name
          ? storedCampIdData.legal.name
          : "Не указано"
      }
  </p>
</div>

{/* ИНН */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>ИНН</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.inn
          ? storedCampIdData.legal.inn
          : "Не указано"
      }
  </p>
</div>

{/* Телефон */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Телефон</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.phone
          ? storedCampIdData.legal.phone
          : "Не указано"
      }
  </p>
</div>

<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Страна</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.country
          ? storedCampIdData.legal.country
          : "Не указано"
      }
  </p>
</div>

 

{/* Почта */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Почта</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.email
          ? storedCampIdData.legal.email
          : "Не указано"
      }
  </p>
</div>    
                                  
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Fax</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.fax
          ? storedCampIdData.legal.fax
          : "Не указано"
      }
  </p>
</div>


{/* KPP */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>KPP</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.kpp
          ? storedCampIdData.legal.kpp
          : "Не указано"
      }
  </p>
</div>


{/* Юридический адрес */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Юридический адрес</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.legal_address
          ? storedCampIdData.legal.legal_address
          : "Не указано"
      }
  </p>
</div>

{/* Местонахождение */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Местонахождение</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.legal_address
          ? storedCampIdData.legal.legal_address
          : "Не указано"
      }
  </p>
</div> 
                                                                 

                              </div>

                              <div className={i.inter__info__flex__item}>

{/* Адрес банка */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Адрес банка</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.bank_address
          ? storedCampIdData.legal.bank_address
          : "Не указано"
      }
  </p>
</div>

<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Имя банка</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.bank_name
          ? storedCampIdData.legal.bank_name
          : "Не указано"
      }
  </p>
</div>

{/* Код страны */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Код страны</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.code_country
          ? storedCampIdData.legal.code_country
          : "Не указано"
      }
  </p>
</div>

{/* Контактное лицо */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Контактное лицо</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.contact_person
          ? storedCampIdData.legal.contact_person
          : "Не указано"
      }
  </p>
</div>


{/* Номер дома */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Номер дома</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.number_house
          ? storedCampIdData.legal.number_house
          : "Не указано"
      }
  </p>
</div>   

{/* OGRN */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>OGRN</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.ogrn
          ? storedCampIdData.legal.ogrn
          : "Не указано"
      }
  </p>
</div>

{/* Номер платы */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Номер платы</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.pay_number
          ? storedCampIdData.legal.pay_number
          : "Не указано"
      }
  </p>
</div> 

{/* Почтовый адрес */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Почтовый адрес</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.post_address
          ? storedCampIdData.legal.post_address
          : "Не указано"
      }
  </p>
</div>

{/* Почтовый код */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Почтовый код</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.post_code
          ? storedCampIdData.legal.post_code
          : "Не указано"
      }
  </p>
</div>

{/* Короткое имя */}
<div className={i.inter__info__flex__item__arr}>
  <p className={i.inter__info__flex__item__arr__text}>Короткое имя</p>
  <p className={i.inter__info__flex__item__arr__title}>
      {storedCampIdData.legal && storedCampIdData.legal.short_name
          ? storedCampIdData.legal.short_name
          : "Не указано"
      }
  </p>
</div>



                              </div>

          </div>

</TabPanel>

<TabPanel>

<div className={i.inter__info__flex}>
                      
                      <div className={i.inter__info__flex__item}>

                      {isLogoDataLoaded && (
        <img src={logoData[storedCampIdData.site.logo.$oid]} width={'100px'} style={{marginBottom: '30px'}} alt="Logo" />
      )}

                        

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Заголовок
                              </p>
                              
                              <p className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.site && storedCampIdData.site.name}
                              </p>

                          </div>
                          

                          <div className={i.inter__info__flex__item__arr}>

                              <p className={i.inter__info__flex__item__arr__text}>
                              Описания
                              </p>
                              
                              <Link to={storedCampIdData.site && storedCampIdData.site.URL} className={i.inter__info__flex__item__arr__title}>
                              {storedCampIdData.site && storedCampIdData.site.URL}
                              </Link>

                          </div>

                      </div>

</div>

</TabPanel>

                    </Tabs>

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
            <input type="radio" name="" id="" value="verified" checked={selectedOption === "verified"}
                onChange={() => setSelectedOption("verified")}

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