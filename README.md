# Book Catalog API (NestJS + TypeORM + PostgreSQL)

REST API для управления книжным каталогом с сущностями: **Авторы**, **Жанры**, **Книги**, **Отзывы**, **Пользователи**.  
Реализованы CRUD-операции, пагинация, фильтрация, связи между сущностями и интеграционные тесты.

##  Стек технологий
- **NestJS** – серверный фреймворк
- **TypeORM** – ORM для работы с PostgreSQL
- **PostgreSQL** – база данных (локальная или Docker)
- **Jest + supertest** – интеграционное тестирование
- **class-validator** – валидация DTO
- **dotenv** – управление переменными окружения

##  Установка и запуск

### 1. Клонирование репозитория
git clone https://github.com/oloncdar-code/book-catalog.git
cd book-catalog

### 2. Установка зависимостей
npm install

### 3. Настройка базы данных
Через Docker
bash
docker run --name book-catalog-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=book_catalog -p 5432:5432 -d postgres

Локально
Установите PostgreSQL.

Создайте базу данных: createdb book_catalog

В файле .env укажите строку подключения.

### 4. Конфигурация .env
Создайте файл .env в корне проекта:

text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/book_catalog

### 5. Запуск миграций
Миграции созданы автоматически при синхронизации (в тестовом режиме).
Если вы хотите применить их вручную:

bash
npm run migration:run
Примечание: В данном проекте используется synchronize: true для упрощения разработки. Для продакшена рекомендуется отключить.

### 6. Запуск приложения
bash
# Режим разработки (с автоматической перезагрузкой)
npm run start:dev

# Production
npm run build
npm run start
Сервер будет доступен по адресу: http://localhost:3000

# API Эндпоинты
Пользователи (/users)
Метод	Эндпоинт	Описание
POST	/users	Создать пользователя
GET	/users	Получить всех пользователей
GET	/users/:id	Получить пользователя по ID
PUT	/users/:id	Обновить пользователя
DELETE	/users/:id	Удалить пользователя

Авторы (/authors)
Аналогичные CRUD-эндпоинты. При получении автора подгружаются его книги.

Жанры (/genres)
Аналогичные CRUD-эндпоинты. При получении жанра подгружаются книги этого жанра.

Книги (/books)
Метод	Эндпоинт	Описание
POST	/books	Создать книгу
GET	/books	Получить список книг (пагинация, фильтрация)
GET	/books/:id	Получить книгу по ID (с автором, жанром, отзывами)
PUT	/books/:id	Обновить книгу
DELETE	/books/:id	Удалить книгу

Параметры GET /books:

page – номер страницы (по умолчанию 1)
limit – записей на странице (по умолчанию 10, максимум 100)
title – поиск по названию
authorId – фильтр по автору
genreId – фильтр по жанру
minPrice / maxPrice – фильтр по цене

Отзывы (/reviews)
Аналогичные CRUD-эндпоинты. При получении отзыва подгружаются книга и пользователь.

# Тестирование
bash
# Запуск всех тестов
npm run test

# Запуск с покрытием
npm run test -- --coverage
Тесты проверяют все CRUD-операции, пагинацию, фильтрацию и связи между сущностями.

# Cтруктура проекта
text
src/
├── authors/        # Модуль авторов (entity, service, controller, dto)
├── genres/         # Модуль жанров
├── books/          # Модуль книг (с фильтрацией и пагинацией)
├── reviews/        # Модуль отзывов
├── users/          # Модуль пользователей
├── migrations/     # Миграции TypeORM
├── app.module.ts   # Корневой модуль
└── main.ts         # Точка входа

# Разработка и расширение
Проект построен на NestJS и TypeORM, что позволяет легко добавлять новые сущности и модули.
Для генерации нового модуля:


nest generate module <name>
nest generate service <name>
nest generate controller <name>

# Связь
Автор: Olontseva Daria
GitHub: oloncdar-code

