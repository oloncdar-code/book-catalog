import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { CreateGenreDto, UpdateGenreDto } from './dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepo: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const genre = this.genreRepo.create(createGenreDto);
    return this.genreRepo.save(genre);
  }

  async findAll() {
    return this.genreRepo.find({ relations: { books: true } });
  }

  async findOne(id: number) {
    return this.genreRepo.findOne({ where: { id }, relations: { books: true } });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.genreRepo.update(id, updateGenreDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.genreRepo.delete(id);
  }
}