import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Author } from '../authors/author.entity';
import { Genre } from '../genres/genre.entity';
import { Review } from '../reviews/review.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  publishedYear: number;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column()
  authorId: number;

  @ManyToOne(() => Genre, (genre) => genre.books)
  @JoinColumn({ name: 'genreId' })
  genre: Genre;

  @Column()
  genreId: number;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
}