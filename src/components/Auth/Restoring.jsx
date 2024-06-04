
import { Link, useNavigate } from 'react-router-dom'
import r from './Register.module.scss'
import logo from '../img/logoReg.svg'
import { useState } from 'react';
import axios from 'axios'

export default function Restoring () {
    

    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {

        setEmail(e.target.value);

    };

    const navigate = useNavigate()

    const [ErrorValid, setErrorValid]= useState(false)

    const apiUrl = process.env.REACT_APP_API_URL;

    const loginEndpoint = '/api/auth/reset_password';
    
    const LoginRestoring = (e) => {

        e.preventDefault();
    
        axios
          .post(`${apiUrl}${loginEndpoint}`, {

            email,

          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => { 

            console.log(res);

            if (res.request.status === 200) {

                navigate('/shipped');

                console.log(res);

              } else {

                navigate('/restoring');

                console.log(res);

              }
          })

          .catch((error) => {
          
            setErrorValid(true);

          });

      };

    return (

        <>

        <div className={r.section__register}>
                
                <div className={r.register}>
                    
                    <img src={logo} className={r.register__logo} alt="svg" />

                    <p className={r.register__subtitle}>
                    Восстановление доступа
                    </p>

                    <form className={r.register__form} onSubmit={LoginRestoring}>
                        
                        <label className={r.register__form__label}>

                            <p className={r.register__form__label__title}>
                            Email
                            </p>

                            <input type="text" autoComplete="new-password"
                             className={ErrorValid ? [r.register__form__label__input, r.register__form__label__input__error].join(' ') : [r.register__form__label__input]}
                            onChange={handleEmailChange}
                            />

                            {ErrorValid &&

                            <p className={r.strength__label}>Не найден аккаунт с таким email.</p>

                            }
                            
                        </label>


                        <p className={r.register__form__text}> На почту придет письмо с инструкцией по восстановлению доступа. Если вы забыли свой логин, свяжитесь с поддержкой: <Link to={''}>support@qrooto.ru</Link></p>

                        <div className={r.register__form__buttons}>

                        <Link to={'/Login'} className={r.register__form__buttons__btn}>
                            Назад
                        </Link>    
{/* 
                        <Link to={'/shipped'} className={email.length > 0 ? r.register__form__codeBlue : r.register__form__code}>
                        Восстановить доступ
                        </Link>                             */}


                        <button onClick={LoginRestoring} className={email.length > 0 ? r.register__form__codeBlue : r.register__form__code}>
                        Восстановить доступ
                        </button>  
                            
                        </div>



                        
                    </form>

                </div>

            </div>

        </>

    )
}