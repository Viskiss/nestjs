import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class DeletePostDto {
  @IsString()
  @IsNotEmpty()
  postId: number;
}

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
