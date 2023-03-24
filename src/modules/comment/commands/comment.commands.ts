import { CreateCommentDto, DeleteCommentDto } from '../comment.dto';
import { UpdateCommentDto } from '../comment.dto';

export class CreateCommentCommand {
  constructor(
    public readonly data: CreateCommentDto,
    public readonly author: number,
  ) {}
}

export class GetCommentsCommand {
  constructor(public readonly author: number) {}
}

export class UpdateCommentCommand {
  constructor(
    public readonly data: UpdateCommentDto,
    public readonly author: number,
  ) {}
}

export class DeleteCommentCommand {
  constructor(
    public readonly data: DeleteCommentDto,
    public readonly author: number,
  ) {}
}
