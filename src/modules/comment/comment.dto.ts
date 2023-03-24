import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  postId: number;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  commentId: number;
}

export class DeleteCommentDto {
  @IsString()
  @IsNotEmpty()
  commentId: number;
}
