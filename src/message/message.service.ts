import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from './entities/message.entity';
import { v4 as uuid } from 'uuid';

export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(user_id: string, to: string, text: string): Promise<any> {
    const message_id = uuid();
    const message = new Message();
    message.message_id = message_id;
    message.user = { user_id } as User;
    message.to = to;
    message.text = text;
    message.createdAt = new Date();

    return await this.messageRepository.save(message);
  }
  /*async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user', 'images', 'comments'],
    });
  }*/
  async find(user_id: string, to: string): Promise<any> {
    const user = { user_id } as User;
    const messages = await this.messageRepository.find({
      where: { user: In([user.user_id, to]), to: In([user.user_id, to]) },
    });
    return messages.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  /* async update(post_id: string, updatePostDto: any) {
    const post = await this.messageRepository.findOne({ where: { post_id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${post_id} not found`);
    }
    Object.assign(post, updatePostDto);
    return this.messageRepository.save(post);
  }*/

  async remove(message_id: string): Promise<any> {
    return await this.messageRepository.delete(message_id);
  }
}
