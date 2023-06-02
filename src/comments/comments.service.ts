import { Injectable, NotFoundException } from '@nestjs/common';
//import { CreateCommentDto } from './dto/create-comment.dto';
//import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Notifications } from 'src/notification/entities/notification.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user_id: string, post_id: string, text: string): Promise<any> {
    const comment_id = uuid();
    const comment = new Comment();
    comment.comment_id = comment_id;
    comment.post = { post_id } as Post;
    comment.user = { user_id } as User;
    comment.text = text;
    comment.createdAt = new Date();
    const userCreator = await this.userRepository.findOne({
      where: { user_id },
    });
    const postOwner = await this.postRepository.findOne({
      where: { post_id },
      relations: ['user'],
    });
    await this.createNotif(
      postOwner.user.user_id,
      `${userCreator.first_name} ${userCreator.last_name} a commenté votre annonce`,
    );
    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async findCommentsByPostId(post_id: string): Promise<Comment[]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post.post_id = :post_id', { post_id })
      .getMany();
    const commentData: Comment[] = [];
    try {
      const comments = await query;

      for (const comment of comments) {
        commentData.push(comment);
      }
    } catch (error) {
      console.error(error);
    }

    return commentData.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async findOne(comment_id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { comment_id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${comment_id} not found`);
    }
    return comment;
  }

  async update(comment_id: string, updatePostDto: any) {
    const comment = await this.commentRepository.findOne({
      where: { comment_id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${comment_id} not found`);
    }
    Object.assign(comment, updatePostDto);
    return this.commentRepository.save(comment);
  }

  async remove(post_id: string): Promise<any> {
    return await this.commentRepository.delete(post_id);
  }

  async createNotif(user_id: string, text: string): Promise<any> {
    const notif_id = uuid();
    const notifications = new Notifications();
    notifications.notif_id = notif_id;
    notifications.user = { user_id } as User;
    notifications.text = text;
    notifications.createdAt = new Date();

    return this.notificationsRepository.save(notifications);
  }
}
