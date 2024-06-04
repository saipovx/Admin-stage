import { Link, useNavigate } from 'react-router-dom'
import r from './Register.module.scss'
import logo from '../img/logoReg.svg'
import ais from '../img/ice.svg'
import aisTwo from '../img/iceTwo.svg'
import { useEffect, useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';


export default function Register () {

    const isCookieDataAvailable = Boolean(Cookies.get('email') && Cookies.get('password'));
    
    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordTwo, setShowPasswordTwo] = useState(false);

    const togglePasswordVisibility = () => {

        setShowPassword(prevShowPassword => !prevShowPassword);

    };

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');


    const handleEmailChange = (e) => {

        setEmail(e.target.value);

    };

    const handlePasswordChange = (e) => {

        setPassword(e.target.value);

    };

    const navigate = useNavigate()

    // обработка ошибок

    const [ErrorValid, setErrorValid]= useState(false)

    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Получение сохраненных значений из куков
        const savedEmail = Cookies.get('email');
        const savedPassword = Cookies.get('password');
        const savedRememberMe = Cookies.get('rememberMe');
    
        if (savedEmail) {
          setEmail(savedEmail);
        }
    
        if (savedPassword) {
          setPassword(savedPassword);
        }
    
        if (savedRememberMe) {
          setRememberMe(savedRememberMe === 'true');
        }
      }, []);
    
    const handleRememberMeChange = () => {
      setRememberMe(!rememberMe);
    };

    console.log(rememberMe);


    const apiUrl = process.env.REACT_APP_API_URL;

    const loginEndpoint = '/api/auth/login';
    
    const Login = (e) => {
        e.preventDefault();
    
        axios
          .post(`${apiUrl}${loginEndpoint}`, {

            email,
            password,

          }, {
            
            headers: {
              'Content-Type': 'application/json',
            },

          })
          
          .then((res) => { 

            if (res.request.status === 200) {

                // if (rememberMe) {

                //   Cookies.set('email', email);
                //   Cookies.set('password', password);
                //   Cookies.set('rememberMe', rememberMe.toString());

                // } else {

                //   Cookies.remove('email');
                //   Cookies.remove('password');
                //   Cookies.remove('rememberMe');

                // }

                if (rememberMe) {
                  Cookies.set('email', email, { path: '/' });
                  Cookies.set('password', password, { path: '/' });
                  Cookies.set('rememberMe', rememberMe.toString(), { path: '/' });
                } else {
                  Cookies.remove('email', { path: '/' });
                  Cookies.remove('password', { path: '/' });
                  Cookies.remove('rememberMe', { path: '/' });
                }
                
            
                // Сохранить access_token и refresh_token в локальном хранилище (localStorage)

                const { access_token, refresh_token , access_token_expires_in } = res.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('expiration_time', access_token_expires_in);
            
                navigate('/statistics');

                window.location.reload()

              } else {

                navigate('/Login');

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
 
                    {ErrorValid &&

                        <p className={r.register__title}>
                        Неверный Email или пароль
                        </p>

                    }

                    <form className={r.register__form} onSubmit={Login}>
                        
                        <label className={r.register__form__label}>

                            <p className={r.register__form__label__title}>
                            Email
                            </p>

                            {/* register__form__label__input__error */}

                            <input type="text" autoComplete="new-password"
                            style={{ background: isCookieDataAvailable ? 'rgba(135, 176, 255, 0.20)' : '#fff' }}
                            className={ErrorValid ? [r.register__form__label__input, r.register__form__label__input__error].join(' ') : [r.register__form__label__input]} 
                            onChange={handleEmailChange}  value={email} // 
                            />
                            
                        </label>

                          <label className={r.register__form__label}>

                            <p className={r.register__form__label__title}>
                            Пароль
                            </p>

                            <div className={r.register__form__label__rel}>

                            <input

                             type={showPassword ? 'text' : 'password'} 
                             autoComplete="new-password"
                             className={ErrorValid ? [r.register__form__label__input, r.register__form__label__input__error].join(' ') : [r.register__form__label__input]} 
                             onChange={handlePasswordChange}  value={password} // 
                             style={{ background: isCookieDataAvailable ? 'rgba(135, 176, 255, 0.20)' : '#fff' }}
                             />

                              

                             {showPassword ?

                             <img src={aisTwo} alt="" onClick={togglePasswordVisibility} />

                             :
                             
                             <img src={ais} alt="" onClick={togglePasswordVisibility} />
                            }

                            </div>
                            
                        </label>

                        <div className={r.register__form__footer}>

                        <label className={r.custom__checkbox}>

                        <input
                          type="checkbox"
                          onChange={handleRememberMeChange}
                          checked={rememberMe}
                          disabled={!isCookieDataAvailable}
                          className='inputch'
                        />

                            <span className={r.checkmark}></span>

                            <p>Запомнить меня</p>

                        </label>
                            
                            <Link to={'/restoring'} className={r.register__form__footer__title}>
                                
                            Не помню пароль

                            </Link>

                        </div>

                        <button className={email.length > 0 && password.length > 0 ? r.register__form__codeBlue : r.register__form__code} onClick={Login}>

                         Войти

                        </button>


                        
                    </form>

                </div>

            </div>

        </>

    )
}