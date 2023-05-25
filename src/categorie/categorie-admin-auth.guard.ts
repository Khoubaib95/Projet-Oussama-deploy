import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/categorie.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  async canActivate(context: ExecutionContext) {
    //const request = context.switchToHttp().getRequest();
    try {
      // request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
