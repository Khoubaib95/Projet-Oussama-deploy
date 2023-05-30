import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';
import { v4 as uuid } from 'uuid';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}
  async create(user_id: string, text: string): Promise<any> {
    const notif_id = uuid();
    const notifications = new Notifications();
    notifications.notif_id = notif_id;
    notifications.user = { user_id } as User;
    notifications.text = text;
    notifications.createdAt = new Date();

    return await this.notificationsRepository.save(notifications);
  }

  async findAll(user_id: string) {
    console.log('findAll');
    const notf = await this.notificationsRepository.find({
      where: { user: { user_id } },
    });
    console.log('notf', notf);
    return notf;
  }
}
