import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Author } from '../src/authors/author.entity';
import { Book } from '../src/books/book.entity';
import { Genre } from '../src/genres/genre.entity'; // добавить
import { Review } from '../src/reviews/review.entity'; // добавить
import { User } from '../src/users/user.entity'; // добавить
import { AuthorsModule } from '../src/authors/authors.module';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication;
  let authorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [Author, Book, Genre, Review, User], // все сущности
          synchronize: true,
          dropSchema: true,
        }),
        AuthorsModule,
        TypeOrmModule.forFeature([Author, Book, Genre, Review, User]), // тоже все
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /authors – создание автора', async () => {
    const response = await request(app.getHttpServer())
      .post('/authors')
      .send({
        name: 'Тестовый автор',
        bio: 'Биография',
        birthDate: '2000-01-01',
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Тестовый автор');
    authorId = response.body.id;
  });

  it('GET /authors – получение списка', async () => {
    const response = await request(app.getHttpServer())
      .get('/authors')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /authors/:id – получение автора по ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/authors/${authorId}`)
      .expect(200);
    expect(response.body.id).toBe(authorId);
    expect(response.body.name).toBe('Тестовый автор');
    // Проверим, что поле books существует (пустой массив)
    expect(response.body.books).toBeDefined();
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});