const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testParser() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('test-route.kml'));
    form.append('tourId', '2'); // Test with ID 2

    const response = await axios.post('http://localhost:8080/api/route-uploader', form, {
      headers: {
        ...form.getHeaders(),
      }
    });

    console.log('Parser test successful:', response.data);
  } catch (error) {
    console.error('Parser test failed:', error.response?.data || error.message);
  }
}

testParser();