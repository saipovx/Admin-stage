import { useNavigate } from 'react-router-dom'
import i from '../pages/statistics/InternalPage/InternalPage.module.scss'
import navig from '../pages/statistics/InternalPage/Group.svg'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthContext'

export default function PlaceMentThree () {

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');
    
    const navigate = useNavigate()

    const navigatePush = () => {

      navigate(-1)

    }
    
    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('PlacementDataTwo');
        
        if (data) {
          setStoredCampIdData(JSON.parse(data));
        }
        
      }, []);

      const [selectedOption, setSelectedOption] = useState("verified"); 

      const [Comment, setComment] = useState('');

      const [ success, setsuccess] = useState(false);

      const handleOptionChange = (event) => {
  
          const optionValue = event.target.value;
          setSelectedOption(optionValue); 
  
        };

      const data = {
          is_moderated: selectedOption,
          comment: Comment,
      };

      const urlAu = window.location.href;

      const campaignIdFromURL = urlAu.substring(urlAu.lastIndexOf('/') + 1);

      const moderMePush = (campaignIdFromURL) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/placement/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${campaignIdFromURL}`;
    
        axios.patch(url, data , {
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })
            
            .then(res => {

                if (res.status === 200) {

                    setsuccess(true)

                }
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
      }

    return (

        <section className={i.section__internal}>
            
            <div className="container">
                
               <div className={i.inter}>
                
                <div className={i.inter__box} onClick={navigatePush}>
                    <img src={navig} alt="svg" />
                </div>

                <div className={i.inter__info}>

                    <p className={i.inter__info__title}>
                        {storedCampIdData.name}
                    </p>

                    <div className={i.inter__info__hr}></div>

                    <div className={i.inter__info__flex}>
                        
                        <div className={i.inter__info__flex__item}>
                            
                            <p className={i.inter__info__flex__item__title}>
                            Основная информация
                            </p>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Описания
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.decsription}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Периодичность
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.periodicity}
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

                        </div>

                    </div>

                {!success ? 

                    <div className={i.inter__footer}>

                    <textarea type="text" placeholder='Комментарий ...' className={i.inter__footer__input} value={Comment} onChange={(event) => setComment(event.target.value)} />

                    <div className={i.inter__footer__flex}>

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

    )
}