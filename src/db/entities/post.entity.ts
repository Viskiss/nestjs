import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import Comment from './comment.entity';

import User from './user.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @OneToMany(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default Post;
