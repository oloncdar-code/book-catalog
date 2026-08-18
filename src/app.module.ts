import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Author } from './authors/author.entity';
import { Genre } from './genres/genre.entity';
import { Book } from './books/book.entity';
import { Review } from './reviews/review.entity';
import { User } from './users/user.entity';
import { AuthorsModule } from './authors/authors.module';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [Author, Genre, Book, Review, User],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthorsModule,
    GenresModule,
    BooksModule,
    ReviewsModule,
    UsersModule,
  ],
})
export class AppModule {}