import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '60h' },
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
