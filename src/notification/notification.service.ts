import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}
  /*async create(user_id: string, text: string): Promise<any> {
    const notif_id = uuid();
    const notifications = new Notifications();
    notifications.notif_id = notif_id;
    notifications.user = { user_id } as User;
    notifications.text = text;
    notifications.createdAt = new Date();
    return await this.notificationsRepository.save(notifications);
  }*/

  async findAll(user_id: string) {
    const notf = await this.notificationsRepository.find({
      where: { user: { user_id } },
    });
    return notf.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}
