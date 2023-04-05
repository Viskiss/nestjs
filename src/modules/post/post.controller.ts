import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AccessGuard } from '../../common/authGuard';
import {
  GetAllPostsCommand,
  CreatePostCommand,
  UpdatePostCommand,
  DeletePostCommand,
} from './commands/post.commands';

import { CreatePostDto, DeletePostDto, UpdatePostDto } from './post.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(AccessGuard)
  @Get('getAll')
  async getAllPosts() {
    return this.commandBus.execute(new GetAllPostsCommand());
  }

  @UseGuards(AccessGuard)
  @Post(':id')
  async createPost(
    @Body(new ValidationPipe()) body: CreatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body.text, id));
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  async updatePost(
    @Body(new ValidationPipe()) body: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new UpdatePostCommand(body, id));
  }

  @UseGuards(AccessGuard)
  @Delete(':id')
  async deletePost(
    @Body(new ValidationPipe()) body: DeletePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new DeletePostCommand(body.postId, id));
  }
}
