
import React, { useEffect } from 'react';
import { useState } from 'react';
import s from '../statistics/Statistics.module.scss'
import Select from 'react-select';

import setting__title from '../statistics/img/setting__title.svg'

import title_bar1 from '../statistics/img/title_bar1.svg'
import title_bar2 from '../statistics/img/title_bar2.svg'
import title_bar3 from '../statistics/img/title_bar3.svg'
import Group from '../statistics/img/Group.svg'
import GroupTwo from '../statistics/img/Group.svg'

import TableItem from '../statistics/TableItem';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';


export default function Auctions () {

  const apiUrl = process.env.REACT_APP_API_URL;

  const loginEndpoint = '/api/moderation/lots/all?limit=10&page=1';

  const token = localStorage.getItem('access_token');

  const [AuctionData, setAuctionData] = useState([])

  const { refreshToken } = useAuth();

  useEffect(() => {
  
      const url = `${apiUrl}${loginEndpoint}`;
  
          axios.get(url, {

              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              }

          })
          .then(res => {

            setAuctionData(res.data)

          })

          .catch(error => {

            if (error.response && error.response.status === 401) {

              refreshToken();

            } else {
              
            }
              
          });


  }, [refreshToken]);

  const AuctionDataType = AuctionData

  console.log(AuctionDataType);

      const optionsTwo = [

        { value: 'option1', label: 'Опция 1' },
        { value: 'option2', label: 'Опция 2' },
        { value: 'option3', label: 'Опция 3' },

    ];

    const customStylesTwo = {

      control: (provided) => ({
        ...provided,
        border: '1px solid var(--interface-seventh, #EBEDF5)',
        borderRadius: '8px',
        Color: '#1B1C1F',
        zIndex: 0,
        
      }),

      option: (provided, state) => ({

        ...provided,
        backgroundColor: state.isSelected ? '#007bff' : 'white',
        color: state.isSelected ? 'white' : 'black',
      }),

    };

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
               Аукционы
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
                

                <div className={s.static__center}>
                  
                  <p className={s.static__center__title}>
                  Площадки
                  </p>

                  <Select
                    options={optionsTwo}
                    value={selectedOptionTwo}
                    onChange={handleSelectChangeTwo}
                    className={s.static__center__select}
                    isClearable={true}
                    styles={customStylesTwo}
                    placeholder="Все" 
                />



                </div>

            </div>

        </section>

        <div className='section__staticTwo'>
          
          <div className="container">

      <div className={s.static__table__header}>
      
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
        
      </div>

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

      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>
             
            <th className={s.static__table__thead__titleTwo}>Текст</th>
            <th className={s.static__table__thead__titleTwo}>Ссылки</th>
            <th className={s.static__table__thead__title}>Описание</th>
            <th className={s.static__table__thead__title}>Стартовая цена</th> 
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

          {AuctionDataType.map((item) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.id}>

              <td className={s.static__table__tbody__subtitle}>
                
                    {item.name} 
    
              </td>
              
              <td className={s.static__table__tbody__subtitle}>
              
                 <Link to={item.URL}>
                  
                  {item.URL}
  
                  </Link>

              </td>
              
              <td className={s.static__table__tbody__subtitle}>{item.decsription}</td>

              <td className={s.static__table__tbody__subtitle}>{item.start_price}</td>


            </tr>

          ))}

        </tbody>


      </table>

        </div>

    </div>

        
        </>


    )
    
}