import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';
import Post from './post.entity';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  postId: number;

  @ManyToOne(() => Post, (post: Post) => post.id)
  public post: Post;

  @ManyToOne(() => User, (author: User) => author.id)
  public author: User;
}

export default Comment;
