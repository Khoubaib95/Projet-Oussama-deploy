import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const { params, user } = request;
      const comment = await this.repository.findOne({
        where: { comment_id: params.id },
        relations: ['user'],
      });
      if (!comment) {
        //console.log('not found');
        return true;
      }
      if (user.user_id === comment.user.user_id) {
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
