# Technology Stack (FOSS-стратегия)

## Философия выбора технологий
**Максимальное использование готовых open-source решений для минимизации времени разработки и фокуса на уникальной бизнес-логике.**

---

## Backend + Admin Panel (Strapi)
- **Framework**: Strapi 4.x (Headless CMS)
- **Database**: PostgreSQL 
- **Runtime**: Node.js 18+
- **Admin Panel**: Встроенная Strapi Admin UI (React-based)
- **API**: Автогенерируемый REST API + кастомные endpoints
- **File Upload**: Встроенная Strapi Media Library
- **Authentication**: Встроенная система ролей и JWT токенов

### Кастомные дополнения в Strapi:
- **File Parsing**: xml2js для KML/GPX парсинга
- **Payment Integration**: Кастомные endpoints для валидации receipts
- **User Management**: Кастомная логика для device-based пользователей

---

## Mobile App (React Native)
- **Framework**: React Native 0.72+
- **Navigation**: React Navigation v6
- **Maps**: react-native-yamap (Yandex MapKit)
- **Audio**: react-native-track-player
- **Payments**: react-native-iap (iOS/Android) + WebView (RuStore)
- **HTTP Client**: Axios для работы с Strapi API
- **State Management**: React Context + useState (простота для MVP)
- **Storage**: AsyncStorage для локального кэширования

---

## Shared Resources
- **Language**: TypeScript throughout
- **Types**: Централизованные типы в `/shared/types`
- **Linting**: ESLint + Prettier
- **Package Manager**: npm с workspaces
- **Version Control**: Git с conventional commits

---

## Infrastructure & Deployment
- **Development**: Docker Compose (PostgreSQL + Strapi)
- **Production**: VPS с Docker (простой деплой)
- **File Storage**: Локальное хранение файлов (для MVP)
- **Database**: PostgreSQL (managed или self-hosted)

---

## Development Tools
- **API Testing**: Встроенная Strapi документация + Postman
- **Mobile Testing**: React Native Debugger + Flipper
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Version Control**: Git с feature branches

---

## Что НЕ используем (экономия времени)
❌ **Custom Express.js server** - заменен на Strapi  
❌ **Custom Admin Panel** - используем Strapi Admin UI  
❌ **Custom ORM setup** - Strapi использует встроенную ORM  
❌ **Custom Authentication** - встроенная система Strapi  
❌ **Custom File Upload** - встроенная Media Library  
❌ **Redis caching** - не нужно для MVP  
❌ **Complex state management** - React Context достаточно  
❌ **Microservices** - монолитный Strapi проще для MVP  

---

## Преимущества выбранного стека

### 🚀 Скорость разработки
- Strapi генерирует API автоматически
- Готовая админка из коробки
- Встроенная система загрузки файлов

### 💰 Экономическая эффективность  
- Все инструменты бесплатные и open-source
- Минимальные требования к хостингу
- Быстрый time-to-market

### 🔧 Гибкость
- Strapi позволяет добавлять кастомную логику
- React Native поддерживает все нужные платформы
- TypeScript обеспечивает type safety

### 📈 Масштабируемость
- Strapi может расти вместе с проектом
- PostgreSQL подходит для любых объемов данных
- React Native позволяет добавлять новые платформы

---

## Команды для быстрого старта

### Инициализация проекта
```bash
# Создание Strapi проекта
npx create-strapi-app@latest backend --quickstart --no-run
cd backend && npm install

# Создание React Native проекта  
npx react-native@latest init DagestanAudioGuide --template react-native-template-typescript
cd DagestanAudioGuide && npm install

# Настройка workspace
npm init -w backend -w mobile
```

### Разработка
```bash
# Запуск Strapi (backend + admin)
cd backend && npm run develop

# Запуск React Native
cd mobile && npm run android
# или
cd mobile && npm run ios
```

### Деплой
```bash
# Сборка Strapi для production
cd backend && npm run build

# Сборка мобильного приложения
cd mobile && npm run build:android
cd mobile && npm run build:ios
```

---

## Итог

Этот стек позволяет создать полноценный MVP за 5-7 недель с минимальными затратами, используя проверенные open-source решения. Фокус на бизнес-логике, а не на инфраструктуре.