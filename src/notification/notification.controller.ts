import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RequestWithUser } from 'src/@types/request-with-user';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Request() request: RequestWithUser, @Body() data: { text: string }) {
    return this.notificationService.create(request.user.user_id, data.text);
  }

  @Get()
  findOne(@Request() request: RequestWithUser) {
    return this.notificationService.findAll(request.user.user_id);
  }
}
