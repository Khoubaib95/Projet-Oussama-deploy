import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const { params, user } = request;
      const post = await this.repository.findOne({
        where: { post_id: params.id },
        relations: ['user'],
      });
      if (!post) {
        //console.log('not found');
        return true;
      }
      if (user.user_id === post.user.user_id) {
        //console.log('is user');
        return true;
      }
      if (user.role === 'ADMIN') {
        console.log('is admin');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
