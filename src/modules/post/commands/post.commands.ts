import User from 'src/db/entities/user.entity';

import { UpdatePostDto } from '../post.dto';

export class CreatePostCommand {
  constructor(
    public readonly text: string,
    public readonly author: User['id'],
  ) {}
}

export class DeletePostCommand {
  constructor(public readonly postId: number, public readonly userId: number) {}
}

export class GetAllPostsCommand {}

export class UpdatePostCommand {
  constructor(
    public readonly body: UpdatePostDto,
    public readonly author: User['id'],
  ) {}
}
