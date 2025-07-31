const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Proxy API requests to backend
app.use('/api', async (req, res) => {
  try {
    console.log(`🔄 Proxying ${req.method} ${req.url} to backend`);
    
    const backendUrl = `http://localhost:5001${req.url}`;
    const response = await axios({
      method: req.method,
      url: backendUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: 'localhost:5001',
      },
      timeout: 10000
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        error: 'Backend server unavailable',
        message: error.message 
      });
    }
  }
});

// Health check for the proxy
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server running', timestamp: new Date().toISOString() });
});

// Serve React static files (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/build', 'index.html'));
  });
} else {
  // In development, redirect to React dev server
  app.get('*', (req, res) => {
    res.redirect('http://localhost:3001' + req.url);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Combined server running on port ${PORT}`);
  console.log(`🔄 Proxying API requests to http://localhost:5001`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🎨 Frontend development server expected on http://localhost:3001`);
  }
});
