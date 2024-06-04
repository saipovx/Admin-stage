import React from 'react';
import n from './NoPages.module.scss'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

  const navigate = useNavigate()

  const exit = () => {
    navigate('/')
  }

  return (

    <div className={n.none}>

      <h2 className={n.none__title}>404 - Page Not Found</h2>

      <p className={n.none__subtitle}>Sorry, the page you are looking for does not exist.</p>
      
      <button  className='copyBtn' style={{marginTop: '30px'}} onClick={exit}>Назад</button>

    </div>

  );
};

export default NotFound;