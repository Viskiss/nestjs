import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class User {
  @ApiProperty({ example: '1', description: 'User id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Aboba Boba', description: 'User full name' })
  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @ApiProperty({ example: 'zaza@mail.ru', description: 'User email' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'some avatar string location',
    description: 'User avatar',
  })
  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @ApiHideProperty()
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;
}

export default User;
