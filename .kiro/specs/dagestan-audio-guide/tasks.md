# Детализированный план разработки MVP "Аудиогид по Дагестану"

**Статус:** Утвержден к исполнению  
**Стек:** Strapi (PostgreSQL), React Native  
**Принцип:** Не писать ни одной строчки кода для функционала, который можно получить из готовых FOSS-решений

---

## 📋 ФАЗА 1: Настройка фундамента и окружения

### 1.1 Настройка системы контроля версий

- [x] Создать новый репозиторий на GitHub/GitLab
- [x] Инициализировать Git, создать основную ветку main и ветку для разработки develop
- [x] Настроить .gitignore для Node.js, React Native проектов

- _Requirements: Инфраструктура проекта_

### 1.2 Настройка Backend (Strapi)

- [x] Развернуть локально PostgreSQL с помощью Docker

- [x] Создать базу данных и пользователя для проекта

- [x] Выполнить `npx create-strapi-app@latest backend --dbclient=postgres` для создания проекта Strapi

- [x] Подключить Strapi к созданной базе данных

- [x] Запустить Strapi в develop режиме, создать аккаунт администратора

- _Requirements: 5.1, 5.2_

### 1.3 Настройка Frontend (React Native)

- [x] Выполнить `npx react-native init mobile_app --template react-native-template-typescript`

- [x] Установить базовые зависимости: react-navigation, axios

-

- [x] Настроить структуру проекта согласно архитектуре

- _Requirements: 1.1, 7.1, 7.2, 7.3_

### 1.4 Настройка окружения разработки

- [x] Настроить ESLint и Prettier в обоих проектах (backend, mobile_app) для единого стиля кода

- [x] Настроить Husky pre-commit хуки для автоматической проверки кода перед коммитом

- [x] Создать shared/types директорию для общих TypeScript интерфейсов

- _Requirements: Качество кода_

---

## 🛠️ ФАЗА 2: Backend и Admin-панель (Контент-менеджмент)

### 2.1 Создание моделей данных в Strapi

- [x] Через UI админки Strapi создать "Content Type" Tour со полями:
  - name (Text), description (Rich Text), fullDescription (Rich Text)
  - main_image (Media), main_audio (Media)
  - durationMinutes (Number), distanceMeters (Number), priceCents (Number)
  - attributes (Enumeration: new, popular)

- [x] Создать "Content Type" PointOfInterest со полями:
  - name (Text), description (Rich Text), audio (Media)
  - coordinates (JSON), isFree (Boolean), orderIndex (Number)

- [x] Создать отношение "one-to-many": Tour -> PointsOfInterest

- [x] Создать "Content Type" AppUser для отслеживания устройств:
  - deviceId (Text, unique), platform (Enumeration), purchasedTours (Relation)

- _Requirements: 1.1, 1.2, 2.1, 3.1, 4.1_

### 2.2 Настройка API доступов

- [x] В Settings -> Roles -> Public разрешить действия find и findOne для Tour и PointOfInterest
- [x] Настроить приватные права для User и Purchase операций
- [x] Протестировать базовые API endpoints: `/api/tours`, `/api/point-of-interests`
- _Requirements: 4.1, 4.4_

### 2.3 Реализация кастомного парсера KML/GPX

- [x] С помощью CLI (`strapi generate`) создать новый кастомный API route-uploader
- [x] Установить библиотеку xml2js в проект Strapi
- [x] В контроллере этого API реализовать логику для POST /api/route-uploader:
  - Написать код для чтения загруженного файла (KML/GPX)
  - Написать парсер, который извлекает из XML-структуры Placemark или wpt данные
  - Использовать strapi.entityService.create для создания записей PointOfInterest
- [x] Добавить валидацию координат и структуры файлов
- _Requirements: 6.1, 6.2, 6.3_

### 2.4 Тестирование и наполнение контентом

- [x] Через админку вручную создать 2-3 тестовых тура
- [x] Для одного из туров загрузить KML-файл через Postman/Insomnia
- [x] Проверить, что в базе данных создались нужные POI и привязались к туру
- [x] Протестировать все CRUD операции через Strapi Admin UI
- _Requirements: 5.1, 6.3_

---

## 📱 ФАЗА 3: Разработка мобильного приложения (Клиентская часть)

### 3.1 Установка всех зависимостей

- [x] `npm install react-native-yamap react-native-iap react-native-track-player react-native-fs @react-native-async-storage/async-storage`
- [x] Настроить Android permissions и iOS Info.plist для всех библиотек
- [x] Создать базовые сервисы для всех библиотек (trackPlayerService, storageService, iapService, fileService, mapService)
- [ ] Выполнить `pod install` для iOS (требует macOS окружение)
- _Requirements: 2.2, 3.1, 4.2, 4.3_

### 3.2 Создание API-слоя и навигации

- [x] Создать сервис api.ts с функциями getTours() и getTourDetails(id), использующими Axios для запросов к Strapi
- [x] Настроить StackNavigator (React Navigation) с экранами Home, TourDetail, Map
- [x] Создать типы TypeScript для всех API ответов
- [x] Добавить обработку ошибок и loading состояний
- _Requirements: 1.1, 2.1_

### 3.3 Реализация экранов (UI)

- [ ] HomeScreen: вызвать getTours() в useEffect, отобразить список туров в виде карточек
- [ ] TourDetailScreen: получить id тура из параметров навигации, вызвать getTourDetails(id)
- [ ] Отобразить всю информацию о туре и кнопку "Начать тур"
- [ ] Добавить pull-to-refresh функциональность на HomeScreen
- _Requirements: 1.1, 1.2, 1.3, 2.1, 2.3_

### 3.4 Интеграция и настройка карты

- [ ] MapScreen: получить данные маршрута (координаты линии и точек) из параметров
- [ ] Использовать компонент `<YaMap>` из react-native-yamap
- [ ] Нарисовать линию маршрута с помощью компонента `<Polyline>`
- [ ] В цикле .map() отрендерить все POI с помощью компонента `<Marker>`
- [ ] Настроить стиль карты (JSON-стили), чтобы убрать лишние объекты
- _Requirements: 3.1, 3.2, 3.3, 3.4_

### 3.5 Реализация интерактивности и бизнес-логики

- [ ] Добавить onPress на каждый `<Marker>`, который будет обновлять state с selectedPOI
- [ ] Создать компонент POIPopup, который будет отображаться при изменении selectedPOI
- [ ] Логика аудио: Настроить react-native-track-player
- [ ] При нажатии на кнопку "play" в POIPopup или на TourDetailScreen, запускать воспроизведение
- [ ] Логика Freemium/Paywall:
  - Добавить проверку: `if (poi_index > 2 && !isPurchased) { setPaywallVisible(true) }`
  - Создать модальное окно Paywall
  - Настроить кнопки "Купить", которые вызывают requestPurchase() из react-native-iap
  - Настроить "слушатель" обновлений покупок для сохранения статуса в AsyncStorage
- _Requirements: 2.2, 3.4, 4.1, 4.2, 4.3, 4.4_

---

## 🎨 ФАЗА 4: Финализация, тестирование и развертывание

### 4.1 Развертывание Backend (Strapi)

- [ ] Подготовить Strapi к production-режиму (NODE_ENV=production)
- [ ] Развернуть приложение Strapi на хостинге клиента, используя PM2 для управления процессом
- [ ] Настроить веб-сервер (Nginx) как reverse-proxy для Strapi
- [ ] Настроить SSL сертификаты и домен
- _Requirements: 7.4_

### 4.2 Сквозное тестирование (E2E)

- [ ] Провести полное ручное тестирование всего функционала на реальных устройствах Android и iOS
- [ ] Использовать sandbox-аккаунты для тестирования покупок
- [ ] Протестировать все платежные сценарии (iOS, Android, RuStore)
- [ ] Проверить работу с различными KML/GPX файлами
- _Requirements: 7.1, 7.2, 7.3, 4.2, 4.3_

### 4.3 Подготовка сборок мобильного приложения

- [ ] Сгенерировать иконки и сплэш-скрины всех необходимых размеров
- [ ] Настроить build.gradle и Info.plist для production
- [ ] Создать подписанный .aab файл для Google Play / RuStore
- [ ] Создать архив (.ipa) в Xcode для App Store
- [ ] Подготовить privacy policy и terms of service
- _Requirements: 7.1, 7.2, 7.3_

### 4.4 Публикация

- [ ] Заполнить все необходимые метаданные в консолях разработчиков
- [ ] Подготовить скриншоты и описания для всех сторов
- [ ] Загрузить сборки в Google Play, App Store, RuStore и отправить на ревью
- [ ] Настроить мониторинг и аналитику для production
- _Requirements: 7.1, 7.2, 7.3_

---

## 📊 Временные рамки и приоритеты

**Фаза 1:** 1 неделя (критический путь)  
**Фаза 2:** 1-2 недели (backend готов, админка из коробки)  
**Фаза 3:** 2-3 недели (основная разработка мобильного приложения)  
**Фаза 4:** 1 неделя (тестирование и деплой)

**Общий срок:** 5-7 недель

**Преимущества FOSS-подхода:**
✅ Готовая админка - Strapi Admin UI из коробки  
✅ Готовый API - REST endpoints генерируются автоматически  
✅ Готовая медиатека - загрузка файлов без дополнительного кода  
✅ Готовая аутентификация - система ролей и прав доступа  
✅ Фокус на бизнес-логике - 80% времени на уникальные фичи
