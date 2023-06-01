import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Category } from '../../categorie/entities/categorie.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column()
  isAddmitted: boolean;

  @Column({ nullable: true })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images: Image[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @ManyToOne(() => Category, (category) => category.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cat_id' })
  category: Category;
}

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  image_id: string;

  @Column()
  url: string;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
