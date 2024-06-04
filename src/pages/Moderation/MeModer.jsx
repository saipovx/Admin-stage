
import m from './Moderation.module.scss'
import s from '../statistics/Statistics.module.scss'
import ModerationCard from './ModerationCard'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';

export default function MeModer () {

    const apiUrl = process.env.REACT_APP_API_URL;

    const loginEndpoint = '/api/moderation/campaigns/me';
  
    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const [moderCard , setmoderCard] = useState([])
  
    useEffect(() => {
    
        const url = `${apiUrl}${loginEndpoint}`;
    
            axios.get(url, {
  
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
  
            })
            .then(res => {
  
              setmoderCard(res.data)
  
            })
  
            .catch(error => {
  
              if (error.response && error.response.status === 401) {
  
                refreshToken();
  
              } else {
                
              }
                
            });
  
    }, []);

    
    return(
        
        <section className={m.section__moderation}>
            
            <div className="container">
                
            <p className={s.static__title__p}>
            Мои кампании на модерации
            </p>

            <div className={m.moderation}>

            {moderCard && moderCard.length > 0 ? 
                
                moderCard.map( (info , index) => {
    
                    return <ModerationCard {...info} key={index}/>
    
                } )

                :

                <p className={m.moderation__title}>Пока нет компании ...</p>

            }
                

            </div>

            </div>

        </section>

    )

}