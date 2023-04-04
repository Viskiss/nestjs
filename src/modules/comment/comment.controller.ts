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
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './comment.dto';
import {
  CreateCommentCommand,
  DeleteCommentCommand,
} from './commands/comment.commands';
import {
  UpdateCommentCommand,
  GetCommentsCommand,
} from './commands/comment.commands';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export default class CommentsController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  @UseGuards(AccessGuard)
  async getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new GetCommentsCommand(id));
  }

  @Post(':id')
  @UseGuards(AccessGuard)
  async createComment(
    @Body(new ValidationPipe()) data: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(data, id));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  async updateComment(
    @Body(new ValidationPipe()) data: UpdateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new UpdateCommentCommand(data, id));
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  async deleteComment(
    @Body(new ValidationPipe()) data: DeleteCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(data, id));
  }
}
