// Test API connection from admin panel
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test news API
    const newsResponse = await axios.get('http://localhost:3001/api/news');
    console.log('News API Response:', newsResponse.data);
    
    // Test categories API
    const categoriesResponse = await axios.get('http://localhost:3001/api/news/categories');
    console.log('Categories API Response:', categoriesResponse.data);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
