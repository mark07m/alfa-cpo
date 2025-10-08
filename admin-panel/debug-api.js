// Debug API connection from admin panel
const axios = require('axios');

async function debugAPI() {
  try {
    console.log('=== Debugging API Connection ===');
    
    // Test 1: Basic API connection
    console.log('\n1. Testing basic API connection...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('Health check:', healthResponse.status);
    
    // Test 2: News API with detailed logging
    console.log('\n2. Testing news API...');
    const newsResponse = await axios.get('http://localhost:3001/api/news?page=1&limit=5');
    console.log('News API Status:', newsResponse.status);
    console.log('News API Headers:', newsResponse.headers);
    console.log('News API Data Structure:');
    console.log('- success:', newsResponse.data.success);
    console.log('- data type:', typeof newsResponse.data.data);
    console.log('- data length:', Array.isArray(newsResponse.data.data) ? newsResponse.data.data.length : 'not array');
    console.log('- pagination:', newsResponse.data.pagination);
    
    // Test 3: Categories API with detailed logging
    console.log('\n3. Testing categories API...');
    const categoriesResponse = await axios.get('http://localhost:3001/api/news/categories');
    console.log('Categories API Status:', categoriesResponse.status);
    console.log('Categories API Data Structure:');
    console.log('- success:', categoriesResponse.data.success);
    console.log('- data type:', typeof categoriesResponse.data.data);
    console.log('- data length:', Array.isArray(categoriesResponse.data.data) ? categoriesResponse.data.data.length : 'not array');
    
    // Test 4: Simulate the mapping logic
    console.log('\n4. Testing mapping logic...');
    const mappedNews = {
      news: newsResponse.data.data,
      pagination: newsResponse.data.pagination
    };
    console.log('Mapped news structure:');
    console.log('- news length:', mappedNews.news?.length || 0);
    console.log('- pagination:', mappedNews.pagination);
    
    // Test 5: Check if data is properly formatted
    if (mappedNews.news && mappedNews.news.length > 0) {
      console.log('\n5. Sample news item:');
      console.log('- ID:', mappedNews.news[0]._id || mappedNews.news[0].id);
      console.log('- Title:', mappedNews.news[0].title);
      console.log('- Status:', mappedNews.news[0].status);
    }
    
  } catch (error) {
    console.error('Debug Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
  }
}

debugAPI();
