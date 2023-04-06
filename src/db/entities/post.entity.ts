import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import Comment from './comment.entity';
import User from './user.entity';

@Entity()
class Post {
  @ApiProperty({ example: '1', description: 'Post id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Some post text', description: 'Post text' })
  @Column({ type: 'varchar', nullable: false })
  text: string;

  @ApiProperty({ example: '1', description: 'User id' })
  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.content)
  comments: Comment[];
}

export default Post;
