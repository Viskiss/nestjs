import User from 'src/db/entities/user.entity';
import { CreateCommentDto } from './comment.dto';

export class CreateCommentCommand {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: User['id'],
  ) {}
}
