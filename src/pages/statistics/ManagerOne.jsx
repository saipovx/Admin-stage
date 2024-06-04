import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import i from  './InternalPage/InternalPage.module.scss';
import navig from '../statistics/InternalPage/Group.svg'
import MyTabs from "../../components/TabsManager";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import t from '../../components/MyTabs.module.scss'

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaCopy } from "react-icons/fa";



export default function  ManagerOne ({handlePageChange, setcount_documents, page , count_documents})  {


    const { refreshToken } = useAuth();

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {
    
      navigate(-1)

    }
    
    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('ManagerOne');
        
        if (data) {
          setStoredCampIdData(JSON.parse(data));
        }
        
      }, []);

      const [open, setOpen] = useState(false);

      const [organizetion ,setorganizetion] = useState([])

      const handleOpen = (camp_id) => {

      const loginEndpointTwo = `/api/management/legals/`;
    
      const url = `${apiUrl}${loginEndpointTwo}${storedCampIdData._id}`;
  
          axios.get(url, {
  
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }
  
          })
          
          .then(res => {

            setOpen(!open)
            setorganizetion(res.data.objects)
        
          })


  
          .catch(error => {
  
            if (error.response && error.response.status === 401) {
  
              refreshToken();
  
            } else {
              
            }
              
          });
  
  }

  const url = window.location.pathname;
  const parts = url.split('/'); 
  const urlID = parts[2]; 

    const navigatePushManager = (camp_id) => {

      const loginEndpointTwo = `/api/management/users/`;
  
      const url = `${apiUrl}${loginEndpointTwo}${urlID}?legal_id=${camp_id}`;

          axios.get(url, {

              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }

          })
        
          .then(res => {

          localStorage.setItem('ManagerOne', JSON.stringify(res.data));
          
          window.location.reload();

          })
          
          

          .catch(error => {

            if (error.response && error.response.status === 401) {

              refreshToken();

            } else {
            
            }
            
          });

  }

  const navigateDelete = (camp_id) => {
    
    const loginEndpointTwo = `/api/management/users/${camp_id}/delete`;

    const url = `${apiUrl}${loginEndpointTwo}`;

        axios.delete(url, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }

        })
      
        .then(res => {

          
          if (res && res.status === 204) {
            navigate('/Venues')
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

  const handleEnterLKClick = () => {

    const user_id = storedCampIdData._id;
  
    EnterLKLogic(user_id);

  };

  const EnterLKLogic = (user_id) => {

    const loginEndpoint = `/api/management/users/${user_id}/redirect`;

    const url = `${apiUrl}${loginEndpoint}`;

    // window.location.href = url

    window.open(url, '_blank');
  
  };

  console.log(storedCampIdData);
  


    return (

        <section className={i.section__internal}>
            
            <div className="container">
                
               <div className={i.inter}>
                
                <div className={i.inter__box} onClick={navigatePush}>
                    <img src={navig} alt="svg" />
                </div>

                <div className={i.inter__info}>

                <div className={i.inter__flex}>
                    
                 <div className={t.tabs__modal}>
                    
                <button className={t.tabs__text} style={{marginBottom: '10px'}} onClick={handleOpen}>
                Выбрать Юр.лицо
                </button>

                {open && 

                <div className={t.tabs__modal__content}>

                    {organizetion.map((item) => (
                    
                    <div className={t.tabs__modal__content__item}  onClick={() => navigatePushManager(item._id)}>
                       <p>Название оганизации: {item.name_organization}</p>
                       <p>Тип организации: {item.type_organization}</p>
                       <p>ИНН: {item.inn}</p>
                    </div>

                    ))}

                </div>
                
                }

                
                </div>  


                <button className={t.tabs__text} style={{marginBottom: '10px'}} onClick={handleEnterLKClick} >
                Вход в личный кабинет
                </button> 

                  </div>

                <button className={t.tabs__textRed} style={{marginBottom: '30px'}} onClick={() => navigateDelete(storedCampIdData._id)} >
                Удалить
                </button> 


                <div className={i.tut}>
                    
                    <div className={i.tut__item}>
                        
                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Имя
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.name}
                                </p>

                            </div>                            

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Почта
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.email}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Номер
                                </p>

                                <p className={i.inter__info__flex__item__arr__title}>
                                +{storedCampIdData.phone}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Дата регистрации
                                </p>

                                <p className={i.inter__info__flex__item__arr__title}>
                                {storedCampIdData.created_at ? new Date(storedCampIdData.created_at).toLocaleString(): 'не указано'}
                                </p>

                            </div>
                        
                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                ID
                                </p>

                                <p className={i.inter__info__flex__item__arr__title} ref={textRef}>
                                {storedCampIdData._id}
                                </p>

                                <button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

                            </div>

                    </div>

                    <div className={i.tut__item}>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Название оганизации
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {/* {storedCampIdData.legal_entity && storedCampIdData.legal_entity.payer_info.name} */}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Тип
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {/* {storedCampIdData.legal_entity && storedCampIdData.legal_entity.payer_info.type_person} */}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Адрес
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {/* {storedCampIdData.legal_entity && storedCampIdData.legal_entity.payer_info.post_address} */}
                                </p>

                            </div>

                            <div className={i.inter__info__flex__item__arr}>

                                <p className={i.inter__info__flex__item__arr__text}>
                                Инн
                                </p>
                                
                                <p className={i.inter__info__flex__item__arr__title}>
                                {/* {storedCampIdData.legal_entity && storedCampIdData.legal_entity.payer_info.inn} */}
                                </p>

                            </div>
                        
                        <p className={i.inter__info__flex__item__arr__text}>
                             Счет заработка:  <span style={{fontWeight: '700'}}>{storedCampIdData.balance && storedCampIdData.balance.earn}</span>
                        </p>

                        <p className={i.inter__info__flex__item__arr__text} style={{marginTop: '1px'}}>
                             Счет трат:  <span style={{fontWeight: '700'}}>{storedCampIdData.balance && storedCampIdData.balance.spend}</span>
                        </p>


                    </div>

                </div>

                    <div style={{marginTop: '30px'}}></div>

                    <MyTabs storedCampIdData={storedCampIdData} handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>

                </div>

               </div>

            </div>

        </section>

    )
}