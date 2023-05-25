import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { CreatePostDto } from './dto/create-post.dto';
//import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities/user.entity';
import { Post, Image } from './entities/post.entity';
import { Category } from 'src/categorie/entities/categorie.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>, //@InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    user_id: string,
    cat_id: string,
    name: string,
    description: string,
    gender: string,
    age: string,
    images: string[],
  ): Promise<any> {
    const post_id = uuid();
    const post = new Post();
    post.post_id = post_id;
    post.category = { cat_id } as Category;
    post.name = name;
    post.description = description;
    post.user = { user_id } as User;
    post.gender = gender;
    post.age = age;
    post.createdAt = new Date();

    const posts = await this.postRepository.save(post);
    const image = await Promise.all(
      images.map((img) => {
        const image = this.imagesRepository.create({
          image_id: uuid(),
          url: img,
          post: { post_id } as Post,
        });
        return this.imagesRepository.save(image);
      }),
    );
    delete posts.user;
    const returnPost = {
      ...posts,
      images: image.map((i) => ({
        image_id: i.image_id,
        url: i.url,
      })),
    };
    return returnPost;
  }
  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user', 'images', 'comments'],
    });
  }
  async findOne(post_id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { post_id },
      relations: ['user', 'images', 'comments'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${post_id} not found`);
    }
    return post;
  }

  async update(post_id: string, updatePostDto: any) {
    const post = await this.postRepository.findOne({ where: { post_id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${post_id} not found`);
    }
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(post_id: string): Promise<any> {
    return await this.postRepository.delete(post_id);
  }
}
