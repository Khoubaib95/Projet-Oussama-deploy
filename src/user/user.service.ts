import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, //@InjectRepository(Post) private readonly postRepository: Repository<Post>, //@InjectRepository(Comment) //private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(user_id: string): Promise<User> {
    const comment = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!comment) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    return comment;
  }

  async update(user_id: string, updatePostDto: any) {
    const comment = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!comment) {
      throw new NotFoundException(`User with ID ${user_id} not found`); //
    }
    Object.assign(comment, updatePostDto);
    return this.userRepository.save(comment);
  }

  async remove(user_id: string): Promise<any> {
    return await this.userRepository.delete(user_id);
  }
}
