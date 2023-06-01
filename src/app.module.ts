import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { CategorieModule } from './categorie/categorie.module';
import { CommentsModule } from './comments/comments.module';
import { User } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { Post, Image } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Category } from './categorie/entities/categorie.entity';
import { Message } from './message/entities/message.entity';
import { Notifications } from './notification/entities/notification.entity';
//
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sql7.freesqldatabase.com',
      port: 3306,
      username: 'sql7623051',
      password: 'PluHBzQElp',
      database: 'sql7623051',
      entities: [
        Auth,
        User,
        Post,
        Image,
        Comment,
        Category,
        Message,
        Notifications,
      ],
      synchronize: true,
    }),

    AuthModule,
    UserModule,
    PostsModule,
    CommentsModule,
    CategorieModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
