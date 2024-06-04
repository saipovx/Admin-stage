
import React, { useEffect } from 'react';
import { useState } from 'react';
import s from '../statistics/Statistics.module.scss'
import Select from 'react-select';

import setting__title from '../statistics/img/setting__title.svg'

import title_bar1 from '../statistics/img/title_bar1.svg'
import title_bar2 from '../statistics/img/title_bar2.svg'
import title_bar3 from '../statistics/img/title_bar3.svg'
import Group from '../statistics/img/Group.svg'

import TableItem from '../statistics/TableItem';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import Pagination from '../../components/Pagination';


export default function UserMe ({handlePageChange, setcount_documents, page , count_documents}) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const loginEndpoint = '/api/users_admin/all';

  const token = localStorage.getItem('access_token');

  const [AuctionData, setAuctionData] = useState([])

  const { refreshToken } = useAuth();

  const loadData = () => {

    const loginEndpoint = `/api/users_admin/all?limit=20&page=${page}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setAuctionData(res.data.objects)
        setcount_documents(res.data.count_documents);
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

    loadData();

  }, [page, refreshToken]);


  const AuctionDataType = AuctionData

  console.log(AuctionDataType);

  const navigate = useNavigate()

  const navigatePushManager = (camp_id) => {

      const loginEndpointTwo = `/api/management/users/`;
    
      const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
  
          axios.get(url, {
  
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }
  
          })
          
          .then(res => {
  
          localStorage.setItem('ManagerOne', JSON.stringify(res.data));
  
          navigate(`/ManagerOne/${camp_id}`)
  
          })
  
          .catch(error => {
  
            if (error.response && error.response.status === 401) {
  
              refreshToken();
  
            } else {
              
            }
              
          });
  
  }


    const [selectedOptionTwo, setSelectedOptionTwo] = useState(null); 

    const handleSelectChangeTwo = (selectedOptionTwo) => {

      setSelectedOptionTwo(selectedOptionTwo);

    };

    const [showContent, setShowContent] = useState(false);

    const MouseHandle = () => {
      setShowContent(!showContent)
    }

    // table chelbox

    const info = [
      
      {
        title: 'Заработок системы'
      },

      {
        title: 'Заработок системы'
      },

      {
        title: 'Заработок системы'
      },

      {
        title: 'Заработок системы'
      },

      {
        title: 'Заработок системы'
      },

      {
        title: 'Заработок системы'
      },

    ]

    // функция открывания chekboxTable

    const [chekboxTable, setchekboxTable] = useState(false)

    const chekboxTableHandle = () => {
      setchekboxTable(!chekboxTable)
    }

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

              <div className={s.static__title}>

               <p className={s.static__title__p}>
               Мои пользователи
               </p>

               
                
                <div className= { showContent ? [s.static__title__fon ,s.static__title__fon__active].join(' ') : [s.static__title__fon]} onClick={MouseHandle}>

                <img src={setting__title} className= { showContent ? [s.static__title__svg ,s.static__title__svg__active].join(' ') : [s.static__title__svg] } alt="svg"/>

                </div>


                {showContent && 

                <div className={s.static__title__info}>
                
                  <div className={s.static__title__info__item}>

                    <img src={title_bar1} alt="" />
                    
                    <p className={s.static__title__info__item__title}>
                    Переименовать
                    </p>

                  </div>

                  <div className={s.static__title__info__item}>

                    <img src={title_bar2} alt="" />
                    
                    <p className={s.static__title__info__item__title}>
                    Дублировать
                    </p>

                  </div>

                  <div className={s.static__title__info__item}>

                    <img src={title_bar3} alt="" />
                    
                    <p className={s.static__title__info__item__title}>
                    Удалить
                    </p>

                  </div>

                </div>

                }

              </div>

            </div>

        </section>

        <div className='section__staticTwo'>
          
          <div className="container">

      {/* <div className={s.static__table__header}>
      
      <p className={s.static__table__header__title}>
      Заголовок раздела с таблицей
      </p>

      <label className={s.static__table__header__btn} onClick={chekboxTableHandle}>
        
        <p className={s.static__table__header__btn__title}>
        Настроить строки и столбцы
        </p>

        <img src={Group} alt=""
        
        className={ chekboxTable ? [s.static__table__header__btn__img , s.static__table__header__btn__img__active].join(' ') : [s.static__table__header__btn__img] }

        />
      </label>
        
      </div> */}

      {/* // открывание пункта изменений */}

      {chekboxTable && 

      <div className={ chekboxTable ? [s.static__punkt , s.static__punkt__active].join(' ') : [s.static__punkt , s.static__punkt__false].join(' ')  } >

        <button className={s.static__punkt__btn}>
        Выбрать все
        </button>

      <div className={s.static__flex}>
        
        <div className={s.static__punkt__item}>
          
          <p className={s.static__punkt__item__title}>
          Строки
          </p>
          
          {info.map((info, index) => {
              return <TableItem {...info} />
          })}

        </div>

        <div className={s.static__punkt__item}>
          
          <p className={s.static__punkt__item__title}>
          Столбцы
          </p>

          {info.map((info, index) => {
              return <TableItem {...info} />
          })}

          <div className={s.static__punkt__item__hr}></div>

          <label className={s.static__punkt__item__label}>

            <input type="checkbox" className={s.static__punkt__item__label__checkbox} />

            <p className={s.static__punkt__item__label__title}>Динамика показателя в сравнении с предыдущим аналогичным периодом (%)</p>

          </label>

        </div>

      </div> 

      <div className={s.static__punkt__buttons}>

      <button className={s.static__punkt__buttons__btnNostyle}>
      Отменить
      </button>

      <button className={s.static__punkt__buttons__btn}>
      Применить
      </button>

      </div>  

      </div>  

      } 

    <p className={s.count}>Всего {count_documents} записей</p>


      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>
             
            <th className={s.static__table__thead__titleTwo}>Имя</th>
            <th className={s.static__table__thead__titleTwo}>Почта</th>
            <th className={s.static__table__thead__titleTwo}>Роль</th>

          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

          {AuctionDataType.map((item) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.id}>

              <td className={s.static__table__tbody__subtitle} onClick={() => navigatePushManager(item && item.id)}>
                
                    {item.name} 
    
              </td>
              
              <td className={s.static__table__tbody__subtitle}>{item.email}</td>

              <td className={s.static__table__tbody__subtitle}>

{

item.role.length === 0 ? 'Нет роли' : item.role.join(', ')

}

              </td>

            </tr>

          ))}

        </tbody>


      </table>

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

        </div>

    </div>

        
        </>


    )
    
}