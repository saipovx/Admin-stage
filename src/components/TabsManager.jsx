import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import t from '../components/MyTabs.module.scss'
import axios from 'axios';
import { useAuth } from '../AuthContext';
import {  useNavigate } from 'react-router-dom';

import TabCompaing from './TabCompaing';
import TabSites from './TabSites';
import TabPlacement from './TabPlacement';
import TabOffers from './TabOffers';
import TabTics from './TabTics';
import TabExpenses from './TabExpenses';
import TabIncnome from './TabIncnome';


const MyTabs = ({ storedCampIdData, setcount_documents, count_documents }) => {

  let ConnectionID = storedCampIdData.legal_entity && storedCampIdData.legal_entity._id

  let TiksID = storedCampIdData && storedCampIdData._id

  const token = localStorage.getItem('access_token');

  const apiUrl = process.env.REACT_APP_API_URL;

  const [spend, setSpend] = useState([]);
  const [AAccountId, setAAccountId] = useState([]);
  const { refreshToken } = useAuth();

  const navigate = useNavigate();

  const [pageSites, setPageSites] = useState(1);

  const [pageCompaing, setPageCompaing] = useState(1);

  const [pagePlacement, setPagePlacement] = useState(1);

  const [pageOffers, setPageOffers] = useState(1);

  const [pageTic, setPageTic] = useState(1);

  const [pageExp, setPageExp] = useState(1);

  const [pageInc, setPageInc] = useState(1);

  const loadDataCopm = (user_id) => {

    if (!user_id) {
      // Handle the case where user_id is not defined
      return;
    }
    
    const loginEndpoint = `/api/management/campaigns_for_user/${user_id || ''}?limit=25&page=${pageExp}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {

        setAdvertisingData(res.data.objects);
        setcount_documents(res.data.count_documents);
        setAAccountId(user_id);

      })
      .catch((error) => {
 

        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

  // useEffect(() => {
  //   if (storedCampIdData.legal_entity) {
  //     loadDataCopm(storedCampIdData.legal_entity._id);
  //   }
  // }, [pageCompaing, refreshToken, storedCampIdData]);

  const sites_account_id = (accountId) => {

    const loginEndpointTwo = `/api/management/sites_for_user/${accountId}?limit=25&page=${pageSites}`;

    const url = `${apiUrl}${loginEndpointTwo}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSpend(res.data.objects);
        setcount_documents(res.data.count_documents);
        setAAccountId(accountId);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

  // useEffect(() => {
  //   if (storedCampIdData.legal_entity) {
  //     sites_account_id(storedCampIdData.legal_entity && storedCampIdData.legal_entity._id);
  //   }
  // }, [storedCampIdData.legal_entity]);

  const [AdvertisingData, setAdvertisingData] = useState([]);

  const [PlaceData, setPlaceData] = useState([]);

  const loadDataPlace = (user_id) => {

    const loginEndpoint = `/api/management/placements_for_user/${user_id}?limit=25&page=${pagePlacement}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {

        setPlaceData(res.data.objects);
        setcount_documents(res.data.count_documents);
        setAAccountId(user_id);

      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

  // useEffect(() => {
  //   if (storedCampIdData.legal_entity) {
  //     loadDataPlace(storedCampIdData.legal_entity._id);
  //   }
  // }, [pagePlacement, refreshToken, storedCampIdData]);


  const [OffersData, setOffersData] = useState([]);

  const [status, setStatus] = useState(''); 

  const loadOffers = (user_id) => {

    const loginEndpoint = `/api/management/offers_for_user/${user_id}?limit=25&page=${pageOffers}${status ? `&status=${status}` : ''}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {

        setOffersData(res.data.objects);
        setcount_documents(res.data.count_documents);
        setAAccountId(user_id);

      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

  // useEffect(() => {
  //   if (storedCampIdData) {
  //     loadOffers(storedCampIdData._id);
  //   }
  // }, [pageOffers,status, refreshToken, storedCampIdData]);

  const [TicData, setTicData] = useState([]);


  ///////////////////////////////////////////////////////////////////////

  const loadTic = (user_id) => {

    const loginEndpoint = `/api/management/tickets_for_user/${user_id}?limit=25&page=${pageTic}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {

        setTicData(res.data.objects);
        setcount_documents(res.data.count_documents);
        setAAccountId(user_id);

      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          refreshToken();
        } else {
          // Handle other errors
        }
      });
  };

  // useEffect(() => {
  //   if (storedCampIdData) {
  //     loadTic(storedCampIdData._id);
  //   }
  // }, [pageTic, refreshToken, storedCampIdData]);

  // const [ExpensesData, setExpensesData] = useState([]);

  // const loadExpenses = (user_id) => {

  //   const loginEndpoint = `/api/management/spend_for_user/${user_id}?limit=25&page=${pageExp}`;

  //   const url = `${apiUrl}${loginEndpoint}`;

  //   axios

  //     .get(url, {
        
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },

  //     })
  //     .then((res) => {

  //       setExpensesData(res.data.objects);
  //       setcount_documents(res.data.count_documents);
  //       setAAccountId(user_id);


  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status === 401) {
  //         refreshToken();
  //       } else {
  //         // Handle other errors
  //       }
  //     });
  // };

  // useEffect(() => {
  //   loadExpenses(storedCampIdData.legal_entity && storedCampIdData.legal_entity._id);
  // }, [refreshToken, storedCampIdData, pageExp]);
  

  const [IncomeData, setIncomeData] = useState([]);

  const loadIncome = (user_id) => {
    
    const loginEndpoint = `/api/management/earn_for_user/${user_id}?limit=25&page=${pageInc}`;

    const url = `${apiUrl}${loginEndpoint}`;

    axios

      .get(url, {
        
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

      })
      .then((res) => {

        setIncomeData(res.data.objects);
        setAAccountId(user_id);
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

  // useEffect(() => {
  //   if (storedCampIdData._id) {
  //     loadIncome(storedCampIdData._id);
  //   }
  // }, [refreshToken, storedCampIdData, storedCampIdData._id]);


  return (

    <Tabs>

      <TabList style={{ listStyle: 'none', padding: 0, margin: 0, border: 'none', display: 'flex' }} className={t.tabs}>

        <Tab 
  
        className={t.tabs__item}
        
        id={ConnectionID}

        onClick={() => {

          // setPageExp(1);

          // if (ConnectionID) {
          //   loadExpenses(ConnectionID);
          // }
        }}

        >

          Расходы

        </Tab>

        <Tab 
        
        className={t.tabs__item}

        id={ConnectionID}

        onClick={() => {

          setPageInc(1);

          if (ConnectionID) {
            loadIncome(ConnectionID);
          }
        }}

        >

          Доходы

        </Tab>

        <Tab
          className={t.tabs__item}
          id={ConnectionID}

          onClick={() => {

            setPageSites(1);

            if (ConnectionID) {
              sites_account_id(ConnectionID);
            }
          }}
        >
          Сайты
        </Tab>

        <Tab
          className={t.tabs__item}
          id={ConnectionID}
          onClick={() => {

            setPageCompaing(1);

            if (ConnectionID) {
              loadDataCopm(ConnectionID);
            }
          }}
        >
          Кампании
        </Tab>

        <Tab
          className={t.tabs__item}
          id={ConnectionID}
          onClick={() => {

            setPagePlacement(1);

            if (ConnectionID) {
              loadDataPlace(ConnectionID);
            }

          }}
        >
          Размещения
        </Tab>

        <Tab
        
        className={t.tabs__item}

        id={TiksID}
        onClick={() => {

          setPageOffers(1);

          if (TiksID) {
            loadOffers(TiksID);
          }

        }}
        
        >
          Заявки
        
        </Tab>

       <Tab
        
        className={t.tabs__item}

        id={TiksID}
        onClick={() => {

          setPageTic(1);

          if (TiksID) {
            loadTic(TiksID);
          }

        }}
        
        >
          Тикеты
        </Tab>

      </TabList>

      <TabPanel>

        {/* <TabExpenses  ExpensesData={ExpensesData} count_documents={count_documents} AAccountId={AAccountId} handlePageChange={(newPage) => setPageExp(newPage)} page={pageExp}/> */}
      
      </TabPanel>

      <TabPanel>

        <TabIncnome IncomeData={IncomeData} count_documents={count_documents} AAccountId={AAccountId} handlePageChange={(newPage) => setPageInc(newPage)} page={pageInc}/>

      </TabPanel>

      <TabPanel>

        <TabSites
          handlePageChange={(newPage) => setPageSites(newPage)}
          setcount_documents={setcount_documents}
          page={pageSites}
          count_documents={count_documents}
          spend={spend}
          AAccountId={AAccountId}
        />

      </TabPanel>

      <TabPanel>

        <TabCompaing
          handlePageChange={(newPage) => setPageCompaing(newPage)}
          setcount_documents={setcount_documents}
          page={pageCompaing}
          count_documents={count_documents}
          AdvertisingData={AdvertisingData}
          AAccountId={AAccountId}
        />

      </TabPanel>

      <TabPanel>

        <TabPlacement
          handlePageChange={(newPage) => setPagePlacement(newPage)}
          setcount_documents={setcount_documents}
          page={pagePlacement}
          count_documents={count_documents}
          PlaceData={PlaceData}
          AAccountId={AAccountId}
        />

      </TabPanel>

      <TabPanel>

        <TabOffers OffersData={OffersData} setcount_documents={setcount_documents} count_documents={count_documents} 
        page={pageOffers}
        AAccountId={AAccountId}
        handlePageChange={(newPage) => setPageOffers(newPage)}
        setStatus={setStatus}
        status={status}
        />
        
      </TabPanel>

      <TabPanel>

      <TabTics TicData={TicData} />
        
      </TabPanel>

    </Tabs>

  );
};

export default MyTabs;
