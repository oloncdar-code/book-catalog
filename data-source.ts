import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Author } from './src/authors/author.entity';
import { Genre } from './src/genres/genre.entity';
import { Book } from './src/books/book.entity';
import { Review } from './src/reviews/review.entity';
import { User } from './src/users/user.entity';

ConfigModule.forRoot();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Author, Genre, Book, Review, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});