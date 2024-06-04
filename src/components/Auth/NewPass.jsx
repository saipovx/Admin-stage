import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import r from './Register.module.scss'
import logo from '../img/logoReg.svg'
import ais from '../img/ice.svg'
import aisTwo from '../img/iceTwo.svg'
import { useState } from 'react';
import axios from 'axios'

export default function NewPass () {
    
    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordTwo, setShowPasswordTwo] = useState(false);

    const togglePasswordVisibility = () => {

        setShowPassword(prevShowPassword => !prevShowPassword);

    };

    const togglePasswordVisibilityTwo = () => {

        setShowPasswordTwo(prevShowPassword => !prevShowPassword);

    };

    const [password, setPassword] = useState('');

    const [passwordTwo, setpasswordTwo] = useState('');


    const [strength, setStrength] = useState(0);

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleEmailChange = (event) => {

        const newPassword = event.target.value;
        setPassword(newPassword);
        const calculatedStrength = calculatePasswordStrength(newPassword);
        setStrength(calculatedStrength);
        setColorName(getIndicatorName(calculatedStrength));

        setPasswordsMatch(event.target.value === passwordTwo);
        
    };

    const calculatePasswordStrength = (password) => {
        return Math.min(password.length * 10, 100);
    };

      const [colorName, setColorName] = useState('')

      const getIndicatorColor = (strength) => {

        if (strength >= 80) {
          return '#92D464';
        } 
        
        else if (strength >= 50) {
            return '#FFBF42';
        } 

        else {
          return '#E55C5C';
        }
      };


      const getIndicatorName = (namestring) => {

        if (namestring >= 80) {
          return 'высокая';
        } 
        
        else if (namestring >= 50) {
            return 'средняя';
        } 

        else {
          return 'Используйте хотя бы 6 символов';
        }

      };


    const [strengthTwo, setStrengthTwo] = useState(0);

    const [colorNameTwo, setColorNameTwo] = useState('')


    const handlePasswordChange = (event) => {

        const newPassword = event.target.value;
        setpasswordTwo(newPassword);
        const calculatedStrength = calculatePasswordStrengthTwo(newPassword);
        setStrengthTwo(calculatedStrength);
        setColorNameTwo(getIndicatorName(calculatedStrength));

        setPasswordsMatch(event.target.value === password);

      };

      const calculatePasswordStrengthTwo = (passwordTwo) => {
        return Math.min(passwordTwo.length * 10, 100);
      };

      const { token } = useParams();

      const apiUrl = process.env.REACT_APP_API_URL;

      const loginEndpoint = `/api/auth/reset_password/${token}`;

      const navigate = useNavigate()
      
      const NewPasswordPatch = (e) => {
  
          e.preventDefault();
      
          axios
          
            .post(`${apiUrl}${loginEndpoint}`, {
  
              password,
  
            }, {

              headers: {
                'Content-Type': 'application/json',
              },
            })

            .then((res) => { 
  
              if (res.status === 200) {
  
                  navigate('/passwordsuccessfully');
  
                  console.log(res);
  
                } else {
  
                }
            })
  
            .catch((error) => {

              console.log(error);
  
            });
  
        };

    return (

        <>

        <div className={r.section__register}>
                
                <div className={r.register}>
                    
                    <img src={logo} className={r.register__logo} alt="svg" />

                    <p className={r.register__subtitle}>
                    Создание нового пароля
                    </p>

                    <form className={r.register__form} onSubmit={NewPasswordPatch}>
                        
                        <label className={r.register__form__label}>

                            <p className={r.register__form__label__title}>
                            Пароль
                            </p>

                            <div className={r.register__form__label__rel}>

                            <input

                             type={showPasswordTwo ? 'text' : 'password'} 
                             autoComplete="new-password"
                             className={r.register__form__label__input}
                             onChange={handleEmailChange}

                             />

                             {showPasswordTwo ?

                             <img src={aisTwo} alt="" onClick={togglePasswordVisibilityTwo} />

                             :
                             
                             <img src={ais} alt="" onClick={togglePasswordVisibilityTwo} />
                            }

                            </div>

                            <div className={r.strength__bar}>
                                <div
                                    className={r.strength__indicator}

                                    style={{
                                        width: `${strength}%`,
                                        backgroundColor: getIndicatorColor(strength)
                                      }}

                                ></div>
                            </div>

                    <div className={r.strength__label}
                                    style={{
                                        color: getIndicatorColor(strength)
                                      }}
                    >Надежность: {colorName}</div>
                            
                        </label>

                        <label className={r.register__form__label}>

                            <p className={r.register__form__label__title}>
                            Подтверждение пароля
                            </p>

                            <div className={r.register__form__label__rel}>

                            <input

                             type={showPassword ? 'text' : 'password'} 
                             autoComplete="new-password"
                             className={r.register__form__label__input}
                             onChange={handlePasswordChange}

                             />

                             {showPassword ?

                             <img src={aisTwo} alt="" onClick={togglePasswordVisibility} />

                             :
                             
                             <img src={ais} alt="" onClick={togglePasswordVisibility} />
                            }

                            </div>

                            {!passwordsMatch && <p className={r.strength__label}>Подтверждение не совпадает с паролем</p>}
                            
                        </label>

                    

                        <button className={(!password && !passwordTwo) ? r.register__form__code : (passwordsMatch ? r.register__form__codeBlue : r.register__form__code)} onClick={NewPasswordPatch}>
                           Сохранить
                        </button>




                        
                    </form>



                </div>

            </div>

        </>

    )
}