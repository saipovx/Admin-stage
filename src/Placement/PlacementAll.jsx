import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";

import s from '../pages/statistics/Statistics.module.scss'
import p from './Placement.module.scss'
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function PlacementAll ({setPlacementId ,  handlePageChange, setcount_documents, page , count_documents}) {

    const apiUrl = process.env.REACT_APP_API_URL;
  
    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();
    
    const [PlacementAll , setPlacementAll] = useState([])
    
    const loadData = () => {

      const loginEndpoint = `/api/management/get_placement_users?limit=7&page=${page}`;
  
      const url = `${apiUrl}${loginEndpoint}`;
  
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        .then((res) => {
          setPlacementAll(res.data.objects)
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
  


    const navigate = useNavigate()

    const navigatePush = (camp_id) => {

        const loginEndpointTwo = `/api/placement/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${camp_id}`;
    
            axios.get(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {
    
            setPlacementId(res.data)

            localStorage.setItem('PlacementData', JSON.stringify(res.data));
    
            navigate(`/PlacementTwo/${camp_id}`)
    
            })
    
            .catch(error => {
    
              if (error.response && error.response.status === 401) {
    
                refreshToken();
    
              } else {
                
              }
                
            });
    
    }

    
    const [logoData, setLogoData] = useState({});
    const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

    const LogoUrl = process.env.REACT_APP_API_URL_LOGO;
    
    useEffect(() => {

      const fetchData = async () => {
        const newLogoData = {};
    
        for (const item of PlacementAll) {
          const url = `${LogoUrl}/logos/${item.site.logo.$oid}`;
          try {
            const response = await axios.get(url, {
              responseType: 'arraybuffer', // Укажите responseType как 'arraybuffer'
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
    
            const blob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
    
            newLogoData[item.site.logo.$oid] = imageUrl;

          } catch (error) {
            if (error.response && error.response.status === 401) {
              refreshToken();
            } else {
              // Обработка других ошибок
            }
          }
        }
    
        setLogoData(newLogoData);
        setIsLogoDataLoaded(true);
      };
    
      fetchData();
    }, [PlacementAll, token]);
     

    let objects = {

      "once": "Единоразово",
      "daily": "Ежедневно",
      "weekly": "Еженедельно",
      "monthly": "Ежемесячно",
      "quartely": "Ежеквартально",
      
    }
    

    return (
        
    <section className={p.section__place}>

        <div className="container">

    <p className={s.static__title__p}>
      Размещения всех пользователей
    </p>

    <p className={s.count}>Всего {count_documents} записей</p>

     <table className={s.static__table}>

        <thead className={s.static__table__thead}>

          <tr>

            <th className={s.static__table__thead__titleTwo}>Социальные сети</th>
            <th className={s.static__table__thead__titleTwo}>Ссылка</th>
            <th className={s.static__table__thead__titleTwo}>Тип</th>
            <th className={s.static__table__thead__titleTwo}>Описания</th>
            <th className={s.static__table__thead__titleTwo}>Периодичность</th>
            <th className={s.static__table__thead__titleTwo}>Стартовая цена</th>
            {/* <th className={s.static__table__thead__titleTwo}>Ссылки</th> */}
            
          </tr>

        </thead>

        <tbody className={s.static__table__tbody}>

{PlacementAll.map((item, key) => (

            <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item.id}>

    <td className={s.static__table__tbody__subtitle} onClick={() => navigatePush(item._id.$oid)}>

      {isLogoDataLoaded && logoData[item.site.logo.$oid] ? (

        <>
          <img src={logoData[item.site.logo.$oid]} style={{ width: '60px' }} alt={item.site.name} />
        </>

      ) : (
        <p></p>
      )}

      {item.site.name}  

    </td>

              <td className={s.static__table__tbody__subtitle}>

                <Link to={item.site.URL}>
                  
                {item.URL}

                </Link>


              </td>

              <td className={s.static__table__tbody__subtitleTwo}   >
                
                    {item.name} 
    
              </td>

              <td className={s.static__table__tbody__subtitle} >
                
                {item.decsription} 

              </td>

              <td className={s.static__table__tbody__subtitle}>
                    {objects[item.periodicity]}
              </td>

              <td className={s.static__table__tbody__subtitle} >
                
                {item.start_price} 

              </td>
            

            </tr>

          ))}

        </tbody>


      </table>

      <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

        </div>



    </section>

    )
}