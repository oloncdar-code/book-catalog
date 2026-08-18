import { IsString, IsOptional, IsNumber, Min, Max, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(9999)
  publishedYear?: number;

  @IsInt()
  authorId: number;

  @IsInt()
  genreId: number;
}