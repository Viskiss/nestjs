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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  text: string;

  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @OneToMany(() => Comment, (comment) => comment.content)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  author: User;
}

export default Post;
