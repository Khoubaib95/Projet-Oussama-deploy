import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
//import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn('uuid')
  notif_id: string;

  @Column()
  text: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
