import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/@types/request-with-user';
//import { AdminGuard } from './categorie-admin-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Request() request: RequestWithUser,
    @Body()
    data: {
      post_id: string;
      text: string;
    },
  ) {
    return this.commentsService.create(
      request.user.user_id,
      data.post_id,
      data.text,
    );
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  //@UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return 'ok'; //this.commentsService.remove(id);
  }
}
