import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Genre } from '../src/genres/genre.entity';
import { Book } from '../src/books/book.entity';
import { Author } from '../src/authors/author.entity'; // добавить
import { Review } from '../src/reviews/review.entity'; // добавить
import { User } from '../src/users/user.entity'; // добавить
import { GenresModule } from '../src/genres/genres.module';

describe('GenresController (e2e)', () => {
  let app: INestApplication;
  let genreId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [Genre, Book, Author, Review, User], // все сущности
          synchronize: true,
          dropSchema: true,
        }),
        GenresModule,
        TypeOrmModule.forFeature([Genre, Book, Author, Review, User]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /genres – создание жанра', async () => {
    const response = await request(app.getHttpServer())
      .post('/genres')
      .send({
        name: 'Фантастика',
        description: 'Жанр научной фантастики',
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Фантастика');
    genreId = response.body.id;
  });

  it('GET /genres – получение списка', async () => {
    const response = await request(app.getHttpServer())
      .get('/genres')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /genres/:id – получение по ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/genres/${genreId}`)
      .expect(200);
    expect(response.body.id).toBe(genreId);
    expect(response.body.name).toBe('Фантастика');
    // Проверим, что поле books существует
    expect(response.body.books).toBeDefined();
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});