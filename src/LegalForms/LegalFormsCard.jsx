
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

export default function LegalFormsCard () {

    const [showModerationButton, setShowModerationButton] = useState(true);

    const [showForm, setShowForm] = useState(true);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {

        navigate(-1)

    }

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('LegalFormsCard');

        if (data) {
            setStoredCampIdData(JSON.parse(data));
        }

    }, []);

    // console.log(storedCampIdData);

    const moderPush = () => {

        setShowModerationButton(false);
        setShowForm(true);

    }

    const infoId = storedCampIdData && storedCampIdData._id && storedCampIdData._id

    const [selectedOption, setSelectedOption] = useState("verified");

    const [Comment, setComment] = useState('');


    const data = {
    
        is_moderated: selectedOption,
        comment: Comment,

    };


    const moderMePush = (infoId) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/moderation/advertiser_info/legal_forms/`;

        const url = `${apiUrl}${loginEndpointTwo}${infoId}`;

        axios.patch(url, data, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

            .then(res => {

                if (res.status === 200) {

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

    const [foundOrganization, setFoundOrganization] = useState(null);

    useEffect(() => {
        const findOrganizationByInn = async (inn) => {
          const apiKey = 'a9c183df04f65c3303e19e6c20b5b38c2d2b0f40';
          const apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party';
    
          try {
            const response = await axios.post(
              apiUrl,
              { query: inn },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${apiKey}`,
                },
              }
            );
    
            // Обработка ответа от Dadata Suggestions API
            if (response.data.suggestions && response.data.suggestions.length > 0) {

              const organizationData = response.data.suggestions[0].data;

              setFoundOrganization(organizationData);

            } else {

              setFoundOrganization(null);

            }
          } catch (error) {

            console.error('Ошибка при запросе к Dadata Suggestions API:', error);
            setFoundOrganization(null);

          }
        };
    
        if (storedCampIdData.payer_info && storedCampIdData.payer_info.inn) {
          findOrganizationByInn(storedCampIdData.payer_info.inn);
        }

      }, [storedCampIdData.payer_info]);

    const dadataInn = foundOrganization && foundOrganization.inn;

    const dadataKpp = foundOrganization && foundOrganization.kpp;

    const dadataAdress = foundOrganization && foundOrganization.address && foundOrganization.address.unrestricted_value;

    const dadataAdressValue = foundOrganization && foundOrganization.address && foundOrganization.address.value;

    const dadataAdressStreet = foundOrganization && foundOrganization.address && foundOrganization.address.data && foundOrganization.address.data.street;

    const dadataOgrn = foundOrganization && foundOrganization.ogrn;

    const dadataName = foundOrganization && foundOrganization.management && foundOrganization.management.name;

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
        
        <section className={s.section__staticThee} >
            
            <div className="container">

                  <div className={i.inter}>

                        <div className={i.inter__box} onClick={navigatePush}>
                            <img src={navig} alt="svg" />
                        </div>

                        <div className={i.inter__info}>

                            <p className={i.inter__info__title}>
                            Информация плательщика
                            </p>

                            <div className={i.inter__info__hr}></div>


                                <Tabs>

      <TabList style={{ listStyle: 'none', padding: 0, marginBottom: '30px', border: 'none', display: 'flex' }} className={t.tabs}>

        <Tab 
  
        className={t.tabs__item}
        

        >

          Плательщик

        </Tab>

        <Tab 
        
        className={t.tabs__item}

        >

          Рекламодатель

        </Tab>

        {storedCampIdData.contragent

            ? 

            <Tab
            className={t.tabs__item}
          >
            Контрагент
          </Tab>


            :
            
            ""
        }

{storedCampIdData.agreement

? 

        <Tab
          className={t.tabs__item}
        >
          Соглашение
        </Tab>

        :

        ''

}

      </TabList>

      <TabPanel>

            <div className={i.inter__info__flex}>

                                <div className={i.inter__info__flex__item}>

<div className={i.inter__info__flex__item__arr}>

    <p className={i.inter__info__flex__item__arr__text}>Тип</p>

    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.type_person
            ? (() => {
                const typePerson = storedCampIdData.payer_info.type_person;
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
        {storedCampIdData.payer_info && storedCampIdData.payer_info.name
            ? storedCampIdData.payer_info.name
            : "Не указано"
        }
    </p>
</div>

{/* ИНН */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>ИНН</p>
    <p className={i.inter__info__flex__item__arr__title}>

    {/* {foundOrganization.inn ? foundOrganization.inn : "Не указано"} */}

    {storedCampIdData.payer_info && storedCampIdData.payer_info.inn
            ? storedCampIdData.payer_info.inn
            : "Не указано"
    }
    
    </p>
</div>

{/* Телефон */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Телефон</p>
    <p className={i.inter__info__flex__item__arr__title}>

    {/* {foundOrganization.phones ? foundOrganization.phones : "Не указано"} */}

    {storedCampIdData.payer_info && storedCampIdData.payer_info.phone
            ? storedCampIdData.payer_info.phone
            : "Не указано"
        }
    
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Страна</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.country
            ? storedCampIdData.payer_info.country
            : "Не указано"
        }
    </p>
</div>


{/* корреспондентский счет */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Корреспондентский счет</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.correspondent_account
            ? storedCampIdData.payer_info.correspondent_account
            : "Не указано"
        }
    </p>
</div>     

{/* Почта */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Почта</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.email
            ? storedCampIdData.payer_info.email
            : "Не указано"
        }
    </p>
</div>    
                                    
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Fax</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.fax
            ? storedCampIdData.payer_info.fax
            : "Не указано"
        }
    </p>
</div>


{/* KPP */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>KPP</p>
    <p className={i.inter__info__flex__item__arr__title}>

        {storedCampIdData.payer_info && storedCampIdData.payer_info.kpp === "Не указано"

            ? storedCampIdData.payer_info.kpp

            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.kpp}

                    {/* Проверка совпадения KPP */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.kpp !== "Не указано" && storedCampIdData.payer_info.kpp === dadataKpp ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>




{/* Юридический адрес */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Юридический адрес</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.legal_address === "Не указано"
            ? storedCampIdData.payer_info.legal_address
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.legal_address}

                    {/* Проверка совпадения Юридического адреса */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.legal_address !== "Не указано" && storedCampIdData.payer_info.legal_address === dadataAdressValue ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>


{/* Местонахождение */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Местонахождение</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address === "Не указано"
            ? storedCampIdData.payer_info.post_address
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address}

                    {/* Проверка совпадения Местонахождения */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address !== "Не указано" && storedCampIdData.payer_info.post_address === dadataAdress ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>

                                                                   
                                </div>

<div className={i.inter__info__flex__item}>

{/* Адрес банка */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Адрес банка</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.bank_address
            ? storedCampIdData.payer_info.bank_address
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Имя банка</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.bank_name
            ? storedCampIdData.payer_info.bank_name
            : "Не указано"
        }
    </p>
</div>

{/* Код страны */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Код страны</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.code_country
            ? storedCampIdData.payer_info.code_country
            : "Не указано"
        }
    </p>
</div>

{/* Контактное лицо */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Контактное лицо</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.contact_person === "Не указано"
            ? storedCampIdData.payer_info.contact_person
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.contact_person}

                    {/* Проверка совпадения Контактного лица */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.contact_person !== "Не указано" && storedCampIdData.payer_info.contact_person === dadataName ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>



{/* Номер дома */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Номер дома</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.number_house
            ? storedCampIdData.payer_info.number_house
            : "Не указано"
        }
    </p>
</div>   

{/* OGRN */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>OGRN</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.ogrn === "Не указано"
            ? storedCampIdData.payer_info.ogrn
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.ogrn}

                    {/* Проверка совпадения OGRN */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.ogrn !== "Не указано" && storedCampIdData.payer_info.ogrn === dadataOgrn ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>

  
{/* Номер платы */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Номер платы</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.pay_number
            ? storedCampIdData.payer_info.pay_number
            : "Не указано"
        }
    </p>
</div> 

{/* Почтовый адрес */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Почтовый адрес</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address === "Не указано"
            ? storedCampIdData.payer_info.post_address
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address}

                    {/* Проверка совпадения Почтового адреса */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.post_address !== "Не указано" && storedCampIdData.payer_info.post_address === dadataAdress ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
</div>


{/* Почтовый код */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Почтовый код</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.post_code
            ? storedCampIdData.payer_info.post_code
            : "Не указано"
        }
    </p>
</div>

 {/* Короткое имя */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Короткое имя</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.short_name
            ? storedCampIdData.payer_info.short_name
            : "Не указано"
        }
    </p>
</div>

{/* Улица */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Улица</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.payer_info && storedCampIdData.payer_info.street === "Не указано"
            ? storedCampIdData.payer_info.street
            : (
                <>
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.street}

                    {/* Проверка совпадения Улицы */}
                    {storedCampIdData.payer_info && storedCampIdData.payer_info.street !== "Не указано" && storedCampIdData.payer_info.street === dadataAdressStreet ? (
                        <span className="match">Совпадает</span>
                    ) : (
                        <span className="no-match">Не совпадает</span>
                    )}
                </>
            )
        }
    </p>
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

    {storedCampIdData.advertiser && storedCampIdData.advertiser.type_person
        ? (() => {
            const typePerson = storedCampIdData.advertiser.type_person;
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
        {storedCampIdData.advertiser && storedCampIdData.advertiser.name
            ? storedCampIdData.advertiser.name
            : "Не указано"
        }
    </p>
</div>

{/* ИНН */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>ИНН</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.advertiser && storedCampIdData.advertiser.inn
            ? storedCampIdData.advertiser.inn
            : "Не указано"
        }
    </p>
</div>

{/* Телефон */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Телефон</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.advertiser && storedCampIdData.advertiser.phone
            ? storedCampIdData.advertiser.phone 
            : "Не указано"
        }
         
    </p>
</div>

{/* Телефон */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Регистрационный номер</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.advertiser && storedCampIdData.advertiser.reg_number
            ? storedCampIdData.advertiser.reg_number
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Номер платы</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.advertiser && storedCampIdData.advertiser.pay_number
            ? storedCampIdData.advertiser.pay_number
            : "Не указано"
        }
    </p>
</div> 

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Код страны </p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.advertiser && storedCampIdData.advertiser.code_country
            ? storedCampIdData.advertiser.code_country
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

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Тип соглашения</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.agreement && storedCampIdData.agreement.agreemen_type
            ? storedCampIdData.agreement.agreemen_type
            : "Не указано"
        }
    </p>
</div>


<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Тип предмета</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.agreement && storedCampIdData.agreement.subject_type
            ? storedCampIdData.agreement.subject_type
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Тип действия</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.agreement && storedCampIdData.agreement.action_type
            ? storedCampIdData.agreement.action_type
            : "Не указано"
        }
    </p>
</div>

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Номер</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.agreement && storedCampIdData.agreement.number
            ? storedCampIdData.agreement.number
            : "Не указано"
        }
    </p>
</div>


<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
    Количество</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.agreement && storedCampIdData.agreement.amount
            ? storedCampIdData.agreement.amount
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

<div className={i.inter__info__flex__item__arr}>

    <p className={i.inter__info__flex__item__arr__text}>Тип</p>

    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.contragent && storedCampIdData.contragent.type_person
            ? (() => {
                const typePerson = storedCampIdData.contragent.type_person;
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
        {storedCampIdData.contragent && storedCampIdData.contragent.name
            ? storedCampIdData.contragent.name
            : "Не указано"
        }
    </p>
</div>

{/* ИНН */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>ИНН</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.contragent && storedCampIdData.contragent.inn
            ? storedCampIdData.contragent.inn
            : "Не указано"
        }
    </p>
</div>

{/* Телефон */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Телефон</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.contragent && storedCampIdData.contragent.phone
            ? storedCampIdData.contragent.phone
            : "Не указано"
        }
    </p>
</div>

{/* Номер платы */}
<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>Номер платы</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.contragent && storedCampIdData.contragent.pay_number
            ? storedCampIdData.payer_info.pay_number
            : "Не указано"
        }
    </p>
</div> 

<div className={i.inter__info__flex__item__arr}>
    <p className={i.inter__info__flex__item__arr__text}>
Код страны</p>
    <p className={i.inter__info__flex__item__arr__title}>
        {storedCampIdData.contragent && storedCampIdData.contragent.code_country
            ? storedCampIdData.contragent.code_country
            : "Не указано"
        }
    </p>
</div>
                                                          
                                </div>

            </div>
      
      
      </TabPanel>
      
    </Tabs>

    <div className={i.inter__info__flex__item__arr}>

<p className={i.inter__info__flex__item__arr__text}>
ID
</p>

<p className={i.inter__info__flex__item__arr__title} ref={textRef}>
        {storedCampIdData._id && storedCampIdData._id}
</p>

<button className="copyBtn" onClick={handleCopyClick}>{isCopied ? 'Скопировано' : 'Скопировать'} <FaCopy /></button>

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

    )

}