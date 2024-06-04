import axios from 'axios';
import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const apiUrl = process.env.REACT_APP_API_URL;
  
  const refresh_token = localStorage.getItem('refresh_token');
  
  const refreshToken = () => {    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${apiUrl}/api/auth/refresh`,
      headers: { 
        'Authorization': `Bearer ${refresh_token}`
      }
    };
   
    axios.request(config)
    .then((response) => {
          if (response.status === 200) {
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
          }

    })

    .catch((error) => {

    });

  };

  const setupTokenRefresh = () => {

    const access_token = localStorage.getItem('access_token');

    if (access_token) {

      const expirationTime = Number(localStorage.getItem('expiration_time')); 

      const currentTime = Date.now();

      if (expirationTime > currentTime) {
        const timeUntilRefresh = expirationTime - currentTime;
        setTimeout(() => {
          refreshToken();
          setupTokenRefresh(); 
        }, timeUntilRefresh);
      }
    }
  };


  useEffect(() => {
    setupTokenRefresh();
  }, []);


  return (
    <AuthContext.Provider value={{ refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
