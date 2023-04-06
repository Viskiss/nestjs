import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post text',
    example: 'Some post string text',
  })
  text: string;
}

export class DeletePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post id',
    example: '1',
  })
  postId: number;
}

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post id',
    example: '1',
  })
  postId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Post text',
    example: 'Some post string text',
  })
  text: string;
}
