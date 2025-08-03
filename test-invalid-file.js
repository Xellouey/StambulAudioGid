const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testInvalidFile() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('invalid-file.txt'));
    form.append('tourId', '2');

    const response = await axios.post('http://localhost:8080/api/route-uploader', form, {
      headers: {
        ...form.getHeaders(),
      }
    });

    console.log('Unexpected success:', response.data);
  } catch (error) {
    console.log('Expected validation error:', error.response?.data || error.message);
  }
}

testInvalidFile();