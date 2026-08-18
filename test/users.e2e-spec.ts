import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/users/user.entity';
import { Review } from '../src/reviews/review.entity';
import { Book } from '../src/books/book.entity';
import { Author } from '../src/authors/author.entity';
import { Genre } from '../src/genres/genre.entity';
import { UsersModule } from '../src/users/users.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [User, Review, Book, Author, Genre], // все сущности
          synchronize: true,
          dropSchema: true,
        }),
        UsersModule,
        TypeOrmModule.forFeature([User, Review, Book, Author, Genre]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /users – создание пользователя', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Тест', email: 'test@example.com', password: 'secret123' })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
    userId = response.body.id;
  });

  it('GET /users – получение списка', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /users/:id – получение по ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);
    expect(response.body.id).toBe(userId);
  });

  it('PUT /users/:id – обновление', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ name: 'Обновлённый' })
      .expect(200);
    expect(response.body.name).toBe('Обновлённый');
  });

  it('DELETE /users/:id – удаление', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(204);
  });
});