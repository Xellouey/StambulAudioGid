# Аудиогид по Дагестану

Мобильное приложение с аудиогидом по достопримечательностям Дагестана, включающее веб-панель администратора для управления контентом.

## Структура проекта

```
dagestan-audio-guide/
├── backend/          # Node.js/Express API сервер
├── mobile/           # React Native мобильное приложение
├── admin-panel/      # React веб-панель администратора
├── shared/           # Общие TypeScript типы и интерфейсы
└── docker-compose.yml # Конфигурация баз данных
```

## Требования

- Node.js 18+
- npm или yarn
- Docker и Docker Compose (для баз данных)
- React Native CLI (для мобильного приложения)

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установка зависимостей для всех проектов
npm run install:all
```

### 2. Запуск баз данных

```bash
# Запуск PostgreSQL и Redis в Docker
docker-compose up -d
```

### 3. Настройка backend

```bash
cd backend
cp .env.example .env
# Отредактируйте .env файл с вашими настройками

# Генерация Prisma клиента и миграции
npm run db:generate
npm run db:migrate
```

### 4. Запуск сервисов

```bash
# Backend (порт 3000)
npm run dev:backend

# Admin panel (порт 3001)
npm run dev:admin

# Mobile app (требует настройки React Native окружения)
cd mobile
npm run android  # или npm run ios
```

## Доступные скрипты

- `npm run install:all` - Установка зависимостей для всех проектов
- `npm run dev:backend` - Запуск backend в режиме разработки
- `npm run dev:admin` - Запуск админ-панели в режиме разработки
- `npm run build:all` - Сборка всех проектов
- `npm run lint` - Проверка кода линтером
- `npm run test` - Запуск тестов

## Технологии

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- Redis для кеширования
- JWT аутентификация

### Mobile App
- React Native
- TypeScript
- React Navigation
- Yandex MapKit
- React Query

### Admin Panel
- React + TypeScript
- Material-UI
- Vite
- React Query

## Разработка

Проект использует монорепозиторий с общими типами в папке `shared/`. Все компоненты используют одинаковые интерфейсы данных.

### Линтинг и форматирование

Проект настроен с ESLint и Prettier для всех компонентов:

```bash
npm run lint        # Проверка всех проектов
npm run lint:fix    # Автоисправление (где возможно)
```

### Тестирование

```bash
npm run test        # Запуск всех тестов
npm run test:watch  # Тесты в watch режиме
```

## Лицензия

MIT