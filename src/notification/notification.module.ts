import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
//import { CommentsService } from 'src/comments/comments.service';

@Module({
  imports: [
    //CommentsService,
    TypeOrmModule.forFeature([Notifications]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '60h' },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
