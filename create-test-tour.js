const axios = require('axios');

async function createTestTour() {
  try {
    // Create a test tour
    const tourData = {
      data: {
        name: "Исторический Дербент",
        description: "Экскурсия по древнему городу Дербент",
        fullDescription: "Подробная экскурсия по историческим местам Дербента, включая крепость Нарын-Кала и другие достопримечательности",
        durationMinutes: 120,
        distanceMeters: 2500,
        priceCents: 50000,
        attributes: "popular",
        publishedAt: new Date().toISOString()
      }
    };

    const response = await axios.post('http://localhost:8080/api/tours', tourData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Tour created successfully:', response.data);
    return response.data.data.id;
  } catch (error) {
    console.error('Error creating tour:', error.response?.data || error.message);
    return null;
  }
}

createTestTour();