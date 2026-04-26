import { BaseEntity } from 'src/common/entities/base.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  firstName?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({
    // type: 'datetime',
    type: 'timestamp',
    nullable: true,
  })
  dateOfBirth?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  profileImage?: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
