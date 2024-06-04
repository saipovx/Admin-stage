import h from '../Header/Header.module.scss'
import logo from './Logo.svg'
import group from './Group.svg'
import Placement from '../../Placement/img/Placement.png'
import { useEffect, useRef, useState } from 'react'

import item1 from '../img/item1.svg'
import item2 from '../img/item2.svg'
import item3 from '../img/item3.svg'
import item4 from '../img/item4.svg'
import item5 from '../img/item5.svg'
import item6 from '../img/item6.svg'
import Mod from './mod.png'
import dig from './dig.png'

import bar6  from '../img/bar6.svg'
import bar7  from '../../pages/statistics/img/Рекламодатели.svg'
import bar8  from '../../pages/statistics/img/Площадка.svg'
import bar9  from '../../pages/statistics/img/Аукционы.svg'
import bar10  from '../../pages/statistics/img/Рекламные.svg'
import User from './user.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../AuthContext'


export default function Header ({userPrav, SuperUser, Amount}) {

    const [AdminActive, setAdminActive] = useState(false)

    const AdminActiveFalse = () => {
        setAdminActive(!AdminActive)
        
        setbalanceHandle(false)
        setShowContent(false);
        setShowContentThree(false);
        setShowContentfive(false);
        setShowContentfour(false);
        setburgerActive(false)
    }

  const [showContent, setShowContent] = useState(false);

  const [showContentThree, setShowContentThree] = useState(false);

  const [showContentfour, setShowContentfour] = useState(false);

  const [showContentfive, setShowContentfive] = useState(false);

  const [balanceHandle, setbalanceHandle] = useState(false);

  const [balanceHandleTwo, setbalanceHandleTwo] = useState(false);


  const timerRef = useRef(null);

  const balanceOne = () => {

    setbalanceHandle(true)
    setShowContent(false);
    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setAdminActive(false)

    setbalanceHandleTwo(false)

    clearTimeout(timerRef.current); 
  };

  const balanceOneClose = () => {

    timerRef.current = setTimeout(() => {
        setbalanceHandle(false)
    }, 500); 

    setShowContent(false);
    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setAdminActive(false)
    setbalanceHandleTwo(false)

  };


  // ..................................................................................................

  const balanceOneTwo = () => {

    setbalanceHandleTwo(true)
    setShowContent(false);
    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setAdminActive(false)
    setbalanceHandle(false)


    clearTimeout(timerRef.current); 
  };

  const balanceOneCloseTwo = () => {

    timerRef.current = setTimeout(() => {
        setbalanceHandleTwo(false)
    }, 500); 

    setShowContent(false);
    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setAdminActive(false)
    setbalanceHandle(false)

  };

  const handleMouseEnter = () => {
    setShowContent(true);
    setbalanceHandleTwo(false)

    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setbalanceHandle(false)
    setAdminActive(false)
    clearTimeout(timerRef.current); 
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowContent(false);
    }, 500); 
    setbalanceHandleTwo(false)

    setShowContentThree(false);
    setShowContentfive(false);
    setShowContentfour(false);
    setAdminActive(false)
    setbalanceHandle(false)

  };


  const MouseThree = () => {
    setbalanceHandleTwo(false)

    setShowContent(false);
    setShowContentfour(false);
    setShowContentfive(false);
    setAdminActive(false)
    setbalanceHandle(false)

    setShowContentThree(true);
    clearTimeout(timerRef.current); 
  };

  const MouseLeaveThree = () => {

    timerRef.current = setTimeout(() => {
      setShowContentThree(false);
    }, 500); 
    setbalanceHandleTwo(false)

    setShowContent(false);
    setShowContentfour(false);
    setAdminActive(false)
    setShowContentfive(false);
    setbalanceHandle(false)


  };


  const Mousefour = () => {

    setShowContentThree(false);
    setShowContent(false);
    setShowContentfive(false);
    setbalanceHandle(false)
    setAdminActive(false)
    setShowContentfour(true);
    clearTimeout(timerRef.current); 
  };

  const MouseLeavefour = () => {

    timerRef.current = setTimeout(() => {
      setShowContentfour(false);
    }, 500); 

    setShowContent(false);
    setAdminActive(false)
    setbalanceHandle(false)
    setShowContentThree(false);
    setShowContentfive(false);



  };

  const Mousefive = () => {
    setbalanceHandleTwo(false)
    setShowContentThree(false);
    setShowContent(false);
    setbalanceHandle(false)
    setShowContentfour(true);
    setAdminActive(false)
    setShowContentfive(false);
    clearTimeout(timerRef.current); 
  };

  const MouseLeavefive = () => {

    timerRef.current = setTimeout(() => {
      setShowContentfour(false);
    }, 500); 

    setShowContentfour(false);
    setShowContent(false);
    setShowContentfour(false);
    setAdminActive(false)
    setShowContentThree(false);
    setbalanceHandle(false)

  };

  const [burgerActive, setburgerActive] = useState(false)

  const burgerActiveFalse = () => {
      setburgerActive(!burgerActive)
      setbalanceHandle(false)
      setShowContent(false);
      setShowContentThree(false);
      setShowContentfive(false);
      setShowContentfour(false);
      setAdminActive(false)

  }

  const navigate = useNavigate()

  const GoOut = () => {

    navigate('/Login')

    localStorage.removeItem('access_token')

    localStorage.removeItem('refresh_token')

  }

   const locationn = useLocation ()

   const [totalNewMessagesCount, setTotalNewMessagesCount] = useState(0); // Общее количество новых сообщений

  // Получаем сохранённое значение из localStorage при загрузке компонента
  useEffect(() => {
    const savedTotalNewMessagesCount = localStorage.getItem('totalNewMessagesCount');
    if (savedTotalNewMessagesCount) {
      setTotalNewMessagesCount(parseInt(savedTotalNewMessagesCount));
    }
  }, [totalNewMessagesCount]);

    return(
      
      <>

      {locationn.pathname === '/Login' || locationn.pathname === '/restoring'
      || locationn.pathname === '/shipped' || (locationn.pathname.startsWith('/newpassword/') && locationn.pathname.length > '/newpassword/'.length)  || locationn.pathname === '/404' || locationn.pathname === '/passwordsuccessfully'

      ?
      
      ''      
      
      :

      <header className={h.header}>
  
  
          <div className={h.header__item}>
  
              <div className={h.header__padding} onClick={burgerActiveFalse}>
  
              <div 
              
              className={h.header__burger}
              
              >
  
                  <span></span>
  
              </div>
  
              </div>
  
              <Link to={'/statistics'}>

              <img src={logo} className={h.header__logo} alt="img" />

              </Link>
  
          </div>

          <div className={h.header__right}>

          <p className={h.header__right__sum}>Заработано за сегодня: {Amount.day} ₽</p>

          <p className={h.header__right__sum}>Заработано в этом месяце: {Amount.mounth} ₽</p>

          <div className={h.header__admin}>
                  
                  <div className={h.header__admin__box} onClick={AdminActiveFalse}>
              
                      <p className={h.header__admin__box__title}>admin</p>
  
                      <img src={group} className={ AdminActive ? [h.header__admin__box__strel , h.header__admin__box__strel__active].join(' ') : [h.header__admin__box__strel] } alt="svg" />
  
                  </div>
  
          </div>

          </div>
  
  
              {AdminActive &&
              
              <div className={h.header__modal}>
                  
                  <div className={h.header__modal__item}>

                    {/* ////////////////////////////////////// */}
                      
                      <div className={h.modal}>
  
                      <img src={item1} className={h.modal__svg} alt="svg" />
  
                      <p className={h.modal__title}>Консоль Администратора</p>
  
                      </div>
  
                  </div>
  
                  <div className={h.header__modal__item}>
                      
                      <div className={h.modal}>
                          
                      <img src={item2} className={h.modal__svg} alt="svg" />
  
                      <p className={h.modal__title}>Безопасность</p>
  
                      </div>
  
                      <div className={h.modal}>
                          
                          <img src={item3} className={h.modal__svg} alt="svg" />
      
                          <Link to={'/Chat'} className={h.modal__title}>Техподдержка</Link>
      
                      </div>
  
                  </div>
  
                  <div className={h.header__modal__item}>
                      
                      <div className={h.modal}>
                          
                      <img src={item4} className={h.modal__svg} alt="svg" />
  
                      <p className={h.modal__title}>Профиль</p>
  
                      </div>
  
                      <div className={h.modal}>
                          
                          <img src={item5} className={h.modal__svg} alt="svg" />
      
                          <p className={h.modal__title}>Настройки</p>
      
                      </div>
  
                  </div>
  
                  <div className={h.header__modal__item} onClick={GoOut}>
                      
                      <div className={h.modal}>
  
                      <img src={item6} className={h.modal__svg} alt="svg" />
  
                      <p className={h.modal__title}>Выйти</p>
  
                      </div>
  
                  </div>
  
              </div>
              
              }
  
      </header>

      }

      {/* //готово тепа */} 

      {locationn.pathname === '/Login' || locationn.pathname === '/restoring' 

      || locationn.pathname === '/shipped' || (locationn.pathname.startsWith('/newpassword/') && locationn.pathname.length > '/newpassword/'.length) || locationn.pathname === '/404' || locationn.pathname === '/passwordsuccessfully'
      
      ?
      
      ''      
      
      :
  
      !burgerActive ? (
  
      <div className={h.bar}>

      <>

      {( SuperUser ) && 
      
      <div 
      
      className={locationn.pathname === '/statistics'  ? [h.bar__item, h.bar__item__active].join(' ') : [h.bar__item]  }
         
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      
      
      >
          
          <img src={bar6}  alt="svg" />
      
          {showContent &&
          
          <div className={h.bar__info}
          
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      
          >
              
              <p className={h.bar__info__title}>Статистика</p>
      
              <ul className={h.bar__info__ul}>
      
                  <Link to={'/statistics'} className={h.bar__info__ul__link}>Моя статистика</Link>
      
              </ul>
      
          </div>
      
          }
      
      </div>

      
         
      }


    <div
      
          className={
            locationn.pathname === '/Venues' || locationn.pathname === '/VenuesSite' || locationn.pathname === '/Moderation'  || locationn.pathname === '/Placement' | locationn.pathname === '/LegalForms' || locationn.pathname === '/ApplicationsModer' 
              ? [h.bar__item, h.bar__item__active].join(' ')
              : [h.bar__item]
          }
          onMouseEnter={MouseThree}
          onMouseLeave={MouseLeaveThree}
        >
      
          <img src={bar8} alt="svg" />
      
          {showContentThree && (

            <div
              className={h.bar__info}
              onMouseEnter={MouseThree}
              onMouseLeave={MouseLeaveThree}
            >
              <p className={h.bar__info__title}>Модерация</p>

              <ul className={h.bar__info__ul}>

{(userPrav.includes('sitemoderator') || SuperUser ) && ( 

    <Link to={'/Venues'} className={h.bar__info__ul__link}>
        Площадки
    </Link>

)}

{(userPrav.includes('sitemoderator') || SuperUser ) && ( 

<Link to={'/VenuesSite'} className={h.bar__info__ul__link}>
    Сайты
</Link>

)}

{(userPrav.includes('advmoderator') || SuperUser ) &&

    <Link to={'/Moderation'} className={h.bar__info__ul__link}>Рекламные кампании</Link>

}

{(userPrav.includes('placement_moderator') || SuperUser ) &&


<Link to={'/Placement'} className={h.bar__info__ul__link}>Рекламные размещения вебмастеров</Link>

}

<Link to={'/LegalForms'} className={h.bar__info__ul__link}>Юридические лица</Link>

<Link to={'/ApplicationsModer'} className={h.bar__info__ul__link}>Заявки от рекламодателей</Link>



              </ul>
            </div>
          )}
      
    </div>

    <div 
      
      className={
        
        locationn.pathname === '/Manager' ||  locationn.pathname === '/UserMe' ||
        locationn.pathname === '/VenuesMe' || locationn.pathname === '/VenuesMeSite' || locationn.pathname === '/MyAdvertisingComp' || locationn.pathname === '/PlacementUsers' || locationn.pathname === '/Applications' 
        
        
        ? [h.bar__item, h.bar__item__active].join(' ') : [ h.bar__item]  }
         
      onMouseEnter={balanceOne}
      onMouseLeave={balanceOneClose}
      
      
      >
          
          <img src={bar7}  alt="svg" />
      
          {balanceHandle &&
          
          <div className={h.bar__info}
          
          onMouseEnter={balanceOne}
          onMouseLeave={balanceOneClose}
      
          >
              
              <p className={h.bar__info__title}>Менеджер</p>
      
              <ul className={h.bar__info__ul}>


{(userPrav.includes('manager') || SuperUser ) && ( 
  
  <Link to={'/VenuesMe'} className={h.bar__info__ul__link}>
   Площадки
  </Link>

)}


{(userPrav.includes('manager') || SuperUser ) && ( 
  
  <Link to={'/VenuesMeSite'} className={h.bar__info__ul__link}>
   Сайты
  </Link>

)}


{(userPrav.includes('manager') || SuperUser ) &&

    <Link to={'/MyAdvertisingComp'} className={h.bar__info__ul__link}>Рекламные кампании</Link>

}


{(userPrav.includes('manager') || SuperUser ) &&

<Link to={'/PlacementUsers'} className={h.bar__info__ul__link}>Рекламные размещения вебмастеров</Link>

}




              {(userPrav.includes('manager') || userPrav.includes('supermanager') || SuperUser ) && 
      
                  <Link to={'/Manager'} className={h.bar__info__ul__link}>Все пользователи</Link>

              }

<Link to={'/Applications'} className={h.bar__info__ul__link}>Заявки от рекламодателей</Link>


      
              </ul>
      
          </div>
      
          }
      
      </div>
      
      
  
      <div 
      
      className={locationn.pathname === '/invitation' ? [h.bar__item__footer, h.bar__item__active].join(' ') : [ h.bar__item__footer]  }
         
      
      >

        { (userPrav.includes('admin') || SuperUser ) &&  

        <Link to={'/invitation'}>

        <img src={User} width={'20px'} alt="" />

        </Link>


        }
      
    
      </div>

      <div 
      
      className={locationn.pathname === '/Acts' || locationn.pathname === '/Invoices' || locationn.pathname === '/Payments' || locationn.pathname === '/Payouts' ? [h.bar__item, h.bar__item__active].join(' ') : [h.bar__item]  }
         
      onMouseEnter={Mousefour}
      onMouseLeave={MouseLeavefour}
      
      
      >
          
          <img src={bar9}  alt="svg" />
      
          {showContentfour &&
          
          <div className={h.bar__info}
          
          onMouseEnter={Mousefour}
          onMouseLeave={MouseLeavefour}
      
          >
              
              <p className={h.bar__info__title}>Документы</p>
      
              <ul className={h.bar__info__ul}>
      
                  <Link to={'/Acts'} className={h.bar__info__ul__link}>Акты</Link>

                  <Link to={'/Invoices'} className={h.bar__info__ul__link}>Счёт-фактура</Link>

                  <Link to={'/Payments'} className={h.bar__info__ul__link}>Счета рекламодателям</Link>

                  <Link to={'/Payouts'} className={h.bar__info__ul__link}>Выплаты вебмастерам</Link>

      
              </ul>
      
          </div>
      
          }
      
      </div>
      
      {( SuperUser ) && 
      
      <Link 
      
      to={'/Chat'}
      className={ locationn.pathname === '/Chat'  ? [h.bar__item, h.bar__item__active].join(' ') : [h.bar__item]  }
         
      onMouseEnter={balanceOneTwo}
      onMouseLeave={balanceOneCloseTwo}
      
      
      >

        <p className={h.chatCout}>{totalNewMessagesCount}</p>
          
          <img src={item3} width={'25px'}  alt="svg" />
      
      </Link>

      
         
      }
      
      </>

      
      
    
    
      </div>

  
      ) : (
  
      // <div className={h.slade}>

      // <>

      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalseFive}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBarFive ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar6} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Статистика
                  
      //             <div className={h.slade__bar__title__img}>

      //              <img src={static_bar} className={h.slade__bar__title__img__slide} /> 

      //              <img src={static_plus} className={h.slade__bar__title__img__slide} />

      //             </div>

      //             </p>
                  
      //           </div>
        
      //           { slideBarFive && 
                
      //           <div className={h.slade__active}>

      //             <Link to={'/statistics'} className={h.slade__active__link}>
      //             Моя статистика
      //             </Link>
        
      //           </div>
                
      //           }
        
        
      //         </div> 

      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalse}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBar ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar7} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Рекламодатели

      //             <div className={h.slade__bar__title__img}>

      //              <img src={static_bar} className={h.slade__bar__title__img__slide} /> 

      //              <img src={static_plus} className={h.slade__bar__title__img__slide} />

      //             </div>

      //             </p>
                  
      //           </div>
        
      //           { slideBar && 
                
      //           <div className={h.slade__active}>
                  
      //             <Link to={'/Advertisers'} className={h.slade__active__link}>
      //             Defailt
      //             </Link>
              
      //           </div>
                
      //           }
        
        
      //         </div>
        
      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalseTwo}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBarTwo ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar8} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Площадки

      //              <div className={h.slade__bar__title__img}>

      //              <img src={static_bar} className={h.slade__bar__title__img__slide} /> 

      //              <img src={static_plus} className={h.slade__bar__title__img__slide} />

      //             </div>

      //             </p>
                  
      //           </div>
        
      //           { slideBarTwo && 
                
      //           <div className={h.slade__active}>
                  
      //             <Link to={'/Venues'} className={h.slade__active__link}>
      //             default
      //             </Link>
        
      //           </div>
                
      //           }
        
        
      //         </div>
        
      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalseThree}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBarThree ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar9} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Аукционы

      //             <div className={h.slade__bar__title__img}>

      //              <img src={static_bar} className={h.slade__bar__title__img__slide} /> 

      //              <img src={static_plus} className={h.slade__bar__title__img__slide} />

      //             </div>

      //             </p>
                  
      //           </div>
        
      //           { slideBarThree && 
                
      //           <div className={h.slade__active}>
                  
      //             <Link to={'/Auctions'} className={h.slade__active__link}>
      //             default
      //             </Link>
        
      //           </div>
                
      //           }
        
        
      //         </div>
        
      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalseFour}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBarFour ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar10} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Рекламные кампании
      //             </p>
                  
      //           </div>
        
      //           { slideBarFour && 
                
      //           <div className={h.slade__activ}>
                  
      //             <Link to={'/Advertising'} className={h.slade__active__link}>
      //             Default
      //             </Link>
    
      //           </div>
                
      //           }
        
        
      //         </div> 

      //         <div className={h.slade__item}>
                
      //           <div className={h.slade__bar} onClick={slideBarActivFalseSix}>
        
      //             <div className={h.slade__bar__img}>
        
      //             <img src={arrow} alt=""
                  
      //             className={slideBarFour ? [h.slade__bar__arr, h.slade__bar__arr__active].join(' ') : [h.slade__bar__arr] }
        
      //             />
        
      //             <img src={bar4} alt="" />
        
      //             </div>
                  
      //             <p className={h.slade__bar__title}>
      //             Рекламные обьявления(ADS)

      //             <div className={h.slade__bar__title__img}>

      //              <img src={static_bar} className={h.slade__bar__title__img__slide} /> 

      //              <img src={static_plus} className={h.slade__bar__title__img__slide} />

      //             </div>
                  
      //             </p>
                  
      //           </div>
        
      //           { slideBarSix && 
                
      //           <div className={h.slade__activ}>
                  
      //             <Link to={'/Advertisements'} className={h.slade__active__link}>
      //             статистика
      //             </Link>
      
      //           </div>
                
      //           }
        
        
      //         </div>  

      //         <div className={h.slade__footer}>
        
      //             <img src={setting} alt="" />
                  
      //             <p className={h.slade__footer__title}>
      //             Редактировать меню
      //             </p>
                  
      //         </div>
      
      // </>  

      // </div>

      ''
  
      )

      }
          
      </>

    )

}