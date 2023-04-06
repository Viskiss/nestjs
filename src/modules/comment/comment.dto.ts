import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment content',
    example: 'Some comment string content',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post id',
    example: '1',
  })
  postId: number;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment content',
    example: 'Some comment string content',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment id',
    example: '1',
  })
  commentId: number;
}

export class DeleteCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Comment id',
    example: '1',
  })
  commentId: number;
}
