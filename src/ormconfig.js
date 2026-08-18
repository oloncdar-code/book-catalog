import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});