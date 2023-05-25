import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Post } from 'src/posts/entities/post.entity';
//import { NotificationModule } from 'src/notification/notification.module';
import { Notifications } from 'src/notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notifications]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Post]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '60h' },
    }),
  ],

  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
