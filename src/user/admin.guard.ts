import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const { params, user } = request;
      if (user.user_id === params.id) {
        return true;
      }
      if (user.role === 'ADMIN') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
