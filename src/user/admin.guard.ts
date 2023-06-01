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
      const u = await this.repository.findOne({
        where: { user_id: params.id },
      });
      if (!u) {
        return true;
      }
      if (user.user_id === u.user_id) {
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
