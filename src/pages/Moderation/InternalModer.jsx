
import i from '../statistics/InternalPage/InternalPage.module.scss'
import navig from '../statistics/InternalPage/Group.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../AuthContext'

export default function InternalModer() {

    const [showModerationButton, setShowModerationButton] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const { refreshToken } = useAuth();

    const token = localStorage.getItem('access_token');

    const navigate = useNavigate()

    const navigatePush = () => {

        navigate(-1)

    }

    const [storedCampIdData, setStoredCampIdData] = useState([]);

    useEffect(() => {

        const data = localStorage.getItem('ModerInfo');

        if (data) {
            setStoredCampIdData(JSON.parse(data));
        }

    }, []);

    console.log(storedCampIdData);


    const moderPush = (infoId) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/moderation/campaigns/`;

        const url = `${apiUrl}${loginEndpointTwo}${infoId}`;

        axios.post(url, {}, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

            .then(res => {

                console.log(res)

                if (res.status === 200) {

                    setShowModerationButton(false);
                    setShowForm(true);

                }

            })

            .catch(error => {

                if (error.response && error.response.status === 401) {

                    refreshToken();

                } else {

                }

            });

    }

    const infoId = storedCampIdData && storedCampIdData._id && storedCampIdData._id.$oid

    console.log(infoId);

    const currentTimestamp = new Date().toISOString();

    const [selectedOption, setSelectedOption] = useState("verified");

    const [Comment, setComment] = useState('');


    const data = {
        moderator: {
            comment: Comment,
            review_time: currentTimestamp
        },

        is_moderated: selectedOption
    };


    const moderMePush = (infoId) => {

        const apiUrl = process.env.REACT_APP_API_URL;

        const loginEndpointTwo = `/api/moderation/campaigns/`;

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

                if (error.response && error.response.status === 401) {

                    refreshToken();

                } else {

                }

            });

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
                                {storedCampIdData.title}
                            </p>

                            <div className={i.inter__info__hr}></div>

                            <div className={i.inter__info__flex}>

                                <div className={i.inter__info__flex__item}>

                                    <p className={i.inter__info__flex__item__title}>
                                        Основная информация
                                    </p>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            О бренде
                                        </p>

                                        <p className={i.inter__info__flex__item__arr__title}>
                                            {storedCampIdData.about_brand}
                                        </p>

                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Задача
                                        </p>

                                        <p className={i.inter__info__flex__item__arr__title}>
                                            {storedCampIdData.task}
                                        </p>

                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Аудитория
                                        </p>

                                        <p className={i.inter__info__flex__item__arr__title}>
                                            {storedCampIdData.segment}
                                        </p>

                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Mодель
                                        </p>

                                        <p className={i.inter__info__flex__item__arr__title}>
                                            {storedCampIdData.model}
                                        </p>

                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Интересы
                                        </p>


                                        <div className={i.inter__info__flex__item__arr__border}>

                                            {storedCampIdData && storedCampIdData.interests && (
                                                storedCampIdData.interests.map((item, index) => (
                                                    <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                                                        {item}
                                                    </p>
                                                ))
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <div className={i.inter__info__flex__item}>

                                    <p className={i.inter__info__flex__item__title}>
                                        Информация об аудитории
                                    </p>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Типы перекрестных промо
                                        </p>

                                        <div className={i.inter__info__flex__item__arr__border}>

                                            {storedCampIdData && storedCampIdData.cross_promo_types && (
                                                storedCampIdData.cross_promo_types.map((item, index) => (
                                                    <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                                                        {item}
                                                    </p>
                                                ))
                                            )}

                                        </div>


                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>

                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Бюджет
                                        </p>

                                        <p className={i.inter__info__flex__item__arr__title}>
                                            {storedCampIdData.cpc_budget}
                                        </p>

                                    </div>

                                    <div className={i.inter__info__flex__item__arr}>


                                        <p className={i.inter__info__flex__item__arr__text}>
                                            Темы
                                        </p>

                                        <div className={i.inter__info__flex__item__arr__border}>

                                            {storedCampIdData && storedCampIdData.themes && (
                                                storedCampIdData.themes.map((item, index) => (
                                                    <p key={index} className={i.inter__info__flex__item__arr__border__title}>
                                                        {item}
                                                    </p>
                                                ))
                                            )}

                                        </div>

                                    </div>


                                </div>

                            </div>


                            {showModerationButton && (

                                <button
                                    className={i.inter__btn}
                                    id={infoId}
                                    onClick={() => moderPush(infoId)}
                                >
                                    Взять на модерацию
                                </button>

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