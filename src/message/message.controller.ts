import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { RequestWithUser } from 'src/@types/request-with-user';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(
    @Request() request: RequestWithUser,
    @Body()
    data: {
      to: string;
      text: string;
    },
  ) {
    return this.messageService.create(request.user.user_id, data.to, data.text);
  }

  @Get(':id')
  find(@Request() request: RequestWithUser, @Param('id') id: string) {
    return this.messageService.find(request.user.user_id, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
