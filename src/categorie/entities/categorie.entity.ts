import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  cat_id: string;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.category, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @Column({ nullable: true })
  createdAt: Date;
}
