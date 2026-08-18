import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto';

@Controller('Genres')
export class GenresController {
  constructor(private readonly GenresService: GenresService) {}

  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.GenresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.GenresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.GenresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.GenresService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.GenresService.remove(+id);
  }
}