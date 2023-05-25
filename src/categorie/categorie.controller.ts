import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
//import { CreateCategorieDto } from './dto/create-categorie.dto';
//import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categorie')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@Body() createCategorieDto: { name: string }) {
    return this.categorieService.create(createCategorieDto.name);
  }

  @Get()
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorieService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategorieDto: { name: string },
  ) {
    return this.categorieService.update(id, updateCategorieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorieService.remove(id);
  }
}
