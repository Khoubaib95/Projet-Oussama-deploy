import { Request } from '@nestjs/common';
export interface RequestWithUser extends Request {
  user: { auth_id: string; user_id: string; email: string };
}
