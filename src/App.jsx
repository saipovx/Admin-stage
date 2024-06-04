import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './style/App.css';

import ScrollTop from './utils/scrollTop';
import Header from './components/Header/Header';
import Register from './components/Auth/Register';
import Restoring from './components/Auth/Restoring';
import Shipped from './components/Auth/Shipped';
import NewPass from './components/Auth/NewPass';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/notPages/NoPages';
import { useEffect, useState } from 'react';
import Invitation from './pages/Invitation/Invitation';
import axios from 'axios';
import ShippedTwo from './components/Auth/ShippedTwo';
import Statisticss from './pages/statistics/Statistics';
import InternalPage from './pages/statistics/InternalPage/InternalPage';
import Venues from './pages/statistics/Venues';
import Advertising from './pages/statistics/Advertising/Advertising';
import { useAuth } from './AuthContext';
import Manager from './pages/statistics/Manager';
import CampaignDetails from './pages/statistics/InternalStatic';
import SyteDetails from './pages/statistics/InternalSyte';
import Moderation from './pages/Moderation/Moderation';
import InternalModer from './pages/Moderation/InternalModer';
import InternalMeModer from './pages/Moderation/InternalMeModer';
import Chat from './Chat/Chat.jsx';
import PlaceMent from './Placement/Placement';
import PlaceMentOne from './Placement/PlacementOne';
import PlaceMentTwo from './Placement/PlacementTwo';
import PlaceMentUsers from './Placement/PlacementUsers';
import PlacementSite from './Placement/PlacementSite';
import ManagerOne from './pages/statistics/ManagerOne';
import InternalPageVenues from './pages/statistics/InternalPageVenues';
import PlacementAll from './Placement/PlacementAll';
import AdvertisingMe from './pages/statistics/Advertising/AdvertisingMe';
import VenuesAll from './pages/statistics/VenuesAll';
import InternalPageVenuesTwo from './pages/statistics/InternalPageVenuesTwo';
import VenuesMe from './pages/statistics/VenuesMe';
import UserMe from './pages/statistics/UserMe';
import MyAdvertisingComp from './pages/statistics/Advertising/MyAdvertisingComp.jsx';
import { animateScroll as scroll } from "react-scroll";
import LegalForms from './LegalForms/LegalForms.jsx';
import LegalFormsCard from './LegalForms/LegalFormsCard.jsx';
import Applications from './applications/Applications.jsx';
import ApplicationsCard from './applications/ApplicationsCard';
import ApplicationsModer from './applications/ApplicationsModer.jsx';
import ApplicationsCardModer from './applications/ApplicationsCardModer.jsx';
import Acts from './documents/Acts.jsx';
import Invoices from './documents/Invoices.jsx';
import Payments from './documents/Payments.jsx';
import Payouts from './documents/Payouts.jsx';
import VenuesSite from './pages/statistics/VenuesSite.jsx';
import VenuesMeSite from './pages/statistics/VenuesMeSite.jsx';


function App() {

  const [userMe, setUserMe] = useState([])

  const [userPrav, setuserPrav] = useState([])

  const [SuperUser, setSuperUser] = useState([])

  const [NameUser, setNameUser] = useState([])

  const apiUrl = process.env.REACT_APP_API_URL;

  const loginEndpoint = '/api/users_admin/me';

  const token = localStorage.getItem('access_token');

  const { refreshToken } = useAuth();

  const location = useLocation();

  const [IdUser, setIdUser] = useState() 

  useEffect(() => {

    if (location.pathname !== '/Login') {

      const url = `${apiUrl}${loginEndpoint}`;
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        })
        .then(res => {
          localStorage.setItem('userId', res.data._id.$oid);
          setUserMe(res.data.user.role);
          setuserPrav(res.data.user.role);
          setSuperUser(res.data.user.is_superuser);
          setNameUser(res.data.name);
        })

        .catch(error => {
          if (error.response && error.response.status === 401) {
            refreshToken();
          } else {
            // Handle other errors
          }
        });
    }
  }, [NameUser]);


  const [campId, setcampId] = useState([])

  const [PlacementId, setPlacementId] = useState([])

  const [count_documents, setcount_documents] = useState(0)

  const [count_documentsTwo, setcount_documentsTwo] = useState(0)

  const [page, setPage] = useState(1); // Initialize page state

  const [pageTwo, setPageTwo] = useState(1); // Initialize page state

  const handlePageChange = (newPage) => {

    if (newPage >= 1 && newPage <= Math.ceil(count_documents / 25)) {
      setPage(newPage);
    }

    scroll.scrollToTop({ duration: 500 }); 

  };



  const [Amount, setAmount] = useState([])

  const AmountGet = () => {

   const loginEndpoint = `/system_revenues`;

   const url = `${apiUrl}${loginEndpoint}`;

   axios
     .get(url, {
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       }
     })
     .then((res) => {

       setAmount(res.data)

     })
     .catch((error) => {

       if (error.response && error.response.status === 401) {

         refreshToken();

       } else {
   
       }
     });
 };
 
 useEffect(() => {
  AmountGet();
}, []);


  const commonRoute = (

    <>

          {/* <Route path="/admin_home" element={<Admin />} /> */}

          <Route path="/campaign-details/:campaign_id" element={<CampaignDetails />} />

          <Route path="/syte-details/:syte_id" element={<SyteDetails />} />

          <Route path='/Chat'  element={<Chat  NameUser={NameUser}/>} />

         {(userPrav.includes('placement_moderator')  || SuperUser ) &&  // Модерация

          <Route path='/Placement'  element={<PlaceMent setPlacementId={setPlacementId} handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

         }

         {(userPrav.includes('supermanager')  || SuperUser ) && // Размещения всех пользователей 

          <Route path='/PlacementAll'  element={<PlacementAll setPlacementId={setPlacementId} handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

         }

          {(userPrav.includes('manager')  || SuperUser ) && // Размещения моих пользователей 

          <Route path='/PlacementUsers'  element={<PlaceMentUsers setPlacementId={setPlacementId} handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          }


          { (userPrav.includes('admin') || SuperUser ) &&  

          <Route path="/invitation" element={<Invitation userMe={userMe} />} />

          }

          {( SuperUser ) &&

          <Route path='/statistics'  element={<Statisticss handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} setcount_documentsTwo={setcount_documentsTwo} count_documentsTwo={count_documentsTwo} pageTwo={pageTwo}/>} />

          }

          { (userPrav.includes('sitemoderator') || SuperUser ) &&       

          <Route path='/Venues'  element={<Venues handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          }

          { (userPrav.includes('sitemoderator') || SuperUser ) &&       

          <Route path='/VenuesSite'  element={<VenuesSite handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          }

          { (userPrav.includes('supermanager') || SuperUser ) &&       
          <Route path='/VenuesAll'  element={<VenuesAll handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>} />
          }

          { (userPrav.includes('manager') || SuperUser ) &&       
          <Route path='/VenuesMe'  element={<VenuesMe handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />
          }

          { (userPrav.includes('manager') || SuperUser ) &&       
          <Route path='/VenuesMeSite'  element={<VenuesMeSite handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />
          }

          <Route path='/InternalPage/:camp_id'  element={<InternalPage campId={campId}/>} />

          <Route path='/InternalPageVenues/:camp_id'  element={<InternalPageVenues />} />

          <Route path='/InternalPageVenuesAll/:camp_id'  element={<InternalPageVenuesTwo
          
          handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}

          />} />

          <Route path='/InternalModer/:site_id'  element={<InternalModer />} />

          <Route path='/InternalMeModer/:site_id'  element={<InternalMeModer />} />    

          <Route path='/PlacementOne/:one_id'  element={<PlaceMentOne />} />     

          <Route path='/PlacementTwo/:two_id'  element={<PlaceMentTwo handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>} />   

          <Route path='/PlacementSite/:three_id'  element={<PlacementSite />} />     

          <Route path='/ManagerOne/:id'  element={<ManagerOne handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>} />     

          { (userPrav.includes('advmoderator') || SuperUser ) && // moderation

          <Route path="/Moderation" element={<Moderation handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>} />

          }     

          
          {(userPrav.includes('supermanager') || SuperUser ) && // Кампании всех пользователей

            <Route path='/Advertising'  element={<Advertising setcampId={setcampId} handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}  />} />  

          }

                    
          {(userPrav.includes('manager') || SuperUser ) && // Кампании моих пользователей

            <Route path='/AdvertisingMe'  element={<AdvertisingMe  handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          }


          {(userPrav.includes('manager') || userPrav.includes('supermanager') || SuperUser ) &&

          <Route path='/Manager'  element={<Manager  handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents}/>} />

          }

          {(userPrav.includes('manager') || userPrav.includes('supermanager') || SuperUser ) &&

          <Route path='/UserMe'  element={<UserMe handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          }

          <Route path='/MyAdvertisingComp'  element={<MyAdvertisingComp handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />
          
          <Route path='/LegalForms'  element={<LegalForms handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/LegalFormsCard/:Id'  element={<LegalFormsCard />} />

          <Route path='/Applications'  element={<Applications handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/ApplicationsModer'  element={<ApplicationsModer handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/ApplicationsCard/:Id'  element={<ApplicationsCard />} />

          <Route path='/ApplicationsCardModer/:Id'  element={<ApplicationsCardModer />} />

          <Route path='/Acts'  element={<Acts handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/Invoices'  element={<Invoices handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/Payments'  element={<Payments handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

          <Route path='/Payouts'  element={<Payouts handlePageChange={handlePageChange}  setcount_documents={setcount_documents} page={page} count_documents={count_documents} />} />

    </>

  );



  return (

    <div className="app">

      <ScrollTop />

      {token ? <Header userPrav={userPrav} NameUser={NameUser} SuperUser={SuperUser} Amount={Amount} /> : null }

        <Routes>

          <Route path='/'  element={ token ? <Navigate to="/statistics" /> : <Navigate to="/Login" /> } />

          <Route path='/Login'  element={<Register />} />

          <Route path='/restoring'  element={<Restoring />} />

          <Route path='/shipped'  element={<Shipped />} />

          <Route path='/passwordsuccessfully'  element={<ShippedTwo />} />

          <Route path='/newpassword/:token'  element={<NewPass />} />

          <Route path="*" element={<Navigate to="/404" />} />

          <Route path='/404' element={<NotFound />} />

          {token && commonRoute }
  
        </Routes>

    </div>
  
  );
}

export default App;
