const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Keep the /api prefix
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Backend server unavailable' });
  }
}));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'Frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend/build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`🔄 Proxying API requests to http://localhost:5001`);
});
