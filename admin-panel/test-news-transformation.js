// Test news data transformation
const axios = require('axios');

async function testNewsTransformation() {
  try {
    console.log('Testing News Data Transformation...');
    
    // Test news API
    const newsResponse = await axios.get('http://localhost:3001/api/news?page=1&limit=2');
    console.log('\n=== Raw API Response ===');
    console.log('Success:', newsResponse.data.success);
    console.log('Data length:', newsResponse.data.data?.length || 0);
    console.log('Pagination:', newsResponse.data.pagination);
    
    if (newsResponse.data.data && newsResponse.data.data.length > 0) {
      console.log('\n=== Sample Raw News Item ===');
      const rawItem = newsResponse.data.data[0];
      console.log('ID:', rawItem._id);
      console.log('Title:', rawItem.title);
      console.log('Status:', rawItem.status);
      console.log('Has category:', !!rawItem.category);
      console.log('Category data:', rawItem.category);
      console.log('Has author:', !!rawItem.author);
      console.log('Author data:', rawItem.author);
      console.log('CreatedBy:', rawItem.createdBy);
      console.log('All fields:', Object.keys(rawItem));
      
      // Test transformation
      console.log('\n=== Transformed News Item ===');
      const transformedItem = {
        id: rawItem._id,
        title: rawItem.title,
        content: rawItem.content,
        excerpt: rawItem.excerpt,
        category: {
          id: 'default',
          name: 'Без категории',
          slug: 'uncategorized',
          color: '#6B7280',
          icon: 'document-text',
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: rawItem.status,
        publishedAt: rawItem.publishedAt,
        createdAt: rawItem.createdAt,
        updatedAt: rawItem.updatedAt,
        author: {
          id: rawItem.createdBy || 'unknown',
          email: 'unknown@example.com',
          name: 'Неизвестный автор',
          role: 'EDITOR',
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        imageUrl: rawItem.imageUrl,
        seoTitle: rawItem.seoTitle,
        seoDescription: rawItem.seoDescription,
        seoKeywords: rawItem.seoKeywords?.join(', ') || ''
      };
      
      console.log('Transformed ID:', transformedItem.id);
      console.log('Transformed Title:', transformedItem.title);
      console.log('Transformed Category:', transformedItem.category.name);
      console.log('Transformed Author:', transformedItem.author.name);
      console.log('Transformed Status:', transformedItem.status);
    }
    
  } catch (error) {
    console.error('Test Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testNewsTransformation();
