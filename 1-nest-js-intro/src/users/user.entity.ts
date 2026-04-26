import { BaseEntity } from 'src/common/entities/base.entity';
import { Profile } from 'src/profile/profile.entity';
import { Tweet } from 'src/tweets/tweet.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    nullable: false,
    type: 'varchar',
    length: 25,
  })
  username!: string;

  @Column({
    unique: true,
    nullable: false,
    type: 'varchar',
  })
  email!: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 100,
    select: false,
  })
  password!: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    // eager: true, // for eager loading
  })
  // @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets?: Tweet[];
}
