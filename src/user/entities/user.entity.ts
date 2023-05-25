import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Message } from 'src/message/entities/message.entity';
import { Notifications } from 'src/notification/entities/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('uuid')
  auth_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 'USER' })
  role: string;

  @OneToOne(() => Auth)
  @JoinColumn({ name: 'auth_id' })
  auth: Auth;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
