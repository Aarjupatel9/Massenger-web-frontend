const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/loginForWeb", // Adjust the API endpoint path as needed
    createProxyMiddleware({
      target: "http://13.234.177.94:10000", // Your Node.js backend server URL (HTTP)
      changeOrigin: true,
    })
  );
};
