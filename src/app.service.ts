import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { app_status: string } {
    return { app_status: 'ok' };
  }
}
