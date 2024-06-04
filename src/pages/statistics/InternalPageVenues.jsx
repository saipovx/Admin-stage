
import i from '../statistics/InternalPage/InternalPage.module.scss'
import navig from './InternalPage/Group.svg'
import { Form, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../AuthContext'
import { FaCopy } from "react-icons/fa";

export default function InternalPageVenues({ campId }) {

  // const [showModerationButton, setShowModerationButton] = useState(true);

  const [showForm, setShowForm] = useState(true);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate()

  const navigatePush = () => {

    navigate(-1)

  }

  const [storedCampIdData, setStoredCampIdData] = useState([]);

  useEffect(() => {

    const data = localStorage.getItem('InternalPageVenues');

    if (data) {
      setStoredCampIdData(JSON.parse(data));
    }

  }, []);

  const infoVenues = storedCampIdData

  const infoCampaign = infoVenues && infoVenues.campaign

  const infoId = storedCampIdData._id && storedCampIdData._id

  console.log(infoVenues);

  const { refreshToken } = useAuth();

  const token = localStorage.getItem('access_token');


  const currentTimestamp = new Date().toISOString();

  const [selectedOption, setSelectedOption] = useState("verified");

  const [Comment, setComment] = useState('');


  const data = {
    
    is_moderated: selectedOption,
    comment: Comment,

};

const moderMePush = (infoId) => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const loginEndpointTwo = `/api/moderation/sites/`;

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
                {infoVenues && infoVenues.name}
              </p>

              <div className={i.inter__info__hr}></div>

              <div className={i.inter__info__flex}>

                <div className={i.inter__info__flex__item}>

                  <p className={i.inter__info__flex__item__title}>
                    Кампания
                  </p>

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Имя
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                          {infoVenues.user && infoVenues.user.name}
                    </p>

                    </div>

                    <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Почта
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                    {infoVenues.user && (
      <Link to={`mailto:${infoVenues.user.email}`} className={i.inter__info__flex__item__arr__title}>
        {infoVenues.user.email}
      </Link>
    )}
                    </p>

                    </div>

                    <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Номер телефона
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                          {infoVenues.user && infoVenues.user.phone}
                    </p>

                    </div>

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Создан
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                      { new Date(infoVenues && infoVenues.created_at).toLocaleString()}
                    </p>

                  </div>

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                    Обновлено
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                      { new Date(infoVenues && infoVenues.updated_at).toLocaleString()}

                    </p>

                  </div>

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Ссылка
                    </p>

                    <Link to={infoVenues && infoVenues.URL} className={i.inter__info__flex__item__arr__title}>
                      {infoVenues && infoVenues.URL}
                    </Link>

                  </div>

                  {infoVenues.platform === undefined ?
                  
                  ''

                  :

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Тип
                    </p>


                    <div className={i.inter__info__flex__item__arr__border}>
                      {
                          infoVenues && infoVenues.platform && infoVenues.platform.type.map((item, index) => (
                          <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                            {item}
                          </p>
                           ))
                        }
                    </div>

                    </div>

                    }

                    {infoVenues.platform === undefined ?
                  
                  ''

                  :


                    <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Тема
                    </p>
                    
                    <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                    {infoVenues.platform && infoVenues.platform.theme}
                                </p>

                    </div>
                  
                  }

                  {infoVenues.campaign === undefined ?
                  
                  ''

                  :

                  <div className={i.inter__info__flex__item__arr}>

                    <p className={i.inter__info__flex__item__arr__text}>
                      Тема
                    </p>

                    <p className={i.inter__info__flex__item__arr__title}>
                          {infoVenues.campaign && infoVenues.campaign.themes}
                    </p>

                    </div>

                    }


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

    </>

  )
}