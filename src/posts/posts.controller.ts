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
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestWithUser } from 'src/@types/request-with-user';
import { AdminGuard } from './admin.guard';
import { OnlyAdminGuard } from '../guards/admin.guard';

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
  findAll() {
    return this.postsService.findAll();
  }

  @Get('my-post')
  async myPost(@Request() request: RequestWithUser) {
    const posts = await this.postsService.myPost(request.user.user_id);
    return posts;
  }

  /*@Get('search-by-name/:name')
  async searchByName(@Param('name') name: string) {
    const posts = await this.postsService.searchByName(name);
    return posts;
  }*/

  @Get('search-by-category/:id')
  async searchByCategory(@Param('id') id: string) {
    const posts = await this.postsService.searchByCategory(id);
    return posts;
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Patch('addmit/:id')
  @UseGuards(OnlyAdminGuard)
  addmitPost(@Param('id') id: string) {
    return this.postsService.addmitPost(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
