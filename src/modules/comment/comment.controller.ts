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
  CreateCommentCommand,
  DeleteCommentCommand,
  UpdateCommentCommand,
  GetCommentsCommand,
} from './commands/comment.commands';

import {
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './comment.dto';
import Comment from '../../db/entities/comment.entity';

@Controller('comments')
@ApiTags('comments')
@UseInterceptors(ClassSerializerInterceptor)
export default class CommentsController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Return array of comments' })
  @ApiResponse({
    status: 200,
    description: 'Return array of comments',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Unable get comments' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @Get(':id')
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new GetCommentsCommand(id));
  }

  @ApiOperation({ description: 'Return new comment after creating' })
  @ApiResponse({
    status: 200,
    description: 'Return new comment',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Unable create new comment' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Comment content, post id',
    type: CreateCommentDto,
  })
  @Post(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  async createComment(
    @Body(new ValidationPipe()) data: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(data, id));
  }

  @ApiOperation({ description: 'Return comment after update' })
  @ApiResponse({ status: 200, description: 'Return comment', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Comment content, comment id',
    type: UpdateCommentDto,
  })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  async updateComment(
    @Body(new ValidationPipe()) data: UpdateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new UpdateCommentCommand(data, id));
  }

  @ApiOperation({ description: 'Return true after deleting comment' })
  @ApiResponse({ status: 200, description: 'Return true', type: 'Boolean' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 400, description: 'You can only delete your comment' })
  @ApiResponse({ status: 400, description: 'Unable delete post' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Comment id',
    type: DeleteCommentDto,
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  async deleteComment(
    @Body(new ValidationPipe()) data: DeleteCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(data, id));
  }
}
