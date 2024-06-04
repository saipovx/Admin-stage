
import React from 'react';
import { useState } from 'react';
import s from '../Statistics.module.scss'
import Select from 'react-select';
import { DatePicker } from 'antd';

import setting__title from '../img/setting__title.svg'

import title_bar1 from '../img/title_bar1.svg'
import title_bar2 from '../img/title_bar2.svg'
import title_bar3 from '../img/title_bar3.svg'
import array from '../img/array.svg'
import Group from '../img/Group.svg'
import GroupTwo from './img/Group.svg'

import TableItem from '../TableItem';
import { Link, useNavigate } from 'react-router-dom';


export default function Advertisers () {



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

    // table
    const punkt = [

      { id: 'Avito',
        name: '6 677 888 ',
        age: '3 217 500 ₽', 
        partner: '3 217 500 ₽' ,
        click: '29 000 999' ,
        show: '29 000 999' ,
        crt: 'Перейти' ,
      },

      { id: 'Avito',
      name: '6 677 888 ',
      age: '3 217 500 ₽', 
      partner: '3 217 500 ₽' ,
      click: '29 000 999' ,
      show: '29 000 999' ,
      crt: 'Перейти' ,
    },

    { id: 'Avito',
    name: '6 677 888 ',
    age: '3 217 500 ₽', 
    partner: '3 217 500 ₽' ,
    click: '29 000 999' ,
    show: '29 000 999' ,
    crt: 'Перейти' ,
  },  
  { id: 'Avito',
  name: '6 677 888 ',
  age: '3 217 500 ₽', 
  partner: '3 217 500 ₽' ,
  click: '29 000 999' ,
  show: '29 000 999' ,
  crt: 'Перейти' ,
},

{ id: 'Avito',
name: '6 677 888 ',
age: '3 217 500 ₽', 
partner: '3 217 500 ₽' ,
click: '29 000 999' ,
show: '29 000 999' ,
crt: 'Перейти' ,
},

{ id: 'Avito',
name: '6 677 888 ',
age: '3 217 500 ₽', 
partner: '3 217 500 ₽' ,
click: '29 000 999' ,
show: '29 000 999' ,
crt: 'Перейти' ,
},

{ id: 'Avito',
name: '6 677 888 ',
age: '3 217 500 ₽', 
partner: '3 217 500 ₽' ,
click: '29 000 999' ,
show: '29 000 999' ,
crt: 'Перейти' ,
},

{ id: 'Avito',
name: '6 677 888 ',
age: '3 217 500 ₽', 
partner: '3 217 500 ₽' ,
click: '29 000 999' ,
show: '29 000 999' ,
crt: 'Перейти' ,
},

      

    ];

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

    const navigate = useNavigate()

    const navigatePush = () => {

      navigate('/InternalPage')

    }

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

              <div className={s.static__title}>

               <p className={s.static__title__p}>
               Default
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
                  Рекламодатели
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

                <div className={s.static__footer}>
                  
                  <p className={s.static__center__title}>
                  Тип бизнеса
                  </p>

                  <div className={s.static__footer__one}>
                    
                     <p className={s.static__header__one__title}>Кросс-промо</p>

                     <p className={s.static__header__one__title}>CPC</p>

                     <p className={s.static__header__one__title}>Все</p>

                  </div>

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
            <th className={s.static__table__thead__titleTwo}>Рекламодатель</th>
            <th className={s.static__table__thead__titleTwo}>Логин</th>
            <th className={s.static__table__thead__title}>Менеджер</th>
            <th className={s.static__table__thead__title}>Баланс</th> 
            <th className={s.static__table__thead__title}>Дата рег. (запуска)</th> 
            <th className={s.static__table__thead__title}>Последняя активность</th> 
            <th className={s.static__table__thead__title}>Личный кабинет</th> 
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

          {punkt.map((item) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.id}>

              <td className={s.static__table__tbody__subtitle} onClick={navigatePush}>
                
                    {item.id} 
    
              </td>
              
              <td className={s.static__table__tbody__subtitle}>{item.age}</td>
              <td className={s.static__table__tbody__subtitle}>{item.name}</td>
              <td className={s.static__table__tbody__subtitle}>{item.partner}</td>
              <td className={s.static__table__tbody__subtitle}>{item.click}</td>
              <td className={s.static__table__tbody__subtitle}>{item.show}</td>

              <td className={s.static__table__tbody__subtitle}>

                <Link to={''} className={s.static__table__tbody__subtitle__btn}>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M7.33301 10L9.33301 8L7.33301 6" stroke="#636570" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.33285 8.00033H1.99951" stroke="#636570" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M1.99951 5.33333V5.33333C1.99951 3.49238 3.4919 2 5.33285 2H10.6662C12.5071 2 13.9995 3.49238 13.9995 5.33333V10.6667C13.9995 12.5076 12.5071 14 10.6662 14H5.33285C3.4919 14 1.99951 12.5076 1.99951 10.6667H1.99951" stroke="#636570" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    {item.crt}

                </Link>
                
              </td>

            </tr>

          ))}

        </tbody>


      </table>

      <button className={s.static__btn}>
        
        Новая таблица
        <img src={GroupTwo} alt="" />

      </button>

        </div>

    </div>

        
        </>


    )
    
}