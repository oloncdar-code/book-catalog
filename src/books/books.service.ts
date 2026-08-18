import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto, FilterBooksDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepo.create(createBookDto);
    return this.bookRepo.save(book);
  }

  async findAll(filterDto: FilterBooksDto) {
    const { page = 1, limit = 10, title, authorId, genreId, minPrice, maxPrice } = filterDto;
    const where: FindOptionsWhere<Book> = {};

    if (title) where.title = Like(`%${title}%`);
    if (authorId) where.authorId = authorId;
    if (genreId) where.genreId = genreId;
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      where.price = Between(0, maxPrice);
    }

    const [data, total] = await this.bookRepo.findAndCount({
      where,
      //relations: {'author':true, 'genre':true, 'reviews':true},
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.bookRepo.findOne({
      where: { id },
     // relations: { author: true, genre: true, reviews: { user: true } } ,
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.bookRepo.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.bookRepo.delete(id);
  }
}