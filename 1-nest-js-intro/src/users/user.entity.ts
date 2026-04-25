import { BaseEntity } from 'src/common/entities/base.entity';
import { Profile } from 'src/profile/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  @JoinColumn()
  profile?: Profile;
}
