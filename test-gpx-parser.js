const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testGpxParser() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('test-route.gpx'));
    form.append('tourId', '2'); // Test with existing tour ID

    const response = await axios.post('http://localhost:8080/api/route-uploader', form, {
      headers: {
        ...form.getHeaders(),
      }
    });

    console.log('GPX Parser test successful:', response.data);
  } catch (error) {
    console.error('GPX Parser test failed:', error.response?.data || error.message);
  }
}

testGpxParser();