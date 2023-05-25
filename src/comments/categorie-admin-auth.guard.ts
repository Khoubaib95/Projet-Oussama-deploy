import {
  Injectable,
  CanActivate,
  ExecutionContext,
  //Request,
} from '@nestjs/common';
//import { CommentsService } from './comments.service';
//import { Comment } from './entities/comment.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  /* constructor(private readonly service: CommentsService) {
    this.service = new CommentsService();
  }*/

  async canActivate(context: ExecutionContext) {
    //const request = context.switchToHttp().getRequest();

    try {
      //console.log(request);
      /*const comment = await this.repository.findOne({
        where: { user: { user_id: request.user.id } },
      });*/
      // request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
