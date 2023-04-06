import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Post from './post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Comment {
  @ApiProperty({ example: '1', description: 'Comment id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Some comment content',
    description: 'Comment content',
  })
  @Column()
  content: string;

  @ApiProperty({ example: '1', description: 'User id' })
  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @ApiProperty({ example: '1', description: 'Post id' })
  @Column({ type: 'varchar', nullable: false })
  postId: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (author) => author.id)
  @JoinColumn({ name: 'userId' })
  author: User;
}

export default Comment;
