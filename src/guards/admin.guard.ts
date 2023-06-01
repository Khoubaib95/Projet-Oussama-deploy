import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const { user } = request;

      if (user.role === 'ADMIN') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
