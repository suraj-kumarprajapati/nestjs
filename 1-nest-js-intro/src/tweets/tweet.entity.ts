import { BaseEntity } from 'src/common/entities/base.entity';
import { HashTag } from 'src/hashtag/hashtag.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  text?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @ManyToOne(() => User, (user) => user.tweets)
  user!: User;

  @ManyToMany(() => HashTag)
  @JoinTable()
  hashTags?: HashTag[];
}
