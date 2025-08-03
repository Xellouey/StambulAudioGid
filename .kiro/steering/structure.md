# Project Structure (FOSS-стратегия)

## Root Level Organization
```
dagestan-audio-guide/
├── backend/              # Strapi CMS (Backend + Admin Panel)
├── mobile/               # React Native mobile app
├── shared/               # Shared TypeScript types
├── .kiro/                # Kiro AI assistant configuration
├── docker-compose.yml    # PostgreSQL + Strapi для разработки
└── package.json          # Workspace configuration
```

## Backend Structure (Strapi-based)
```
backend/
├── src/
│   ├── api/              # Автогенерируемые API endpoints
│   │   ├── tour/         # Tour Content Type API
│   │   ├── poi/          # POI Content Type API
│   │   └── user/         # User Content Type API
│   ├── components/       # Переиспользуемые компоненты Strapi
│   ├── extensions/       # Кастомные расширения Strapi
│   │   ├── users-permissions/  # Расширение системы пользователей
│   │   └── upload/       # Расширение загрузки файлов
│   └── plugins/          # Кастомные плагины
│       └── route-parser/ # Плагин для парсинга KML/GPX
├── config/               # Конфигурация Strapi
│   ├── database.js       # Настройки PostgreSQL
│   ├── server.js         # Настройки сервера
│   └── plugins.js        # Конфигурация плагинов
├── public/               # Статические файлы и загруженные медиа
└── package.json          # Зависимости Strapi
```

## Mobile App Structure
```
mobile/
├── src/
│   ├── components/       # Переиспользуемые UI компоненты
│   ├── screens/          # Экраны приложения
│   │   ├── HomeScreen.tsx
│   │   ├── TourDetailScreen.tsx
│   │   └── MapScreen.tsx
│   ├── services/         # API интеграция со Strapi
│   │   ├── strapiApi.ts  # HTTP клиент для Strapi
│   │   ├── tourService.ts
│   │   └── paymentService.ts
│   ├── navigation/       # React Navigation setup
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── types/            # Mobile-specific types
├── android/              # Android-specific files
├── ios/                  # iOS-specific files
└── package.json          # Mobile dependencies
```

## Shared Types Structure
```
shared/
└── types/
    ├── index.ts          # Основные типы (Tour, POI, User)
    ├── api.ts            # API request/response типы
    └── strapi.ts         # Strapi-specific типы
```

## Key Architectural Decisions

### 🎯 Strapi как единый backend
- **Content Types**: Tour, POI, User, Purchase создаются через Strapi Admin UI
- **API Generation**: REST endpoints генерируются автоматически
- **Admin Panel**: Встроенная админка для управления контентом
- **Custom Logic**: Добавляется через кастомные endpoints и плагины

### 📱 React Native как единственный клиент
- **Single Codebase**: Один код для iOS и Android
- **Platform-specific**: Платформо-специфичная логика изолирована
- **API Integration**: Прямое взаимодействие со Strapi API

### 🔄 Data Flow
```
Mobile App → Strapi API → PostgreSQL
     ↓
Strapi Admin UI → PostgreSQL
```

### 📁 File Organization Principles

1. **Feature-based**: Группировка по функциональности, не по типу файла
2. **Shared First**: Общие типы и утилиты в shared директории
3. **Platform Separation**: Платформо-специфичный код изолирован
4. **Convention over Configuration**: Следование конвенциям Strapi и React Native

### 🛠️ Development Workflow

1. **Content Modeling**: Создание Content Types в Strapi Admin UI
2. **API Development**: Добавление кастомной логики через endpoints
3. **Mobile Integration**: Интеграция с API в React Native
4. **Testing**: Тестирование через Strapi Admin UI и мобильное приложение

### 📦 Deployment Structure

```
Production/
├── strapi/               # Strapi backend
│   ├── app/             # Strapi application files
│   ├── uploads/         # Uploaded media files
│   └── database/        # PostgreSQL data
└── mobile-builds/       # Mobile app builds
    ├── android/         # .apk/.aab files
    └── ios/             # .ipa files
```

## Advantages of This Structure

### ✅ Simplicity
- Минимум кастомного кода
- Стандартные конвенции Strapi и React Native
- Понятная структура для любого разработчика

### ✅ Maintainability  
- Четкое разделение ответственности
- Автогенерируемый API код
- Типизированные интерфейсы

### ✅ Scalability
- Легко добавлять новые Content Types
- Простое расширение API функциональности
- Модульная архитектура мобильного приложения

### ✅ Developer Experience
- Hot reload в Strapi и React Native
- Встроенная документация API
- TypeScript поддержка везде

---

## Quick Start Commands

```bash
# Клонирование и настройка
git clone <repo>
cd dagestan-audio-guide
npm install

# Запуск разработки
npm run dev:backend    # Strapi на порту 1337
npm run dev:mobile     # React Native Metro bundler

# Доступ к админке
open http://localhost:1337/admin
```

Эта структура оптимизирована для быстрой разработки MVP с использованием готовых инструментов и минимизацией кастомного кода.