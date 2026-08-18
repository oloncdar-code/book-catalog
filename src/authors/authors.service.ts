import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepo: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepo.create(createAuthorDto);
    return this.authorRepo.save(author);
  }

  async findAll() {
    return this.authorRepo.find({ relations: { books: true } });
  }

  async findOne(id: number) {
    return this.authorRepo.findOne({ where: { id }, relations: { books: true } });
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.authorRepo.update(id, updateAuthorDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.authorRepo.delete(id);
  }
}