import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post, Image } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Image]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '60h' },
    }),
    // TypeOrmModule.forFeature([User]),
    //TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
