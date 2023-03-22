import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AccessGuard } from 'src/common/authGuard';
import { CreateCommentDto } from './comment.dto';
import { CreateCommentCommand } from './createComment.command';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export default class CommentsController {
  constructor(private commandBus: CommandBus) {}

  @Post(':id')
  @UseGuards(AccessGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(comment, id));
  }
}
