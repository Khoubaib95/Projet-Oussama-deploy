import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostsService } from './posts.service';
//import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from 'src/@types/request-with-user';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Request() request: RequestWithUser,
    @Body()
    data: {
      name: string;
      cat_id: string;
      description: string;
      gender: string;
      age: string;
      images: string[];
    },
  ) {
    return this.postsService.create(
      request.user.user_id,
      data.cat_id,
      data.name,
      data.description,
      data.gender,
      data.age,
      data.images,
    );
  }

  @Get()
  findAll(@Request() request: RequestWithUser) {
    console.log(request);
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
