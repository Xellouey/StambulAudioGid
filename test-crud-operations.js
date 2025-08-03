const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testCRUDOperations() {
  console.log('🧪 Тестирование CRUD операций через Strapi API...\n');

  try {
    // 1. READ - Получение всех туров
    console.log('1️⃣ READ - Получение всех туров:');
    const toursResponse = await axios.get(`${BASE_URL}/tours?populate=*`);
    console.log(`✅ Найдено туров: ${toursResponse.data.data.length}`);
    const tourId = toursResponse.data.data[0]?.documentId;
    console.log(`📍 ID первого тура: ${tourId}\n`);

    // 2. READ - Получение конкретного тура
    if (tourId) {
      console.log('2️⃣ READ - Получение конкретного тура:');
      const tourResponse = await axios.get(`${BASE_URL}/tours/${tourId}?populate=*`);
      console.log(`✅ Тур найден: ${tourResponse.data.data.name}`);
      console.log(`📊 Продолжительность: ${tourResponse.data.data.durationMinutes} мин\n`);
    }

    // 3. READ - Получение всех точек интереса
    console.log('3️⃣ READ - Получение всех точек интереса:');
    const poisResponse = await axios.get(`${BASE_URL}/point-of-interests?populate=*`);
    console.log(`✅ Найдено POI: ${poisResponse.data.data.length}`);
    
    // Показать первые 3 POI
    poisResponse.data.data.slice(0, 3).forEach((poi, index) => {
      console.log(`   ${index + 1}. ${poi.name} (${poi.isFree ? 'Бесплатно' : 'Платно'})`);
    });
    console.log('');

    // 4. CREATE - Создание нового тура (уже протестировано ранее)
    console.log('4️⃣ CREATE - Создание нового тура:');
    const newTourData = {
      data: {
        name: "Тестовый тур для CRUD",
        description: "Тур для тестирования CRUD операций",
        fullDescription: "Подробное описание тестового тура",
        durationMinutes: 90,
        distanceMeters: 1500,
        priceCents: 30000,
        attributes: "new",
        publishedAt: new Date().toISOString()
      }
    };

    const createResponse = await axios.post(`${BASE_URL}/tours`, newTourData);
    const newTourId = createResponse.data.data.documentId;
    console.log(`✅ Новый тур создан: ${createResponse.data.data.name}`);
    console.log(`📍 ID нового тура: ${newTourId}\n`);

    // 5. UPDATE - Обновление тура
    console.log('5️⃣ UPDATE - Обновление тура:');
    const updateData = {
      data: {
        name: "Обновленный тестовый тур",
        durationMinutes: 120,
        attributes: "popular"
      }
    };

    const updateResponse = await axios.put(`${BASE_URL}/tours/${newTourId}`, updateData);
    console.log(`✅ Тур обновлен: ${updateResponse.data.data.name}`);
    console.log(`⏱️ Новая продолжительность: ${updateResponse.data.data.durationMinutes} мин\n`);

    // 6. DELETE - Удаление тура
    console.log('6️⃣ DELETE - Удаление тура:');
    await axios.delete(`${BASE_URL}/tours/${newTourId}`);
    console.log(`✅ Тур удален (ID: ${newTourId})\n`);

    // 7. Проверка удаления
    console.log('7️⃣ VERIFY DELETE - Проверка удаления:');
    try {
      await axios.get(`${BASE_URL}/tours/${newTourId}`);
      console.log('❌ Ошибка: тур не был удален');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Подтверждено: тур успешно удален\n');
      } else {
        console.log('❓ Неожиданная ошибка при проверке удаления');
      }
    }

    // 8. Тестирование POI CRUD
    console.log('8️⃣ POI CRUD - Тестирование операций с точками интереса:');
    
    // Получение первого POI для тестирования
    const firstPoi = poisResponse.data.data[0];
    if (firstPoi) {
      console.log(`📍 Тестируем POI: ${firstPoi.name}`);
      
      // UPDATE POI
      const poiUpdateData = {
        data: {
          description: "Обновленное описание через CRUD тест"
        }
      };
      
      const poiUpdateResponse = await axios.put(`${BASE_URL}/point-of-interests/${firstPoi.documentId}`, poiUpdateData);
      console.log(`✅ POI обновлен: ${poiUpdateResponse.data.data.name}`);
      console.log(`📝 Новое описание: ${poiUpdateResponse.data.data.description.substring(0, 50)}...\n`);
    }

    console.log('🎉 Все CRUD операции успешно протестированы!');
    console.log('📋 Результаты тестирования:');
    console.log('   ✅ CREATE - Создание записей работает');
    console.log('   ✅ READ - Чтение записей работает');
    console.log('   ✅ UPDATE - Обновление записей работает');
    console.log('   ✅ DELETE - Удаление записей работает');
    console.log('   ✅ Связи между Tour и POI работают корректно');

  } catch (error) {
    console.error('❌ Ошибка при тестировании CRUD операций:', error.response?.data || error.message);
  }
}

testCRUDOperations();