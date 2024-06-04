
import React, { useEffect } from 'react';
import { useState } from 'react';
import s from '../Statistics.module.scss'

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../AuthContext';
import Pagination from '../../../components/Pagination';

export default function AdvertisingMe ({ handlePageChange, setcount_documents, page , count_documents}) {

  const navigate = useNavigate()
  
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('access_token');

  const [AdvertisingData, setAdvertisingData] = useState([])

  const { refreshToken } = useAuth();


  const loadData = () => {

    const loginEndpoint = `/api/moderation/campaigns/manager?limit=20&page=${page}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        setAdvertisingData(res.data.objects)
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


  const AdvertisingDataType = AdvertisingData

  const navigatePush = (camp_id) => {

    const loginEndpointTwo = `/api/moderation/campaigns/`;
  
    const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;

        axios.get(url, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }

        })
        
        .then(res => {

          localStorage.setItem('campData', JSON.stringify(res.data));

          navigate(`/InternalPage/${camp_id}`)

        })

        .catch(error => {

          if (error.response && error.response.status === 401) {

            refreshToken();

          } else {
            
          }
            
        });

  }

    const optionsThree = [

        { value: 'option1', label: 'Опция 1' },
        { value: 'option2', label: 'Опция 2' },
        { value: 'option3', label: 'Опция 3' },

    ];

     
    const [selectedOption, setSelectedOption] = useState(null); 

    const handleSelectChange = (selectedOption) => {

      setSelectedOption(selectedOption);

    };

    const customStyles = {

        control: (provided) => ({
          ...provided,
          border: '1px solid var(--interface-seventh, #EBEDF5)',
          borderRadius: '8px',
          Color: '#1B1C1F',
        }),

        option: (provided, state) => ({

          ...provided,
          backgroundColor: state.isSelected ? '#007bff' : 'white',
          color: state.isSelected ? 'white' : 'black',
        }),

      };


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

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date, dateString) => {
        setSelectedDate(date);
     };

     const DataStyle = {
        color: 'black',
        marginBottom: '0',
        height: '38px' ,
        border: '1px solid var(--interface-seventh, #EBEDF5)',
      };

    const [selectedOptionTwo, setSelectedOptionTwo] = useState(null); 

    const handleSelectChangeTwo = (selectedOptionTwo) => {

      setSelectedOptionTwo(selectedOptionTwo);

    };

    const [showContent, setShowContent] = useState(false);

    const MouseHandle = () => {
      setShowContent(!showContent)
    }


    const [chekboxTable, setchekboxTable] = useState(false)

    return (
        
        <>
        
        <section className={s.section__static} >
            
            <div className="container">

            <div className={s.static__title}>

               <p className={s.static__title__p}>
               Кампании моих пользователей
               </p>
                
                <div className= { showContent ? [s.static__title__fon ,s.static__title__fon__active].join(' ') : [s.static__title__fon]} onClick={MouseHandle}>

                </div>


            </div>

            {/* <div className={s.static__header} >
                    
                    <div className={s.static__header__one}>
                        
                        <p className={s.static__header__one__title}>Неделя</p>

                        <p className={s.static__header__one__title}>Прошлая неделя</p>

                        <p className={s.static__header__one__title}>Последние 7 дней</p>

                        <p className={s.static__header__one__title}>Месяц</p>

                        <p className={s.static__header__one__title}>Квартал</p>

                        <p className={s.static__header__one__title}>Год</p>

                    </div>

                <Select
                    options={optionsThree}
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className={s.static__header__select}
                    isClearable={true}
                    styles={customStyles}
                    placeholder="Детализация по дням" 
                />


                <DatePicker onChange={handleDateChange} style={DataStyle} placeholder='Выбрать даты'/>

                </div>
                

        <div className={s.static__center__flex}>
                    
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
              
             <div className={s.static__center}>
                  
                  <p className={s.static__center__title}>
                  Поиск по ключевым словам
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


             <div className={s.static__center}>
                  
                  <p className={s.static__center__title}>
                  Менеджер
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

             <div className={s.static__center}>
                  
                  <p className={s.static__center__title}>
                  Рекламодатель
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

                </div> */}

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

      {/* {chekboxTable && 

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

      }  */}

      <p className={s.count}>Всего {count_documents} записей</p>

      <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>
            <th className={s.static__table__thead__titleTwo}>Название</th>
            <th className={s.static__table__thead__titleTwo}>Сегмент</th>
            <th className={s.static__table__thead__title}>Бюджет</th>
            <th className={s.static__table__thead__title}>О бренде</th> 
            <th className={s.static__table__thead__title}>Задача</th> 
            <th className={s.static__table__thead__title}>Статус</th> 
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

          {AdvertisingDataType.map((item) => (

            

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id.$oid}>

              <td className={s.static__table__tbody__subtitle} id={item._id.$oid}  onClick={() => navigatePush(item._id.$oid)} >
                
              {item.title} 
    
              </td>
              
              <td className={s.static__table__tbody__subtitle}>{item.segment}</td>
              <td className={s.static__table__tbody__subtitle}>{item.cpc_budget}</td>
              <td className={s.static__table__tbody__subtitle}>{item.about_brand}</td>

              <td className={s.static__table__tbody__subtitle}>

                <div className={s.static__table__tbody__subtitle__flex}>

                {item.task}

                </div>

              </td>

              <td className={s.static__table__tbody__subtitle}>{item.is_moderated}</td>


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