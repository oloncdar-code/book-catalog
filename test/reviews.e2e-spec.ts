import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Review } from '../src/reviews/review.entity';
import { Book } from '../src/books/book.entity';
import { Author } from '../src/authors/author.entity';
import { Genre } from '../src/genres/genre.entity';
import { User } from '../src/users/user.entity';
import { ReviewsModule } from '../src/reviews/reviews.module';
import { BooksModule } from '../src/books/books.module';
import { AuthorsModule } from '../src/authors/authors.module';
import { GenresModule } from '../src/genres/genres.module';
import { UsersModule } from '../src/users/users.module';

describe('ReviewsController (e2e)', () => {
  let app: INestApplication;
  let reviewId: number;
  let bookId: number;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [Review, Book, Author, Genre, User],
          synchronize: true,
          dropSchema: true,
        }),
        AuthorsModule,
        GenresModule,
        BooksModule,
        UsersModule,
        ReviewsModule,
        TypeOrmModule.forFeature([Review, Book, Author, Genre, User]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Создаём автора
    const authorRes = await request(app.getHttpServer())
      .post('/authors')
      .send({ name: 'Тестовый автор' });
    const authorId = authorRes.body.id;

    // Создаём жанр
    const genreRes = await request(app.getHttpServer())
      .post('/genres')
      .send({ name: 'Тестовый жанр' });
    const genreId = genreRes.body.id;

    // Создаём книгу
    const bookRes = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'Книга для отзыва',
        price: 200,
        authorId,
        genreId,
      });
    bookId = bookRes.body.id;

    // Создаём пользователя
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Читатель',
        email: 'reader@example.com',
        password: 'secret',
      });
    userId = userRes.body.id;
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /reviews – создание отзыва', async () => {
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .send({
        rating: 5,
        comment: 'Отличная книга!',
        bookId,
        userId,
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.rating).toBe(5);
    expect(response.body.bookId).toBe(bookId);
    expect(response.body.userId).toBe(userId);
    reviewId = response.body.id;
  });

  it('GET /reviews – получение списка', async () => {
    const response = await request(app.getHttpServer())
      .get('/reviews')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    // Проверим, что связи подгружены
    expect(response.body[0]).toHaveProperty('book');
    expect(response.body[0]).toHaveProperty('user');
  });

  it('GET /reviews/:id – получение по ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/reviews/${reviewId}`)
      .expect(200);
    expect(response.body.id).toBe(reviewId);
    expect(response.body.rating).toBe(5);
    expect(response.body.book).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it('PUT /reviews/:id – обновление отзыва', async () => {
    const response = await request(app.getHttpServer())
      .put(`/reviews/${reviewId}`)
      .send({ rating: 4, comment: 'Хорошая книга' })
      .expect(200);
    expect(response.body.rating).toBe(4);
    expect(response.body.comment).toBe('Хорошая книга');
  });

  it('DELETE /reviews/:id – удаление отзыва', async () => {
    await request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .expect(204);
  });
});