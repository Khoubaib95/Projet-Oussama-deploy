import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from './entities/message.entity';
import { v4 as uuid } from 'uuid';

export class MessageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  /*async finds(user_id: string, to: string): Promise<any> {
    const user = { user_id } as User;
    const toUser = { user_id: to } as User;
    const messages = await this.messageRepository.find({
      /* where: {
        user: In([user.user_id, toUser.user_id]),
        to: In([user.user_id, toUser.user_id]),
      },
    });
    console.log(messages);
    return messages.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }*/

  async findconversations(user_id: string): Promise<any[]> {
    const users = await this.userRepository.find({
      select: ['auth_id', 'first_name', 'last_name', 'phone_number'],
      where: {
        user_id: Not(user_id),
      },
    });
    /*   const sortedData = conversations.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const results = sortedData.reduce((acc, obj) => {
      const { user_id } = obj.to;
      if (!acc[user_id]) {
        acc[user_id] = [];
      }
      acc[user_id].push({
        message_id: obj.message_id,
        createdAt: obj.createdAt,
        text: obj.text,
        user_id: obj.user.user_id,
        to: {
          user_id: obj.to.user_id,
          first_name: obj.to.first_name,
          last_name: obj.to.last_name,
        },
      });
      return acc;
    }, {});
    const re = [];
    for (const key in results) {
      re.push(results[key][0]);
    }*/
    return users;
  }

  async find(user_id: string, to: string): Promise<any> {
    const user = { user_id } as User;
    const toUser = { user_id: to } as User;
    const messages = await this.messageRepository.find({
      where: {
        user: In([user.user_id, toUser.user_id]),
        to: In([user.user_id, toUser.user_id]),
      },
      relations: ['to'],
    });
    const formattedMessages = messages.map((message) => ({
      message_id: message.message_id,
      text: message.text,
      createdAt: message.createdAt,
      to: {
        user_id: message.to.user_id,
        first_name: message.to.first_name,
        last_name: message.to.last_name,
      },
    }));

    return formattedMessages.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  async remove(message_id: string): Promise<any> {
    return await this.messageRepository.delete(message_id);
  }
}
