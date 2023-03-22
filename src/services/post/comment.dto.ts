import { IsNotEmpty, IsString } from 'class-validator';
import Comment from 'src/db/entities/comment.entity';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: Comment;
}
