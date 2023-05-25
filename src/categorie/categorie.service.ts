import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categorie.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(name: string): Promise<any> {
    const cat_id = uuid();
    const category = new Category();
    category.cat_id = cat_id;
    category.name = name;
    category.createdAt = new Date();

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(cat_id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { cat_id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${cat_id} not found`);
    }
    return category;
  }

  async update(cat_id: string, updateCategoryDto: any) {
    const category = await this.categoryRepository.findOne({
      where: { cat_id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${cat_id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(cat_id: string): Promise<any> {
    return await this.categoryRepository.delete(cat_id);
  }
}
