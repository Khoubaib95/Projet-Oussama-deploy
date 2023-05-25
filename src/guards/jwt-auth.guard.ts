import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);

    if (!token) {
      return false;
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'your_secret_key',
      });
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractJwtFromRequest(request: any) {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
