const { createProxyMiddleware } = require('http-proxy-middleware');

const apiUrl = process.env.REACT_APP_API_URL;

module.exports = function(app) {

  app.use(

    '/api',

    createProxyMiddleware({

      target: `${apiUrl}`,
      changeOrigin: true,
    })
    
  );
  
};
