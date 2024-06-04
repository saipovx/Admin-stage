import { Link, useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import Save from "./save";
import s from '../pages/statistics/Statistics.module.scss'
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import ExcelJS from 'exceljs';


export default function TabPlacement ({handlePageChange, setcount_documents, page , count_documents, PlaceData, AAccountId }) {

    const apiUrl = process.env.REACT_APP_API_URL;

    const token = localStorage.getItem('access_token');
  
    const { refreshToken } = useAuth();

    const navigate = useNavigate()

    const navigatePush = (camp_id) => {

        const loginEndpointTwo = `/api/management/get_placement_users/`;
      
        const url = `${apiUrl}${loginEndpointTwo}${camp_id}`
    
            axios.get(url, {
    
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
    
            })
            
            .then(res => {
    
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

    let objects = {

        "once": "Единоразово",
        "daily": "Ежедневно",
        "weekly": "Еженедельно",
        "monthly": "Ежемесячно",
        "quartely": "Ежеквартально",
        
      }

      const [Dubl , setDubl] = useState([])

      const loginEndpoint = `/api/management/placements_for_user/${AAccountId}?limit=${count_documents}`;
    
      const url = `${apiUrl}${loginEndpoint}`
    
      useEffect(() => {;
    
        axios
        
          .get(url, {
    
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
    
          .then((res) => {
            
            setDubl(res.data.objects)
    
          })
    
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              refreshToken();
            } else {
              // Handle other errors
            }
          });
    
      }, [refreshToken,count_documents,AAccountId]);

      const [logoData, setLogoData] = useState({});

      const [isLogoDataLoaded, setIsLogoDataLoaded] = useState(false);

const LogoUrl = process.env.REACT_APP_API_URL_LOGO;

      
useEffect(() => {

  const fetchData = async () => {

    const newLogoData = {};
    
    for (const item of PlaceData) {
      const document_type = '/logos';
      const document_id = `/${item.logo}`;
      const url = `${LogoUrl}${document_type}${document_id}`;
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // Преобразование ArrayBuffer в строку base64
        const base64String = btoa(
          new Uint8Array(response.data)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Формирование base64 URL
        const imageUrl = `data:image/png;base64,${base64String}`;
        
        newLogoData[item.logo] = imageUrl;
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

}, [PlaceData, token]);


      const downloadXLSX = async () => {
        try {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Лист 1');
      
          // Добавляем заголовки столбцов
          worksheet.addRow([
            'Социальные сети',
            'Ссылка',
            'Тип',
            'Описание',
            'Стартовая цена',
          ]);
      
          // Добавляем данные из PlaceData
          Dubl.forEach(item => {
            worksheet.addRow([
              item.name ? item.name : 'Не указано',
              item.URL ? item.URL : 'Не указано',
              item.type ? item.type : 'Не указано',
              item.decsription ? item.decsription : 'Не указано',
              item.start_price ? item.start_price : 'Не указано',
            ]);
          });
      
          const blob = await workbook.xlsx.writeBuffer();
          const blobObject = new Blob([blob], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
      
          const blobUrl = URL.createObjectURL(blobObject);
      
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'data.xlsx';
          a.click();
        } catch (error) {
          console.error('Ошибка при скачивании XLSX:', error);
        }
      };

    return (
        
        <>
        
<div className={s.marginTop}></div>

<Save count_documents={count_documents} downloadXLSX={downloadXLSX}  />

<table className={s.static__table}>

   <thead className={s.static__table__thead}>

     <tr>

       <th className={s.static__table__thead__titleTwo}>Социальные сети</th>
       <th className={s.static__table__thead__titleTwo}>Ссылка</th>
       <th className={s.static__table__thead__titleTwo}>Тип</th>
       <th className={s.static__table__thead__titleTwo}>Описания</th>
       <th className={s.static__table__thead__titleTwo}>Стартовая цена</th>
            
     </tr>

   </thead>

   <tbody className={s.static__table__tbody}>

     {PlaceData.map((item, key) => (

       <tr style={{ borderBottom: '1px solid #EBEDF5' }} className={s.static__table__tbody__tr} key={item._id}>

<td className={s.static__table__tbody__subtitle}  onClick={() => navigatePush(item._id)} >
  
{isLogoDataLoaded && logoData[item.logo] ? (

    <img src={logoData[item.logo]} style={{ width: '60px', marginRight: '10px !' }} alt={item.name} />

) : (

  <p>Loading...</p>

)}

{item.name ? item.name : "Не указано"}

</td>

         <td className={s.static__table__tbody__subtitle}>

           <Link to={item.URL}>
             
           {item.URL ? item.URL : 'Не указано'}

           </Link>


         </td>

         <td className={s.static__table__tbody__subtitleTwo}  >
           
               {item.type ? item.type : 'Не указано'} 

         </td>

         <td className={s.static__table__tbody__subtitle} >
          
           {item.decsription ? item.decsription : 'Не указано'} 

         </td>

         <td className={s.static__table__tbody__subtitle} >
           
           {item.start_price ? item.start_price : 'Не указано'}  

         </td>
       
       </tr>

     ))}

   </tbody>


 </table>

 <Pagination  page={page}  handlePageChange={handlePageChange} count_documents={count_documents}/>

        </>

    )
}