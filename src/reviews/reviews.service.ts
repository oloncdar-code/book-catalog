import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepo.create(createReviewDto);
    return this.reviewRepo.save(review);
  }

  async findAll() {
    return this.reviewRepo.find({ relations: { book: true, user: true } });
  }

  async findOne(id: number) {
    return this.reviewRepo.findOne({ where: { id }, relations: { book: true, user: true } });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.reviewRepo.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.reviewRepo.delete(id);
  }
}