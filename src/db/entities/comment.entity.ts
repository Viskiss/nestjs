import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Post from './post.entity';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'varchar', nullable: false })
  userId: number;

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
