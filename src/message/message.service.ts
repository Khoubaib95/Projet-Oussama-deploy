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
    message.to = { user_id: to } as User;
    message.text = text;
    message.createdAt = new Date();

    return await this.messageRepository.save(message);
  }
  async finds(user_id: string, to: string): Promise<any> {
    const user = { user_id } as User;
    const toUser = { user_id: to } as User;
    const messages = await this.messageRepository.find({
      /* where: {
        user: In([user.user_id, toUser.user_id]),
        to: In([user.user_id, toUser.user_id]),
      },*/
    });
    console.log(messages);
    return messages.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  async findconversations(user_id: string): Promise<any[]> {
    const conversations = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.to', 'toUser')
      .where('message.user_id = :userId OR message.to.user_id = :userId', {
        userId: user_id,
      })
      .groupBy('toUser.user_id')
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    const formattedConversations = conversations.map((conversation) => ({
      lastMessage: {
        messageId: conversation.message_id,
        text: conversation.text,
        createdAt: conversation.createdAt,
      },
      toUser: {
        userId: conversation.to.user_id,
        firstName: conversation.to.first_name,
        lastName: conversation.to.last_name,
      },
    }));

    return formattedConversations;
  }

  async find(user_id: string, to: string): Promise<any> {
    const user = { user_id } as User;
    const toUser = { user_id: to } as User;
    /*const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.to', 'toUser')
      .where('(message.user_id = :userId OR message.user_id = :toUserId)', {
        userId: user.user_id,
        toUserId: toUser.user_id,
      })
      .orWhere('(message.to = :userId OR message.to = :toUserId)', {
        userId: user.user_id,
        toUserId: toUser.user_id,
      })
      .leftJoinAndSelect('message.user', 'fromUser')
      .orderBy('message.createdAt', 'ASC')
      .getMany();
*/

    // Map the retrieved messages to include the toUser's first name and last name
    //console.log(messages);
    const messages = await this.messageRepository.find({
      where: {
        user: In([user.user_id, toUser.user_id]),
        to: In([user.user_id, toUser.user_id]),
      },
    });
    console.log(messages);
    const formattedMessages = messages.map((message) => ({
      messageId: message.message_id,
      text: message.text,
      createdAt: message.createdAt,
      /*user: {
        userId: message.user.user_id,
        firstName: message.user.first_name,
        lastName: message.user.last_name,
      },*/
      /*to: {
        userId: message.to.user_id,
        firstName: message.to.first_name,
        lastName: message.to.last_name,
      },*/
      to: message.to.user_id,
    }));

    return formattedMessages;
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
