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
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AccessGuard } from 'src/common/authGuard';
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

  @Get()
  @UseGuards(AccessGuard)
  async getAllPosts() {
    return this.commandBus.execute(new GetAllPostsCommand());
  }

  @Post(':id')
  @UseGuards(AccessGuard)
  async createPost(
    @Body() body: CreatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body.text, id));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  async updatePost(
    @Body() body: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new UpdatePostCommand(body, id));
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  async deletePost(
    @Body() body: DeletePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new DeletePostCommand(body.postId, id));
  }
}
