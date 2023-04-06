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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessGuard } from '../../common/authGuard';
import {
  GetAllPostsCommand,
  CreatePostCommand,
  UpdatePostCommand,
  DeletePostCommand,
} from './commands/post.commands';

import { CreatePostDto, DeletePostDto, UpdatePostDto } from './post.dto';
import IPost from '../../db/entities/post.entity';

@Controller('posts')
@ApiTags('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Return all posts' })
  @ApiResponse({ status: 200, description: 'Return posts', type: IPost })
  @ApiResponse({ status: 400, description: 'Unable get all posts' })
  @Get('getAll')
  async getAllPosts() {
    return this.commandBus.execute(new GetAllPostsCommand());
  }

  @ApiOperation({ description: 'Return post after creating' })
  @ApiResponse({ status: 200, description: 'Return post', type: IPost })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Unable create post' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Post text',
    type: CreatePostDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Post(':id')
  async createPost(
    @Body(new ValidationPipe()) body: CreatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body.text, id));
  }

  @ApiOperation({ description: 'Return post after update' })
  @ApiResponse({ status: 200, description: 'Return post', type: IPost })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'You can only update your post' })
  @ApiResponse({ status: 400, description: 'Need new text for update' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Post text, post id',
    type: UpdatePostDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updatePost(
    @Body(new ValidationPipe()) body: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new UpdatePostCommand(body, id));
  }

  @ApiOperation({ description: 'Return true after deleting' })
  @ApiResponse({ status: 200, description: 'Return true' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'You can only delete your post' })
  @ApiResponse({ status: 400, description: 'Unable delete post' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Post id',
    type: DeletePostDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deletePost(
    @Body(new ValidationPipe()) body: DeletePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new DeletePostCommand(body.postId, id));
  }
}
