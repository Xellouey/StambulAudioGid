# Аудиогид по Дагестану

Мобильное приложение с аудиогидом по достопримечательностям Дагестана, использующее Strapi CMS для управления контентом.

## Архитектура (FOSS-стратегия)

Проект построен на готовых open-source решениях для минимизации времени разработки:

- **Backend**: Strapi 4.x (Headless CMS) с PostgreSQL
- **Admin Panel**: Встроенная Strapi Admin UI (React-based)
- **Mobile App**: React Native с TypeScript
- **API**: Автогенерируемый REST API от Strapi

## Структура проекта

```
dagestan-audio-guide/
├── backend/          # Strapi CMS (Backend + Admin Panel)
├── mobile/           # React Native мобильное приложение
├── shared/           # Общие TypeScript типы для Strapi API
└── docker-compose.yml # PostgreSQL для разработки
```

## Требования

- Node.js 18+
- npm
- Docker и Docker Compose (для PostgreSQL)
- React Native CLI (для мобильного приложения)

## Быстрый старт

### 1. Запуск базы данных

```bash
# Запуск PostgreSQL в Docker
docker-compose up -d
```

### 2. Настройка Strapi Backend

```bash
# Создание Strapi проекта (если еще не создан)
cd backend
npx create-strapi-app@latest . --dbclient=postgres --no-run

# Настройка окружения
cp .env.example .env
# Отредактируйте .env файл с настройками PostgreSQL

# Запуск Strapi в режиме разработки
npm run develop
```

### 3. Настройка мобильного приложения

```bash
cd mobile
npm install

# Для Android
npm run android

# Для iOS
npm run ios
```

### 4. Доступ к админке

После запуска Strapi откройте http://localhost:1337/admin для создания аккаунта администратора и управления контентом.

## Доступные скрипты

- `npm run install:all` - Установка зависимостей для всех проектов
- `npm run dev:backend` - Запуск Strapi в режиме разработки (порт 1337)
- `npm run dev:mobile` - Запуск React Native Metro bundler
- `npm run build:all` - Сборка Strapi для production
- `npm run lint` - Проверка кода линтером

## Технологии

### Backend (Strapi)
- Strapi 4.x Headless CMS
- PostgreSQL
- Встроенная система ролей и JWT
- Автогенерируемый REST API
- Встроенная Media Library

### Mobile App
- React Native с TypeScript
- React Navigation v6
- Yandex MapKit (react-native-yamap)
- React Native Track Player (аудио)
- React Native IAP (платежи)
- Axios (HTTP клиент для Strapi API)

## Content Types в Strapi

Проект использует следующие Content Types, создаваемые через Strapi Admin UI:

### Tour
- name (Text)
- description (Rich Text)
- fullDescription (Rich Text)
- main_image (Media)
- main_audio (Media)
- durationMinutes (Number)
- distanceMeters (Number)
- priceCents (Number)
- attributes (Enumeration: new, popular)

### Point of Interest
- name (Text)
- description (Rich Text)
- audio (Media)
- coordinates (JSON)
- isFree (Boolean)
- orderIndex (Number)
- tour (Relation to Tour)

### User
- deviceId (Text, unique)
- platform (Enumeration)
- purchasedTours (Relation)

## Разработка

### Добавление нового контента
1. Откройте Strapi Admin UI (http://localhost:1337/admin)
2. Создайте новые записи через Content Manager
3. API endpoints генерируются автоматически

### Кастомная логика
Для добавления кастомной бизнес-логики (например, парсинг KML/GPX файлов) используйте:
- Custom API routes в Strapi
- Custom controllers и services
- Plugins для переиспользуемой функциональности

### Мобильное приложение
Приложение взаимодействует с Strapi через REST API:
- `/api/tours` - список туров
- `/api/tours/:id?populate=*` - детали тура с POI
- `/api/point-of-interests` - точки интереса

## Преимущества FOSS-подхода

✅ **Готовая админка** - Strapi Admin UI из коробки  
✅ **Автогенерируемый API** - REST endpoints без написания кода  
✅ **Встроенная загрузка файлов** - Media Library для аудио и изображений  
✅ **Система ролей** - встроенная аутентификация и авторизация  
✅ **Быстрая разработка** - фокус на бизнес-логике, а не на инфраструктуре  

## Лицензия

MIT