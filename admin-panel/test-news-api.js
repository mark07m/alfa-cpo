// Test news API from admin panel
const axios = require('axios');

async function testNewsAPI() {
  try {
    console.log('Testing News API...');
    
    // Test news API with pagination
    const newsResponse = await axios.get('http://localhost:3001/api/news?page=1&limit=10');
    console.log('News API Response:');
    console.log('- Success:', newsResponse.data.success);
    console.log('- Data length:', newsResponse.data.data?.length || 0);
    console.log('- Pagination:', newsResponse.data.pagination);
    
    // Test categories API
    const categoriesResponse = await axios.get('http://localhost:3001/api/news/categories');
    console.log('\nCategories API Response:');
    console.log('- Success:', categoriesResponse.data.success);
    console.log('- Data length:', categoriesResponse.data.data?.length || 0);
    
    // Test the mapping logic
    console.log('\nTesting mapping logic:');
    const mappedNews = {
      news: newsResponse.data.data,
      pagination: newsResponse.data.pagination
    };
    console.log('- Mapped news length:', mappedNews.news?.length || 0);
    console.log('- Mapped pagination:', mappedNews.pagination);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testNewsAPI();
